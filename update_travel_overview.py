#!/usr/bin/env python3
"""从总览卡片和实拍素材更新旅行统计，保留手工维护的 HTML。"""

from pathlib import Path
import re

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
PHOTO_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic'}
# /media/ 旅行照片存 R2，本地只剩页面引用，按游记页收录的去重引用计数
MEDIA_PHOTO_PATTERN = r'/[A-Za-z0-9_.-]+\.(?:jpe?g|png|webp|avif|gif|heic)'
# 响应式变体（*-800.webp / *-1600.webp）与原图共用一张照片，统计时不计入
RESPONSIVE_VARIANT = re.compile(r'-(?:800|1600)\.webp$')


def collect_media_photos(directory, trip):
    journal = ROOT / trip['href']
    pattern = re.compile(re.escape(directory) + MEDIA_PHOTO_PATTERN)
    trip_photos = {
        photo for photo in pattern.findall(journal.read_text(encoding='utf-8'))
        if not RESPONSIVE_VARIANT.search(photo)
    }
    if not trip_photos:
        raise ValueError(f'游记页未收录任何照片：{directory} -> {trip["href"]}')
    return trip_photos


def update_overview():
    page = ROOT / 'travel.html'
    content = page.read_text(encoding='utf-8')
    soup = BeautifulSoup(content, 'html.parser')
    trips = soup.select('#travel-trips > a[data-country]')
    countries = {trip['data-country'] for trip in trips}
    photos = set()
    photo_root = (ROOT / 'images/travel').resolve()
    for trip in trips:
        directory = trip.get('data-photo-directory')
        if not directory:
            continue
        if directory.startswith('/media/'):
            trip_photos = collect_media_photos(directory, trip)
        else:
            path = (ROOT / directory).resolve()
            if not path.is_relative_to(photo_root) or not path.is_dir():
                raise ValueError(f'无效的旅行照片目录：{directory}')
            trip_photos = {
                photo.resolve() for photo in path.rglob('*')
                if photo.is_file() and photo.suffix.lower() in PHOTO_EXTENSIONS
            }
        photos.update(trip_photos)
        print(f'{directory}: {len(trip_photos)} 张')
    totals = f'''<!-- travel-totals:start -->
<dl class="travel-totals" aria-label="全部旅行合计">
<div><dt>国家 / COUNTRIES</dt><dd>{len(countries)}</dd></div>
<div><dt>收录照片 / PHOTOS</dt><dd>{len(photos)}</dd></div>
</dl>
<!-- travel-totals:end -->'''
    updated, count = re.subn(
        r'<!-- travel-totals:start -->.*?<!-- travel-totals:end -->',
        lambda match: totals, content, flags=re.S,
    )
    if count != 1:
        raise ValueError('旅行统计标记必须恰好有一组')
    page.write_text(updated, encoding='utf-8')
    print(f'总计：{len(countries)} 个国家，{len(photos)} 张收录照片（资料图不计入）')


if __name__ == '__main__':
    update_overview()
