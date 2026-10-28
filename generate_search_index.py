#!/usr/bin/env python3
"""Rebuild search-index.json from the hand-maintained root HTML pages.

The site's search UI reads only this JSON file. Run after changing page text:

    python3 generate_search_index.py

Use --check to verify the committed index is up to date without writing:

    python3 generate_search_index.py --check
"""

import argparse
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'search-index.json'

# 咖啡板块不参与全站搜索，界面也不挂搜索入口。
EXCLUDED_EXACT = {'404.html', 'books-preview.html', 'test.html', 'article1.html'}
EXCLUDED_PREFIXES = ('coffee',)
CONTENT_LIMIT = 1200
TITLE_SUFFIX = re.compile(r'\s*(?:[-–—]\s*计划李.*|[|｜]\s*计划李.*)$')


def is_indexable(path: Path) -> bool:
    name = path.name
    return (
        path.is_file()
        and name.endswith('.html')
        and name not in EXCLUDED_EXACT
        and not name.startswith(EXCLUDED_PREFIXES)
        and '-backup-' not in name
    )


def normalize_space(text: str) -> str:
    return ' '.join(text.split())


def page_text(soup: BeautifulSoup) -> str:
    """Return readable main-content text; navigation and footer are noise."""
    main = soup.find('main') or soup.find('article') or soup.body
    if main is None:
        return ''
    for element in main.find_all(['script', 'style', 'noscript', 'nav', 'footer', 'form', 'aside']):
        element.decompose()
    # 只取可见文案，装饰性箭头、分隔符和重复的计数字样不该进入摘要。
    # 列表页的卡片摘录是英文/长句混合，用短一点的块拼起来，摘要更好读。
    blocks = []
    for block in main.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'li', 'figcaption', 'blockquote', 'dd', 'dt']):
        text = normalize_space(block.get_text(' ', strip=True))
        text = text.rstrip('↗→↓').strip()
        if text and text not in blocks:
            blocks.append(text)
    return normalize_space(' '.join(blocks))


def page_heading(soup: BeautifulSoup) -> str:
    """The list/cover pages use a large display heading that <title> does not repeat."""
    heading = soup.find('h1')
    return normalize_space(heading.get_text(' ', strip=True)) if heading else ''


def page_keywords(soup: BeautifulSoup) -> str:
    """Fold the display H1 and visible category tags into the keyword field."""
    tags = [normalize_space(element.get_text(' ', strip=True))
            for element in soup.select('.card-tag, .blog-tag, .article-tag')]
    heading = page_heading(soup).rstrip('。').strip()
    parts = [meta_content(soup, 'keywords'), heading, *tags[:12]]
    return '，'.join(dict.fromkeys(part for part in parts if part))


def meta_content(soup: BeautifulSoup, name: str) -> str:
    tag = soup.find('meta', attrs={'name': name})
    return normalize_space(tag.get('content', '')) if tag else ''


def build_entry(path: Path) -> dict:
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')

    title_tag = soup.find('title')
    title = normalize_space(title_tag.get_text()) if title_tag else path.stem
    title = TITLE_SUFFIX.sub('', title).strip() or path.stem

    def meta(name: str) -> str:
        return meta_content(soup, name)

    description = meta('description')
    content = page_text(soup)[:CONTENT_LIMIT]
    def article_meta(field: str) -> str:
        tag = soup.find('meta', attrs={'property': f'article:{field}'})
        return tag.get('content', '') if tag else ''

    category_tag = soup.find(class_=['blog-tag', 'article-tag'])
    category = article_meta('section') or (normalize_space(category_tag.get_text()) if category_tag else '')
    metadata = {}
    if article_meta('type'):
        metadata = {
            'type': article_meta('type'),
            'lang': article_meta('lang'),
            'featured': article_meta('featured') == 'true',
            'series': article_meta('series') or None,
            'series_order': int(article_meta('series_order')) if article_meta('series_order') else None,
            'updated': article_meta('updated') or None,
            'tags': [tag.get('content', '') for tag in soup.select('meta[property="article:tag"]')],
        }

    return {
        'url': path.name,
        'title': title,
        'description': description or content[:200],
        'category': category,
        'keywords': page_keywords(soup),
        'content': content,
        **metadata,
    }


def build_index() -> list:
    entries = [build_entry(path) for path in sorted(ROOT.glob('*.html')) if is_indexable(path)]
    return sorted(entries, key=lambda entry: entry['url'])


def serialize(entries: list) -> str:
    return json.dumps(entries, ensure_ascii=False, indent=2) + '\n'


def main() -> int:
    parser = argparse.ArgumentParser(description='重建全站搜索索引（排除咖啡页面）')
    parser.add_argument('--check', action='store_true', help='只检查索引是否为最新，不写入文件')
    args = parser.parse_args()

    entries = build_index()
    output = serialize(entries)

    if args.check:
        current = OUTPUT.read_text(encoding='utf-8') if OUTPUT.exists() else ''
        if current != output:
            print('search-index.json 已过期，请运行 python3 generate_search_index.py')
            return 1
        print(f'search-index.json 已是最新，共 {len(entries)} 个页面')
        return 0

    OUTPUT.write_text(output, encoding='utf-8')
    print(f'已生成 search-index.json：{len(entries)} 个页面，{OUTPUT.stat().st_size:,} 字节')
    for entry in entries:
        print(f"  {entry['url']} — {entry['title']}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
