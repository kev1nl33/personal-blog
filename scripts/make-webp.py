#!/usr/bin/env python3
"""为旅行照片生成 800w / 1600w WebP 变体，只写入本地暂存目录。

源图分两类：
- R2 上的旅行照片（/media/travel/<目的地>/<文件>.jpg）：从站点公开地址下载后缓存；
- 仍保留在仓库里的新加坡照片（images/travel/singapore-2025/*.jpg）：直接读本地副本。

输出到暂存目录（默认 ~/cc-tasks/webp/out/<目的地>/<文件名>-800.webp 与 -1600.webp），
不写回仓库。变体保留原始比例，长边不放大：源宽不足目标宽度时按源宽输出。
WebP 不写入 EXIF / XMP / ICC，脚本结束时逐文件检查 RIFF 块。

用法：
    python3 scripts/make-webp.py --only australia-0839,singapore-147   # 先验样本
    python3 scripts/make-webp.py                                       # 全量 + 清单
    python3 scripts/make-webp.py --manifest-only                       # 只重写清单
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import http.client
import io
import json
import os
import re
import struct
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
TASK_DIR = Path.home() / 'cc-tasks' / 'webp'
DEFAULT_OUT = TASK_DIR / 'out'
DEFAULT_CACHE = TASK_DIR / 'src'
MANIFEST_PATH = TASK_DIR / 'upload-manifest.txt'
BASE_URL = 'https://aikevin.dpdns.org'

# 页面里实际引用旅行照片的文件；旅游页、游记、回忆录静态列表与回忆录数据
PAGE_FILES = [
    'travel.html',
    'travel-australia-2026.html',
    'travel-japan-2023.html',
    'travel-singapore-2025.html',
    'travel-uk-2024.html',
    'gallery.html',
]
DATA_FILES = ['data/memoir.json']

MEDIA_REF = re.compile(r'(?:(?:src|href)=")((?:/media/travel/|images/travel/)[^"]+\.jpe?g)"')
TARGETS = (800, 1600)
# 质量梯度：从 78 起，如果 WebP 体积超过原 JPEG 就降一档重编。
# 少数高细节照片（树影、石纹）在 q78 下会比原图更大，降到 66 为止；
# 仍超过的按 66 输出并在清单里如实记录，不继续压画质。
QUALITY_LADDER = (78, 74, 70, 66)
PARAMS = {'quality_ladder': list(QUALITY_LADDER), 'method': 6}


def trip_and_name(reference: str) -> tuple[str, str]:
    """'/media/travel/australia-2026/australia-0839.jpg' -> ('australia-2026', 'australia-0839.jpg')"""
    parts = reference.split('/')
    return parts[-2], parts[-1]


def collect_sources() -> dict[str, dict]:
    """扫描页面与数据，返回 {原始引用路径: {trip, name}}，去重且保持稳定顺序。"""
    found: dict[str, dict] = {}
    for filename in PAGE_FILES + DATA_FILES:
        source = (ROOT / filename).read_text(encoding='utf-8')
        for match in MEDIA_REF.finditer(source):
            reference = match.group(1)
            trip, name = trip_and_name(reference)
            entry = found.setdefault(reference, {'trip': trip, 'name': name})
            if entry['trip'] != trip:
                raise SystemExit(f'{reference} 同时出现在两个目录')
    return dict(sorted(found.items(), key=lambda item: (item[1]['trip'], item[1]['name'])))


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def cache_path(cache: Path, trip: str, name: str) -> Path:
    return cache / trip / name


def download(reference: str, trip: str, name: str, cache: Path) -> Path:
    """把 R2 原图下载到缓存目录；已存在则直接复用。"""
    target = cache_path(cache, trip, name)
    if target.exists() and target.stat().st_size > 0:
        return target
    target.parent.mkdir(parents=True, exist_ok=True)
    url = BASE_URL + reference
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'blog-webp/1.0'})
            with urllib.request.urlopen(request, timeout=90) as response:
                body = response.read()
                expected = response.headers.get('Content-Length')
            if expected and int(expected) != len(body):
                raise IOError(f'长度不匹配：期望 {expected}，实际 {len(body)}')
            if not body.startswith(b'\xff\xd8'):
                raise IOError('返回内容不是 JPEG')
            temporary = target.with_suffix('.part')
            temporary.write_bytes(body)
            os.replace(temporary, target)
            return target
        except (urllib.error.URLError, OSError, http.client.HTTPException) as error:
            last_error = error
            time.sleep(1.5 * (attempt + 1))
    raise SystemExit(f'下载失败 {url}：{last_error}')


def prefetch(references: list[str], sources: dict[str, dict], cache: Path, workers: int = 4) -> None:
    """并发预热下载缓存，主机不稳定时单张失败不影响其后的重试逻辑。"""
    pending = [reference for reference in references if reference.startswith('/media/')
               and not cache_path(cache, sources[reference]['trip'], sources[reference]['name']).is_file()]
    if not pending:
        return
    print(f'预下载 {len(pending)} 张原图…')
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {
            pool.submit(download, reference, sources[reference]['trip'], sources[reference]['name'], cache): reference
            for reference in pending
        }
        for index, future in enumerate(concurrent.futures.as_completed(futures), 1):
            try:
                future.result()
            except SystemExit as error:
                print(f'  [{index}/{len(pending)}] 失败：{error}', file=sys.stderr)
            else:
                print(f'  [{index}/{len(pending)}] 完成')


def local_copy(reference: str) -> Path:
    """仓库内保留的原图（新加坡），只读。"""
    path = ROOT / reference
    if not path.is_file():
        raise SystemExit(f'本地原图不存在：{reference}')
    return path


def source_bytes(reference: str, entry: dict, cache: Path) -> tuple[Path, bytes]:
    if reference.startswith('/media/'):
        path = download(reference, entry['trip'], entry['name'], cache)
    else:
        path = local_copy(reference)
    return path, path.read_bytes()


def encode(data: bytes, target_width: int) -> tuple[bytes, int, int, int]:
    """按目标宽度生成 WebP；不放大，返回 (字节, 宽, 高, 实际质量)。

    质量从 QUALITY_LADDER 最高档往下试，第一档不超过原 JPEG 体积就用它；
    全部超了就取最低档，并在返回值里带上实际质量供清单记录。
    """
    with Image.open(io.BytesIO(data)) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode not in ('RGB', 'RGBA'):
            image = image.convert('RGB')
        width, height = image.size
        out_width = min(target_width, width)
        out_height = max(1, round(height * out_width / width))
        if (out_width, out_height) != (width, height):
            image = image.resize((out_width, out_height), Image.LANCZOS)
        # 用裸像素重建图像，确保 info 里的 exif/icc/xmp 不会跟着图像对象走
        clean = Image.frombytes(image.mode, image.size, image.tobytes())
        payload, quality = b'', QUALITY_LADDER[-1]
        for quality in QUALITY_LADDER:
            buffer = io.BytesIO()
            clean.save(buffer, 'WEBP', quality=quality, method=PARAMS['method'])
            payload = buffer.getvalue()
            if len(payload) <= len(data):
                break
        return payload, out_width, out_height, quality


def riff_chunks(data: bytes) -> list[str]:
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
        raise ValueError('不是 WebP 文件')
    chunks, offset = [], 12
    while offset + 8 <= len(data):
        fourcc = data[offset:offset + 4].decode('latin-1')
        size = struct.unpack('<I', data[offset + 4:offset + 8])[0]
        chunks.append(fourcc)
        offset += 8 + size + (size & 1)
    return chunks


FORBIDDEN_CHUNKS = {'EXIF', 'XMP ', 'ICCP'}


def verify_metadata(path: Path) -> None:
    data = path.read_bytes()
    leaked = FORBIDDEN_CHUNKS.intersection(riff_chunks(data))
    if leaked:
        raise SystemExit(f'{path} 残留元数据块：{sorted(leaked)}')
    with Image.open(io.BytesIO(data)) as image:
        if image.getexif():
            raise SystemExit(f'{path} 仍带 EXIF')
        if image.info.get('icc_profile') or image.info.get('xmp'):
            raise SystemExit(f'{path} 仍带 ICC/XMP')


def load_state(state_file: Path) -> dict:
    if not state_file.is_file():
        return {'version': 1, 'params': PARAMS, 'files': {}}
    state = json.loads(state_file.read_text(encoding='utf-8'))
    if state.get('params') != PARAMS:
        return {'version': 1, 'params': PARAMS, 'files': {}}
    return state


def build(references: list[str], out: Path, cache: Path, prune: bool = True) -> list[dict]:
    sources = collect_sources()
    if not references:
        references = list(sources)
    unknown = [item for item in references if item not in sources]
    if unknown:
        raise SystemExit(f'页面未引用的图片不生成：{unknown}')

    out.mkdir(parents=True, exist_ok=True)
    state_file = out / '.state.json'
    state = load_state(state_file)
    records, encoded, reused = [], 0, 0
    expected: set[Path] = set()

    for index, reference in enumerate(references, 1):
        entry = sources[reference]
        source_path, data = source_bytes(reference, entry, cache)
        digest = sha256(data)
        stem = Path(entry['name']).stem
        trip_dir = out / entry['trip']
        trip_dir.mkdir(parents=True, exist_ok=True)
        variants = []
        for target in TARGETS:
            variant_path = trip_dir / f'{stem}-{target}.webp'
            expected.add(variant_path)
            relative = str(variant_path.relative_to(out))
            known = state['files'].get(relative)
            if (
                variant_path.is_file()
                and known
                and known.get('src_sha256') == digest
                and known.get('bytes') == variant_path.stat().st_size
            ):
                with Image.open(variant_path) as existing:
                    width, height = existing.size
                quality = known.get('quality')
                reused += 1
            else:
                payload, width, height, quality = encode(data, target)
                temporary = variant_path.with_suffix('.part')
                temporary.write_bytes(payload)
                verify_metadata(temporary)
                os.replace(temporary, variant_path)
                state['files'][relative] = {
                    'src_sha256': digest,
                    'bytes': variant_path.stat().st_size,
                    'width': width,
                    'height': height,
                    'quality': quality,
                }
                encoded += 1
            variants.append({
                'path': variant_path,
                'width': width,
                'height': height,
                'bytes': variant_path.stat().st_size,
                'quality': quality,
            })
        records.append({
            'reference': reference,
            'trip': entry['trip'],
            'name': entry['name'],
            'stem': stem,
            'source': str(source_path),
            'source_bytes': len(data),
            'variants': variants,
        })
        print(f'[{index}/{len(references)}] {reference} -> '
              + ', '.join(f'{v["width"]}w/q{v["quality"]}/{v["bytes"] // 1024}KB' for v in variants))

    # 清掉不再被引用的旧变体，保证清单和页面引用一一对应（样本运行不清理）
    if prune:
        for trip in {record['trip'] for record in records}:
            for stale in (out / trip).glob('*.webp'):
                if stale not in expected:
                    stale.unlink()
                    state['files'].pop(str(stale.relative_to(out)), None)
                    print(f'清理旧变体 {stale}')

    state_file.write_text(json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True) + '\n', encoding='utf-8')
    (out / 'manifest.json').write_text(
        json.dumps({'params': PARAMS, 'photos': [
            {**record, 'variants': [
                {**variant, 'path': str(variant['path'])} for variant in record['variants']
            ]} for record in records
        ]}, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    print(f'完成：新编码 {encoded}，复用 {reused}，共 {len(records)} 张原图')
    return records


def write_upload_manifest(out: Path, manifest: Path) -> None:
    lines, total_bytes = [], 0
    for trip_dir in sorted(path for path in out.iterdir() if path.is_dir()):
        for variant in sorted(trip_dir.glob('*.webp')):
            size = variant.stat().st_size
            key = f'travel/{trip_dir.name}/{variant.name}'
            lines.append(f'{variant}  {key}  {size}')
            total_bytes += size
    manifest.write_text(
        '\n'.join(lines) + f'\n\nTOTAL {len(lines)} files {total_bytes} bytes\n',
        encoding='utf-8',
    )
    print(f'清单：{manifest}（{len(lines)} 个文件，{total_bytes / 1024 / 1024:.2f} MB）')


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--only', help='只生成指定文件名（不含扩展名），逗号分隔')
    parser.add_argument('--out', type=Path, default=DEFAULT_OUT)
    parser.add_argument('--cache', type=Path, default=DEFAULT_CACHE)
    parser.add_argument('--manifest-only', action='store_true')
    args = parser.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)
    if args.manifest_only:
        write_upload_manifest(args.out, MANIFEST_PATH)
        return 0

    if args.only:
        wanted = {item.strip() for item in args.only.split(',') if item.strip()}
        sources = collect_sources()
        references = [ref for ref, entry in sources.items() if Path(entry['name']).stem in wanted]
        missing = wanted - {Path(entry['name']).stem for entry in sources.values()}
        if missing:
            raise SystemExit(f'未在页面引用中找到：{sorted(missing)}')
    else:
        references = []

    prefetch(references or list(collect_sources()), collect_sources(), args.cache)
    records = build(references, args.out, args.cache, prune=not args.only)
    if not args.only:
        write_upload_manifest(args.out, MANIFEST_PATH)
    total_source = sum(record['source_bytes'] for record in records)
    total_variant = sum(sum(variant['bytes'] for variant in record['variants']) for record in records)
    print(f'源图合计 {total_source / 1024 / 1024:.2f} MB，变体合计 {total_variant / 1024 / 1024:.2f} MB')
    return 0


if __name__ == '__main__':
    sys.exit(main())
