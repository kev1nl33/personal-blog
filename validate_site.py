"""Validate all active root & series HTML pages without network or writes."""
from collections import Counter
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
INDEPENDENT_NAV_PREFIXES = ('coffee-equipment-',)


def discover_pages(root):
    root = Path(root)
    pages = []
    for path in sorted(list(root.glob('*.html')) + list(root.glob('series/*.html'))):
        if '-backup-' in path.name:
            continue
        pages.append(path.relative_to(root).as_posix())
    return pages


def validate(root=ROOT):
    root = Path(root)
    pages = discover_pages(root)
    errors = []

    # Pre-index element IDs for cross-page #fragment validation
    soups = {}
    page_ids = {}
    for filename in pages:
        source = (root / filename).read_text(encoding='utf-8')
        soup = BeautifulSoup(source, 'html.parser')
        soups[filename] = soup
        page_ids[filename] = {element['id'] for element in soup.find_all(id=True)}

    for filename in pages:
        soup = soups[filename]
        independent = Path(filename).name.startswith(INDEPENDENT_NAV_PREFIXES)

        if not independent and len(soup.find_all('main')) != 1:
            errors.append(f'{filename}: expected one main landmark')
        if len(soup.find_all('h1')) != 1:
            errors.append(f'{filename}: expected one page title')

        required = ['title', 'meta[name="description"]', 'link[rel="canonical"]']
        if not independent:
            required.append('nav[aria-label="主导航"]')
        for selector in required:
            if not soup.select_one(selector):
                errors.append(f'{filename}: missing {selector}')

        ids = [element['id'] for element in soup.find_all(id=True)]
        if len(ids) != len(set(ids)):
            errors.append(f'{filename}: duplicate IDs')

        # Guard against accidentally duplicated stylesheets, scripts, or og:image
        css_hrefs = [el.get('href', '').split('?')[0] for el in soup.select('link[rel="stylesheet"]')]
        for href, count in Counter(css_hrefs).items():
            if count > 1:
                errors.append(f'{filename}: duplicate stylesheet {href}')
        script_srcs = [el.get('src', '').split('?')[0] for el in soup.select('script[src]')]
        for src, count in Counter(script_srcs).items():
            if count > 1:
                errors.append(f'{filename}: duplicate script {src}')
        if len(soup.select('meta[property="og:image"]')) > 1:
            errors.append(f'{filename}: duplicate og:image')

        for element in soup.select('a[href],script[src],link[rel="stylesheet"],img[src]'):
            href = element.get('href') or element.get('src') or ''
            parts = urlsplit(href)
            # '/api/'、'/second-brain/' 与 '/media/' 由 Pages Functions 在服务端提供，无对应静态文件
            if parts.scheme or parts.netloc or parts.path.startswith(('/api/', '/second-brain/', '/media/')):
                continue
            if not parts.path:
                if parts.fragment and parts.fragment not in page_ids[filename]:
                    errors.append(f'{filename}: broken local anchor #{parts.fragment}')
                continue
            local_path = unquote(parts.path)
            target = root / local_path.lstrip('/') if local_path.startswith('/') else (root / filename).parent / local_path
            # Pages 的无扩展名 URL 对应同名 HTML，根路径对应首页。
            if not target.exists() and not target.suffix:
                target = target / 'index.html' if local_path.endswith('/') else target.with_suffix('.html')
            if not target.exists():
                errors.append(f'{filename}: missing local target {parts.path}')
            elif parts.fragment and target.suffix == '.html':
                try:
                    trel = target.resolve().relative_to(root.resolve()).as_posix()
                except ValueError:
                    trel = None
                if trel in page_ids and parts.fragment not in page_ids[trel]:
                    errors.append(f'{filename}: broken anchor {href}')

        if soup.select('script[src*="cdn.tailwindcss.com"],.loader,#counter-display'):
            errors.append(f'{filename}: runtime loader or fake counter remains')
        for image in soup.find_all('img'):
            if not image.has_attr('alt'):
                errors.append(f'{filename}: image missing alt')

    print(f'Validated {len(pages)} active pages; {len(errors)} errors')
    for error in errors:
        print(error)
    return errors


if __name__ == '__main__':
    sys.exit(bool(validate()))
