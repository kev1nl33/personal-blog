#!/usr/bin/env python3
"""仅同步系列顺序导航和首页最近 essay；直接维护的 HTML 是唯一输入。"""
import argparse
from html import escape
from pathlib import Path
import re

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
SERIES_PAGES = ('experience-tickets', 'leaving-the-system')


def parse(source):
    return BeautifulSoup(source, 'html.parser')


def replace_once(source, pattern, replacement):
    matches = list(re.finditer(pattern, source, re.DOTALL))
    if len(matches) != 1:
        raise ValueError(f'预期一个维护区块，实际找到 {len(matches)} 个：{pattern}')
    match = matches[0]
    return source[:match.start()] + replacement + source[match.end():]


def series_updates(root):
    updates = {}
    for slug in SERIES_PAGES:
        landing = parse((root / 'series' / f'{slug}.html').read_text(encoding='utf-8'))
        title = landing.select_one('h1').get_text(strip=True)
        members = []
        for link in landing.select('ol.series-list a.series-item'):
            path = (root / 'series' / link['href']).resolve()
            if path.parent != root.resolve() or path.suffix != '.html':
                raise ValueError(f'系列成员必须为根目录文章：{path}')
            members.append((path, link.select_one('h3').get_text(strip=True)))
        if not members or len({path for path, _ in members}) != len(members):
            raise ValueError(f'系列成员为空或重复：{slug}')
        for index, (path, _) in enumerate(members):
            source = path.read_text(encoding='utf-8')
            links = []
            for rel, label, offset in [('prev', '上一篇', -1), ('next', '下一篇', 1)]:
                target = index + offset
                if 0 <= target < len(members):
                    neighbor, heading = members[target]
                    links.append(f'<a rel="{rel}" href="{escape(neighbor.name, quote=True)}"><span>{label}</span>{escape(heading)}</a>')
            nav = (f'<nav class="series-nav" aria-label="{escape(title, quote=True)}系列导航">'
                   f'<a href="series/{slug}.html">← 回到「{escape(title)}」系列</a>'
                   f'<div class="series-nav-links">{"".join(links)}</div></nav>')
            if parse(source).select_one('.series-nav'):
                updated = replace_once(source, r'<nav\b[^>]*class="series-nav"[^>]*>.*?</nav>', nav)
            else:
                updated = replace_once(source, r'(?=<footer class="article-end">)', nav)
            if path in updates:
                raise ValueError(f'文章出现在多个系列中：{path.name}')
            updates[path] = updated
    return updates


def home_update(root):
    path = root / 'index.html'
    source = path.read_text(encoding='utf-8')
    home = parse(source)
    selected = {link['href'] for link in home.select('#start-here article h2 a')}
    archive = parse((root / 'blog.html').read_text(encoding='utf-8'))
    cards = []
    seen = set(selected)
    for card in archive.select('#blogGrid .blog-card'):
        href = card.select_one('h2 a')['href']
        if card.get('data-type') != 'essay' or href in seen:
            continue
        seen.add(href)
        card['class'] = ['feature-story' if not cards else 'blog-card']
        cards.append(str(card))
        if len(cards) == 4:
            break
    if len(cards) != 4:
        raise ValueError('文章列表中不足四篇非精选 essay')
    grid = f'<div class="featured-grid">{cards[0]}<div class="recent-list">{"".join(cards[1:])}</div></div>'
    section = re.search(r'<section\b[^>]*id="featured"[^>]*>.*?</section>', source, re.DOTALL)
    if not section:
        raise ValueError('首页缺少最近文章区')
    updated = replace_once(section[0], r'<div class="featured-grid">.*?</section>', grid + '</section>')
    return {path: source[:section.start()] + updated + source[section.end():]}


def reading_updates(root=ROOT):
    """先计算所有变更；输入无效时不留下部分写入。"""
    return {**series_updates(root), **home_update(root)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='只检查，不写入')
    args = parser.parse_args()
    changed = {path: source for path, source in reading_updates().items()
               if path.read_text(encoding='utf-8') != source}
    for path, source in changed.items():
        if not args.check:
            path.write_text(source, encoding='utf-8')
        print(f'{"待同步" if args.check else "已同步"}：{path.name}')
    if not changed:
        print('系列导航与首页最近文章已同步。')
    return int(args.check and bool(changed))


if __name__ == '__main__':
    raise SystemExit(main())
