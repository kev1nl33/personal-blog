#!/usr/bin/env python3
"""快速创建一篇符合全站规范的新文章或新札记骨架，并可选挂载到列表页。

用法示例：
    python3 scripts/new_post.py my-new-essay --title "文章标题" --category ai --tags "AI 工具,决策与方法" --excerpt "一句话摘要。"
    python3 scripts/new_post.py weekly-2026-w47 --weekly --week W47 --range "2026-11-14～2026-11-20" --date 2026-11-20 --excerpt "本周一句话钩子。"
"""
import argparse
from datetime import date
from html import escape
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent

CATEGORY_MAP = {
    'career': '职业转型',
    'ai': 'AI 与工具',
    'investment': '投资',
    'personal': '自我认知',
    'life': '家庭与生活',
    'reading': '读书笔记',
    'weekly': '札记',
}


def safe_slug(slug: str) -> str:
    slug = slug.removesuffix('.html')
    if not re.fullmatch(r'[A-Za-z0-9_-]+', slug):
        raise SystemExit(f'非法 slug：{slug}（仅允许字母、数字、-、_）')
    return slug


def build_article_html(slug, title, excerpt, category_key, post_type, lang, pub_date, read_time, tags, series, series_order, weekly_range=''):
    section = CATEGORY_MAP[category_key]
    tag_meta = '\n'.join(f'<meta property="article:tag" content="{escape(t, quote=True)}">' for t in tags)
    is_weekly = category_key == 'weekly'
    breadcrumb_href = 'weekly.html' if is_weekly else 'blog.html'
    breadcrumb_label = '← 札记' if is_weekly else '← 文章档案'
    coord = f'札记 · {pub_date[:4]}-{slug.split("-")[-1].upper()}' if is_weekly else section
    deck_html = '' if is_weekly else f'<p class="article-deck">{escape(excerpt)}</p>'
    range_html = f'<span>{escape(weekly_range)}</span>' if weekly_range else ''
    body_placeholder = (
        f'<p>{escape(excerpt)}</p>\n'
        '<h2>一件具体的事</h2>\n<p>在这里写本周最具体的一件事。</p>\n'
        '<h2>这件事让我看见了什么</h2>\n<p>在这里写提炼出的判断或规则。</p>\n'
        '<h2>一个没想透的问题</h2>\n<p>在这里留下还在思考的问题。</p>'
        if is_weekly
        else f'<p>{escape(excerpt)}</p>\n<h2>一、背景</h2>\n<p>在这里开始正文。</p>'
    )
    series_nav_html = (
        '<nav class="series-nav" aria-label="札记系列导航"><a href="weekly.html">← 回到「札记」系列</a>'
        '<div class="series-nav-links"></div></nav>'
        if is_weekly
        else ''
    )

    return f'''<!DOCTYPE html>
<html lang="{"en" if lang == "en" else "zh-CN"}">
<head>
<script src="scripts/theme-init.js?v=1"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)} - AIKev1n</title>
<meta name="description" content="{escape(excerpt, quote=True)}">
<meta name="author" content="Kev1n">
<meta property="og:type" content="article"><meta property="article:published_time" content="{escape(pub_date, quote=True)}"><meta property="article:section" content="{escape(section, quote=True)}">
<meta property="og:title" content="{escape(title, quote=True)} - AIKev1n">
<meta property="og:description" content="{escape(excerpt, quote=True)}">
<meta property="og:url" content="https://aikevin.dpdns.org/{slug}">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="canonical" href="https://aikevin.dpdns.org/{slug}">
<link rel="stylesheet" href="styles/main.css?v=1">
<link rel="stylesheet" href="styles/article.css?v=1">
<link rel="stylesheet" href="styles/motion.css?v=1">
<meta property="og:image" content="https://aikevin.dpdns.org/assets/readme/cover.png">
<link rel="stylesheet" href="styles/search.css?v=1">
<meta property="article:type" content="{escape(post_type, quote=True)}">
<meta property="article:lang" content="{escape(lang, quote=True)}">
<meta property="article:featured" content="false">
<meta property="article:series" content="{escape(series, quote=True)}">
<meta property="article:series_order" content="{escape(series_order, quote=True)}">
<meta property="article:updated" content="">
{tag_meta}
</head>
<body class="article-page">
<a class="skip-link" href="#main">跳到内容</a>
<nav class="site-nav" aria-label="主导航"></nav>
<main id="main" tabindex="-1">
<div class="reading-progress" aria-hidden="true"><span id="reading-progress"></span></div>
<div class="article-layout container"><article class="article-document"><header class="article-header"><a class="breadcrumb" href="{breadcrumb_href}">{breadcrumb_label}</a><p class="coordinate">{escape(coord)}</p><h1>{escape(title)}</h1>{deck_html}<div class="article-meta"><time datetime="{escape(pub_date, quote=True)}">{escape(pub_date)}</time>{range_html}<span>{read_time} 分钟阅读</span></div></header><div class="article-content">
{body_placeholder}
</div>{series_nav_html}<footer class="article-end"><p><a class="text-link" href="mailto:kevinlee19951002@gmail.com">读完如果有共鸣，欢迎回信，告诉我你的版本。</a></p><p class="coordinate">记录至此，生活继续。</p><a class="text-link" href="blog.html">继续阅读其他文章 →</a></footer></article><aside class="article-toc" aria-label="文章目录" hidden><details open><summary>本篇目录</summary><nav id="toc-list" aria-label="章节"></nav></details></aside></div>
</main>
<footer class="site-footer"></footer>
<button class="back-to-top" aria-label="回到顶部" hidden>↑</button>
<script src="scripts/main.js?v=1" defer></script>
<script src="scripts/toc.js?v=1" defer></script>
<script src="scripts/motion.js?v=1" defer></script>
<script src="scripts/search.js?v=1" defer></script>
</body></html>
'''


