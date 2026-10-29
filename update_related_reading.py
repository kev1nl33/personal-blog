#!/usr/bin/env python3
"""从中文文章 HTML 元数据局部同步文末相关阅读，不重写正文。"""
import argparse
from html import escape
from pathlib import Path

from bs4 import BeautifulSoup

from update_reading_links import replace_once

ROOT = Path(__file__).resolve().parent


def related_updates(root=ROOT):
    articles = []
    for path in sorted(root.glob('*.html')):
        source = path.read_text(encoding='utf-8')
        soup = BeautifulSoup(source, 'html.parser')

        def meta(field):
            tag = soup.select_one(f'meta[property="article:{field}"]')
            return tag.get('content', '').strip() if tag else ''

        if not meta('type') or meta('lang') != 'zh':
            continue
        if not soup.select_one('.article-end') or not soup.h1:
            raise ValueError(f'中文文章缺少标题或文末：{path.name}')
        articles.append({
            'path': path, 'source': source, 'title': soup.h1.get_text(' ', strip=True),
            'series': meta('series'), 'order': int(meta('series_order') or 0),
            'category': meta('section'),
            'tags': {tag['content'].strip() for tag in soup.select('meta[property="article:tag"]')
                     if tag.get('content', '').strip()},
        })

    updates = {}
    for current in articles:
        candidates = []
        for other in articles:
            if other['path'] == current['path']:
                continue
            same_series = bool(current['series'] and current['series'] == other['series'])
            shared_tags = len(current['tags'] & other['tags'])
            same_category = bool(current['category'] and current['category'] == other['category'])
            if not (same_series or shared_tags or same_category):
                continue
            distance = abs(current['order'] - other['order']) if same_series else 0
            rank = (not same_series, distance, -shared_tags, not same_category, other['path'].name)
            candidates.append((rank, other))
        selected = [other for _, other in sorted(candidates, key=lambda item: item[0])[:3]]
        block = ''
        if selected:
            links = ''.join(f'<li><a href="{escape(item["path"].name, quote=True)}">'
                            f'{escape(item["title"])}</a></li>' for item in selected)
            block = ('<nav class="related-reading" aria-labelledby="related-reading-title">'
                     '<h2 id="related-reading-title">相关阅读</h2>'
                     f'<ul>{links}</ul></nav>')
        source = current['source']
        if BeautifulSoup(source, 'html.parser').select_one('.related-reading'):
            source = replace_once(source, r'<nav\b[^>]*class="related-reading"[^>]*>.*?</nav>', block)
        elif block:
            source = replace_once(source, r'(?<=<footer class="article-end">)', block)
        updates[current['path']] = source
    return updates


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='只检查，不写入')
    args = parser.parse_args()
    changed = {path: source for path, source in related_updates().items()
               if path.read_text(encoding='utf-8') != source}
    for path, source in changed.items():
        if not args.check:
            path.write_text(source, encoding='utf-8')
        print(f'{"待同步" if args.check else "已同步"}：{path.name}')
    if not changed:
        print('相关阅读已同步。')
    return int(args.check and bool(changed))


if __name__ == '__main__':
    raise SystemExit(main())
