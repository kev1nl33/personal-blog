#!/usr/bin/env python3
"""Rebuild search-index.json from the hand-maintained HTML pages and 108 cognitive weapons.

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

# 咖啡板块不参与全站搜索。
EXCLUDED_EXACT = {'404.html', 'books-preview.html', 'test.html', 'article1.html'}
EXCLUDED_PREFIXES = ('coffee',)
CONTENT_LIMIT = 1200
TITLE_SUFFIX = re.compile(r'\s*(?:[-–—]\s*(?:计划李|AIKev1n|Kev1n).*|[|｜]\s*(?:计划李|AIKev1n|Kev1n).*)$')


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


def section_headings(soup: BeautifulSoup) -> list[str]:
    """收集长文全部 H2/H3 小标题，确保超过 CONTENT_LIMIT 的后半段章节仍可被全站搜到。"""
    main = soup.find('main') or soup.find('article') or soup.body
    if main is None:
        return []
    headings = []
    for h in main.find_all(['h2', 'h3']):
        if h.find_parent(['nav', 'footer', 'aside']):
            continue
        text = normalize_space(h.get_text(' ', strip=True))
        if text and text not in headings:
            headings.append(text)
    return headings[:24]


def page_keywords(soup: BeautifulSoup) -> str:
    """Fold the display H1, visible tags, and section headings into the keyword field."""
    tags = [normalize_space(element.get_text(' ', strip=True))
            for element in soup.select('.card-tag, .blog-tag, .article-tag')]
    heading = page_heading(soup).rstrip('。').strip()
    parts = [meta_content(soup, 'keywords'), heading, *tags[:12], *section_headings(soup)]
    return '，'.join(dict.fromkeys(part for part in parts if part))


def meta_content(soup: BeautifulSoup, name: str) -> str:
    tag = soup.find('meta', attrs={'name': name})
    return normalize_space(tag.get('content', '')) if tag else ''


def build_entry(path: Path) -> dict:
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')

    title_tag = soup.find('title')
    title = normalize_space(title_tag.get_text()) if title_tag else path.stem
    title = TITLE_SUFFIX.sub('', title).strip() or path.stem

    description = meta_content(soup, 'description')
    keywords = page_keywords(soup)
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
        'url': path.relative_to(ROOT).as_posix(),
        'title': title,
        'description': description or content[:200],
        'category': category,
        'keywords': keywords,
        'content': content,
        **metadata,
    }


def build_cognitive_entries() -> list[dict]:
    """从 visual-design.html 派生 108 个认知武器的轻量检索条目，无需把整页正文塞进索引。"""
    index_page = ROOT / 'visual-design.html'
    if not index_page.is_file():
        return []
    soup = BeautifulSoup(index_page.read_text(encoding='utf-8'), 'html.parser')
    items = []
    for card in soup.select('#tool-grid article.tool-card'):
        link = card.select_one('.tool-question a')
        model_el = card.select_one('.tool-model strong')
        outcome_el = card.select_one('.tool-outcome')
        action_el = card.select_one('.tool-action')
        if not link or not link.get('href'):
            continue
        number = card.get('data-number', '')
        question = normalize_space(link.get_text(' ', strip=True))
        model = normalize_space(model_el.get_text(' ', strip=True)) if model_el else ''
        outcome = normalize_space(outcome_el.get_text(' ', strip=True)) if outcome_el else ''
        action = normalize_space(action_el.get_text(' ', strip=True)) if action_el else ''
        keywords = normalize_space(f'No.{number} {card.get("data-keywords", "")} {question}')
        items.append({
            'url': link['href'],
            'title': f'{model} · {question}' if model else question,
            'description': outcome or action,
            'category': '认知武器',
            'keywords': keywords,
            'content': normalize_space(f'{outcome} {action}')[:240],
        })
    return items


def build_index() -> list:
    paths = [*ROOT.glob('*.html'), *ROOT.glob('series/*.html')]
    entries = [build_entry(path) for path in sorted(paths) if is_indexable(path)]
    entries.extend(build_cognitive_entries())
    return sorted(entries, key=lambda entry: entry['url'])


def serialize(entries: list) -> str:
    return json.dumps(entries, ensure_ascii=False, indent=2) + '\n'


def main() -> int:
    parser = argparse.ArgumentParser(description='重建全站搜索索引（含 108 认知武器，排除咖啡页面）')
    parser.add_argument('--check', action='store_true', help='只检查索引是否为最新，不写入文件')
    args = parser.parse_args()

    entries = build_index()
    output = serialize(entries)

    if args.check:
        current = OUTPUT.read_text(encoding='utf-8') if OUTPUT.exists() else ''
        if current != output:
            print('search-index.json 已过期，请运行 python3 generate_search_index.py')
            return 1
        print(f'search-index.json 已是最新，共 {len(entries)} 条索引')
        return 0

    OUTPUT.write_text(output, encoding='utf-8')
    print(f'已生成 search-index.json：{len(entries)} 条索引，{OUTPUT.stat().st_size:,} 字节')
    return 0


if __name__ == '__main__':
    sys.exit(main())