def prepend_to_blog(slug, title, excerpt, category_key, post_type, pub_date, read_time, tags):
    blog_path = ROOT / 'blog.html'
    source = blog_path.read_text(encoding='utf-8')
    section = CATEGORY_MAP[category_key]
    year = pub_date[:4]
    card = (
        f'<article class="blog-card" data-type="{escape(post_type, quote=True)}" '
        f'data-category="{escape(category_key, quote=True)}" data-tags="{escape(",".join(tags), quote=True)}">\n'
        f'<div class="story-meta"><span class="card-tag">{escape(section)}</span>'
        f'<time datetime="{escape(pub_date, quote=True)}">{escape(pub_date)}</time></div>\n'
        f'<h2 class="blog-card-title"><a href="{slug}.html">{escape(title)}</a></h2>\n'
        f'<p class="blog-card-excerpt">{escape(excerpt)}</p>\n'
        f'<div class="story-foot"><span>{read_time} 分钟阅读</span><span aria-hidden="true">阅读全文 →</span></div></article>'
    )
    year_marker = f'<h2 class="archive-year" data-year="{year}">{year}</h2>'
    if year_marker in source:
        updated = source.replace(year_marker, year_marker + card, 1)
    else:
        grid_marker = '<div class="blog-grid" id="blogGrid">'
        updated = source.replace(grid_marker, grid_marker + year_marker + card, 1)
    blog_path.write_text(updated, encoding='utf-8')


def prepend_to_weekly(slug, week_code, title, excerpt, pub_date):
    hub_path = ROOT / 'weekly.html'
    source = hub_path.read_text(encoding='utf-8')
    item = (
        f'<li><a class="series-item" href="{slug}.html"><span class="series-number">{escape(week_code)}</span>'
        f'<div><h3>{escape(title)}</h3><time datetime="{escape(pub_date, quote=True)}">{escape(pub_date)}</time>'
        f'<p>{escape(excerpt)}</p></div></a></li>'
    )
    marker = '<ol class="series-list" reversed>'
    if marker not in source:
        raise SystemExit('weekly.html 缺少 <ol class="series-list" reversed>')
    hub_path.write_text(source.replace(marker, marker + item, 1), encoding='utf-8')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('slug', help='文件名（不含 .html），例如 my-new-post 或 weekly-2026-w47')
    parser.add_argument('--title', help='文章标题；札记模式可省略，自动生成「札记 · WXX」')
    parser.add_argument('--excerpt', default='在这里填写一句话摘要。', help='文章摘要')
    parser.add_argument('--category', choices=list(CATEGORY_MAP), default='ai', help='分类')
    parser.add_argument('--type', dest='post_type', choices=['essay', 'note', 'cheatsheet'], default='essay')
    parser.add_argument('--lang', choices=['zh', 'en'], default='zh')
    parser.add_argument('--tags', default='AI 工具', help='逗号分隔，1–3 个标签')
    parser.add_argument('--date', dest='pub_date', default=date.today().isoformat(), help='YYYY-MM-DD')
    parser.add_argument('--read-time', type=int, default=6, help='预计阅读分钟数')
    parser.add_argument('--weekly', action='store_true', help='创建札记单篇并挂载到 weekly.html')
    parser.add_argument('--week', help='周号，如 W47')
    parser.add_argument('--range', dest='weekly_range', default='', help='覆盖日期区间，如 2026-11-14～2026-11-20')
    parser.add_argument('--no-list', action='store_true', help='仅生成单篇 HTML，不自动插入列表页')
    args = parser.parse_args()

    slug = safe_slug(args.slug)
    target = ROOT / f'{slug}.html'
    if target.exists():
        raise SystemExit(f'目标文件已存在：{target.name}')

    if args.weekly:
        category_key = 'weekly'
        week_match = re.search(r'w(\d{2})$', slug, re.I)
        week_code = args.week or (f'W{week_match.group(1)}' if week_match else 'W01')
        year_match = re.search(r'(\d{4})', slug)
        year_str = year_match.group(1) if year_match else args.pub_date[:4]
        title = args.title or f'札记 · {week_code}'
        tags = ['札记']
        series = '札记'
        series_order = f'{year_str}{week_code[1:]}'
    else:
        category_key = args.category
        if not args.title:
            raise SystemExit('非札记文章必须提供 --title')
        title = args.title
        tags = [t.strip() for t in args.tags.split(',') if t.strip()][:3]
        series = ''
        series_order = ''

    html_content = build_article_html(
        slug, title, args.excerpt, category_key, args.post_type, args.lang,
        args.pub_date, args.read_time, tags, series, series_order, args.weekly_range,
    )
    target.write_text(html_content, encoding='utf-8')
    if not args.no_list:
        if args.weekly:
            prepend_to_weekly(slug, week_code, title, args.excerpt, args.pub_date)
        else:
            prepend_to_blog(slug, title, args.excerpt, category_key, args.post_type, args.pub_date, args.read_time, tags)
    print(f'已生成 {target.name}。请写作完成后执行 npm run sync && npm run check。')


if __name__ == '__main__':
    sys.exit(main())
