"""Validate managed pages without network or writes. Used by CI and local builds."""
import json
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit
from bs4 import BeautifulSoup
from site_builder import ROOT


def validate(root=ROOT):
    root = Path(root)
    articles = json.loads((root / 'data/articles.json').read_text())
    pages = ['index.html', 'blog.html', 'about.html', 'now.html', 'coffee.html', 'travel.html', 'travel-singapore-2025.html', 'travel-japan-2023.html', 'travel-australia-2026.html', 'travel-uk-2024.html', 'gallery.html', 'visual-design.html']
    pages += [article['url'] + '.html' for article in articles]
    pages += [path.relative_to(root).as_posix() for path in sorted(root.glob('series/*.html'))]
    errors = []
    for filename in pages:
        source = (root / filename).read_text()
        soup = BeautifulSoup(source, 'html.parser')
        if len(soup.find_all('main')) != 1: errors.append(f'{filename}: expected one main landmark')
        if len(soup.find_all('h1')) != 1: errors.append(f'{filename}: expected one page title')
        for selector in ['title', 'meta[name="description"]', 'link[rel="canonical"]', 'nav[aria-label="主导航"]']:
            if not soup.select_one(selector): errors.append(f'{filename}: missing {selector}')
        ids = [element['id'] for element in soup.find_all(id=True)]
        if len(ids) != len(set(ids)): errors.append(f'{filename}: duplicate IDs')
        for element in soup.select('a[href],script[src],link[rel="stylesheet"],img[src]'):
            href = element.get('href') or element.get('src')
            parts = urlsplit(href)
            # '/api/'、'/second-brain/' 与 '/media/' 由 Pages Functions 在服务端提供，无对应静态文件
            if parts.scheme or parts.netloc or not parts.path or parts.path.startswith(('/api/', '/second-brain/', '/media/')): continue
            local_path = unquote(parts.path)
            target = root / local_path.lstrip('/') if local_path.startswith('/') else (root / filename).parent / local_path
            if not target.exists(): errors.append(f'{filename}: missing local target {parts.path}')
        if soup.select('script[src*="cdn.tailwindcss.com"],.loader,#counter-display'):
            errors.append(f'{filename}: runtime loader or fake counter remains')
        for image in soup.find_all('img'):
            if not image.has_attr('alt'): errors.append(f'{filename}: image missing alt')
    print(f'Validated {len(pages)} managed pages; {len(errors)} errors')
    for error in errors: print(error)
    return errors

if __name__ == '__main__':
    sys.exit(bool(validate()))
