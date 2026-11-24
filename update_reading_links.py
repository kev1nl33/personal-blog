#!/usr/bin/env python3
"""局部同步系列/札记顺序导航、首页最近文章与列表分类计数；直接维护的 HTML 是唯一输入。"""
import argparse
from collections import Counter
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


def weekly_updates(root):
    hub_path = root / 'weekly.html'
    if not hub_path.is_file():
        return {}
    hub_source = hub_path.read_text(encoding='utf-8')
    hub = parse(hub_source)
    items = hub.select('ol.series-list a.series-item')
    if not items:
        return {}
    # weekly.html 按期号倒序排列；正序（从早到晚）用于 prev/next 关系
    chronological = []
    for link in reversed(items):
        path = (root / link['href']).resolve()
        if path.parent != root.resolve() or path.suffix != '.html':
            raise ValueError(f'札记成员必须为根目录文章：{path}')
        chronological.append((path, link.select_one('h3').get_text(strip=True)))

    updates = {}
    # 同步 weekly.html 头部期数
    expected_coord = f'<p class="coordinate">系列 / {len(chronological)} 篇</p>'
    updated_hub = replace_once(hub_source, r'<p class="coordinate">系列 / \d+ 篇</p>', expected_coord)
    if updated_hub != hub_source:
        updates[hub_path] = updated_hub

    for index, (path, _) in enumerate(chronological):
        source = path.read_text(encoding='utf-8')
        links = []
        for rel, label, offset in [('prev', '上一期', -1), ('next', '下一期', 1)]:
            target = index + offset
            if 0 <= target < len(chronological):
                neighbor, heading = chronological[target]
                links.append(f'<a rel="{rel}" href="{escape(neighbor.name, quote=True)}"><span>{label}</span>{escape(heading)}</a>')
        nav = (
            '<nav class="series-nav" aria-label="札记系列导航">'
            '<a href="weekly.html">← 回到「札记」系列</a>'
            f'<div class="series-nav-links">{"".join(links)}</div></nav>'
        )
        if parse(source).select_one('.series-nav'):
            updated = replace_once(source, r'<nav\b[^>]*class="series-nav"[^>]*>.*?</nav>', nav)
        else:
            updated = replace_once(source, r'(?=<footer class="article-end">)', nav)
        updates[path] = updated
    return updates


def blog_counts_update(root):
    blog_path = root / 'blog.html'
    if not blog_path.is_file():
        return {}
    source = blog_path.read_text(encoding='utf-8')
    soup = parse(source)
    cards = soup.select('#blogGrid .blog-card')
    counts = Counter(card.get('data-category', '') for card in cards)
    total = len(cards)

    updated = source
    for cat, cnt in [('all', total), *counts.items()]:
        updated = re.sub(
            rf'(<button\b[^>]*data-category="{re.escape(cat)}"[^>]*>.*?<span class="count-pill">)\d+(</span></button>)',
            rf'\g<1>{cnt}\2',
            updated,
            count=1,
        )
    updated = re.sub(
        r'(<p id="searchCount"[^>]*>)共 \d+ 篇文章(</p>)',
        rf'\g<1>共 {total} 篇文章\2',
        updated,
        count=1,
    )
    return {blog_path: updated} if updated != source else {}


def home_update(root):
    path = root / 'index.html'
    source = path.read_text(encoding='utf-8')
    home = parse(source)
    selected = {link['href'] for link in home.select('#start-here article h2 a')}
    archive = parse((root / 'blog.html').read_text(encoding='utf-8'))
    all_cards = archive.select('#blogGrid .blog-card')
    cards = []
    seen = set(selected)
    for card in all_cards:
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
    sec_html = re.sub(
        r'(<a class="text-link" href="blog\.html">)全部 \d+ 篇 →(</a>)',
        rf'\g<1>全部 {len(all_cards)} 篇 →\2',
        section[0],
        count=1,
    )
    updated = replace_once(sec_html, r'<div class="featured-grid">.*?</section>', grid + '</section>')
    return {path: source[:section.start()] + updated + source[section.end():]}


def reading_updates(root=ROOT):
    """先计算所有变更；输入无效时不留下部分写入。"""
    return {**series_updates(root), **weekly_updates(root), **home_update(root), **blog_counts_update(root)}


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
        print('系列导航、札记导航与首页/列表计数已同步。')
    return int(args.check and bool(changed))


if __name__ == '__main__':
    raise SystemExit(main())
