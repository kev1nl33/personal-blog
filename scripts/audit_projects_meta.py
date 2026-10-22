#!/usr/bin/env python3
"""Audit and repair metadata for every page under projects/."""
import argparse
import html
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit

from bs4 import BeautifulSoup, NavigableString

BASE_URL = 'https://aikevin.dpdns.org'
DEFAULT_OG_IMAGE = f'{BASE_URL}/images/travel/singapore-2025/singapore-147.jpg'
SERIES_ZH = '108种认知武器'
SERIES_EN = '108 Cognitive Weapons'


def project_pages(root):
    root = Path(root)
    return sorted(
        path for path in (root / 'projects').rglob('*.html')
        if 'node_modules' not in path.parts
    )


def canonical_url(page, root):
    relative = Path(page).resolve().relative_to(Path(root).resolve()).with_suffix('')
    encoded = '/'.join(quote(part, safe="-_.~()!'*") for part in relative.parts)
    return f'{BASE_URL}/{encoded}'


def _visible_text(value):
    text = re.sub(r'<[^>]+>', '', value or '')
    return re.sub(r'\s+', ' ', html.unescape(text)).strip().strip('"“”')


def _clip(text, limit=100):
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) <= limit:
        return text
    clipped = text[:limit].rsplit(' ', 1)[0].rstrip(' ,.;:，。；：')
    return clipped or text[:limit]


def _page_facts(page):
    """Read the title and summary already present on the page. Never invent copy."""
    source = Path(page).read_text(encoding='utf-8')
    if 'const pageConfig' in source:
        def field(language, name):
            match = re.search(
                rf'{language}: \{{.*?header: \{{ title: "(.*?)"\s*,\s*quote: "(.*?)"',
                source,
                re.S,
            )
            if not match:
                raise ValueError(f'{page}: missing {language} header')
            return _visible_text(match.group(1 if name == 'title' else 2))

        number = re.search(r'modelNo: "No\.(\d+)"', source)
        return {
            'number': number.group(1) if number else '',
            'zh_title': field('zh', 'title'),
            'en_title': field('en', 'title'),
            'summary': field('zh', 'quote'),
            'lang': 'zh-CN',
        }

    soup = BeautifulSoup(source, 'html.parser')
    chinese = soup.select_one('.lang-zh')
    english = soup.select_one('.lang-en')
    if not chinese or not english or not chinese.find('h1') or not english.find('h1'):
        raise ValueError(f'{page}: missing bilingual headings')
    number = re.search(r'思维模型 No\.(\d+)', source)
    quote = chinese.select_one('header .font-serif')
    return {
        'number': number.group(1) if number else '',
        'zh_title': _visible_text(next(
            (node for node in chinese.find('h1').children if isinstance(node, NavigableString) and node.strip()),
            '',
        )),
        'en_title': _visible_text(english.find('h1').get_text(' ', strip=True)),
        'summary': _visible_text(quote.get_text(' ', strip=True) if quote else ''),
        'lang': 'zh-CN',
    }


def _metadata(page, root):
    facts = _page_facts(page)
    zh_title = re.sub(r'\s+', ' ', facts['zh_title']).strip()
    en_title = re.sub(r'\s+', ' ', facts['en_title']).strip()
    title = f'{zh_title} - {SERIES_ZH} | {en_title} - {SERIES_EN}'
    description = _clip(f'{SERIES_ZH} No.{facts["number"]} {zh_title}：{facts["summary"]}')
    url = canonical_url(page, root)
    return {
        'lang': facts['lang'],
        'title': title,
        'description': description,
        'url': url,
        'image': DEFAULT_OG_IMAGE,
    }


def _local_target_exists(page, href, root):
    parts = urlsplit(href.strip())
    if parts.scheme or parts.netloc or not parts.path or parts.path.startswith(('#',)):
        return True
    if parts.path.startswith('/'):
        target = Path(root) / unquote(parts.path.lstrip('/'))
    else:
        target = Path(page).parent / unquote(parts.path)
    return target.exists()


def audit_page(page, root):
    """Return human-readable problems. An empty list means the page passes."""
    page = Path(page)
    root = Path(root)
    source = page.read_text(encoding='utf-8')
    soup = BeautifulSoup(source, 'html.parser')
    expected = _metadata(page, root)
    label = str(page.relative_to(root))
    problems = []

    html_tag = soup.find('html')
    if not html_tag or html_tag.get('lang') != expected['lang']:
        problems.append(f'{label}: html lang should be {expected["lang"]}')
    if not soup.title or soup.title.get_text(strip=True) != expected['title']:
        problems.append(f'{label}: title does not describe the page')
    description = soup.find('meta', attrs={'name': 'description'})
    if not description or description.get('content') != expected['description']:
        problems.append(f'{label}: missing or inaccurate meta description')
    canonical = soup.find('link', rel='canonical')
    if not canonical or canonical.get('href') != expected['url']:
        problems.append(f'{label}: canonical should be {expected["url"]}')
    for prop, value in {
        'og:title': expected['title'],
        'og:description': expected['description'],
        'og:url': expected['url'],
        'og:image': expected['image'],
    }.items():
        tag = soup.find('meta', property=prop)
        if not tag or tag.get('content') != value:
            problems.append(f'{label}: missing or inaccurate {prop}')

    rendered_headings = len(re.findall(r'<h1\b', source)) + source.count('${data.header.title}')
    if rendered_headings != 2 or 'data-lang="zh"' not in source:
        problems.append(f'{label}: expected exactly one h1 per language, found {rendered_headings}')
    if '.lang-en' not in source and 'lang-${lang}' not in source:
        problems.append(f'{label}: missing the language blocks that keep one h1 visible')

    for anchor in soup.find_all('a', href=True):
        href = anchor['href']
        if not _local_target_exists(page, href, root):
            problems.append(f'{label}: broken link {href}')
    # Links assembled inside the page script are real navigation targets too.
    for href in re.findall(r'href="([^"]+)"', source):
        if not _local_target_exists(page, href, root):
            problems.append(f'{label}: broken link {href}')
    return problems


def sitemap_locs(sitemap_path):
    text = Path(sitemap_path).read_text(encoding='utf-8')
    return set(re.findall(r'<loc>\s*(.*?)\s*</loc>', text))


def audit_sitemap(root):
    root = Path(root)
    locs = sitemap_locs(root / 'sitemap.xml')
    problems = []
    for page in project_pages(root):
        url = canonical_url(page, root)
        if url not in locs:
            problems.append(f'sitemap missing {url}')
    return problems


def _attribute(value):
    """Escape what would break a double-quoted attribute, keep apostrophes readable."""
    return (
        value.replace('&', '&amp;')
        .replace('"', '&quot;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
    )


def _meta_block(expected):
    rows = [
        f'<meta name="description" content="{_attribute(expected["description"])}">',
        f'<link rel="canonical" href="{_attribute(expected["url"])}">',
        '<meta property="og:type" content="article">',
        f'<meta property="og:title" content="{_attribute(expected["title"])}">',
        f'<meta property="og:description" content="{_attribute(expected["description"])}">',
        f'<meta property="og:url" content="{_attribute(expected["url"])}">',
        f'<meta property="og:image" content="{_attribute(expected["image"])}">',
    ]
    return '\n    '.join(rows)


def repair_page(page, root):
    """Replace only the head metadata. Body copy and markup stay untouched."""
    page = Path(page)
    source = page.read_text(encoding='utf-8')
    expected = _metadata(page, Path(root))
    if not re.search(r'<html\b[^>]*>', source) or not re.search(r'<title>.*?</title>', source, re.S):
        raise ValueError(f'{page}: 缺少 html 或 title，无法安全修复')

    source = re.sub(
        r'(<html\b[^>]*?)\blang="[^"]*"',
        lambda match: f'{match.group(1)}lang="{_attribute(expected["lang"])}"',
        source,
        count=1,
    )
    source = re.sub(
        r'<title>.*?</title>',
        f'<title>{_attribute(expected["title"])}</title>',
        source,
        count=1,
        flags=re.S,
    )
    source = re.sub(
        r'\n?\s*<meta name="description" content="[^"]*">',
        '',
        source,
        count=1,
    )
    source = re.sub(r'\n?\s*<link rel="canonical" href="[^"]*">', '', source, count=1)
    source = re.sub(
        r'\n?\s*<meta property="og:(?:type|title|description|url|image)" content="[^"]*">',
        '',
        source,
    )
    source = source.replace('</head>', f'    {_meta_block(expected)}\n</head>', 1)
    page.write_text(source, encoding='utf-8')


def _git_lastmod(root, relative):
    date = subprocess.check_output(
        ['git', 'log', '-1', '--format=%cs', '--', relative],
        cwd=root, text=True,
    ).strip()
    if not date:
        raise ValueError(f'{relative} 尚无 Git 提交记录，无法确定 lastmod')
    return date


def repair_sitemap(root):
    """Append missing project URLs without disturbing existing entries or dates."""
    root = Path(root)
    sitemap = root / 'sitemap.xml'
    text = sitemap.read_text(encoding='utf-8')
    locs = sitemap_locs(sitemap)
    additions = []
    for page in project_pages(root):
        url = canonical_url(page, root)
        if url in locs:
            continue
        relative = page.relative_to(root).as_posix()
        lastmod = _git_lastmod(root, relative)
        additions.append(
            '  <url>\n'
            f'    <loc>{escape(url)}</loc>\n'
            f'    <lastmod>{lastmod}</lastmod>\n'
            '    <changefreq>monthly</changefreq>\n'
            '    <priority>0.6</priority>\n'
            '  </url>'
        )
    if not additions:
        return 0
    closing = '</urlset>'
    if text.count(closing) != 1:
        raise ValueError('sitemap.xml 应恰好有一个 </urlset>')
    block = '\n'.join(additions)
    text = text.replace(closing, f'\n{block}\n{closing}')
    if not text.endswith('\n'):
        text += '\n'
    sitemap.write_text(text, encoding='utf-8')
    return len(additions)


def write_report(path, pages, page_problems, sitemap_problems):
    lines = [
        '# projects/ 元信息审计',
        '',
        f'- 页面数：{len(pages)}',
        f'- 有问题的页面：{len({item.split(":", 1)[0] for item in page_problems})}',
        f'- 问题总数：{len(page_problems) + len(sitemap_problems)}',
        '',
    ]
    if not page_problems and not sitemap_problems:
        lines.append('未发现问题。')
    else:
        lines.extend(f'- {item}' for item in page_problems + sitemap_problems)
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main():
    parser = argparse.ArgumentParser(description='Audit or repair projects/ metadata')
    parser.add_argument('--root', default='.')
    parser.add_argument('--report')
    parser.add_argument('--repair', action='store_true')
    args = parser.parse_args()
    root = Path(args.root).resolve()
    pages = project_pages(root)
    if args.repair:
        for page in pages:
            repair_page(page, root)
        added = repair_sitemap(root)
        print(f'已修复 {len(pages)} 个页面，新增 sitemap {added} 条')
    page_problems = [item for page in pages for item in audit_page(page, root)]
    sitemap_problems = audit_sitemap(root)
    if args.report:
        write_report(args.report, pages, page_problems, sitemap_problems)
    print(f'{len(pages)} pages, {len(page_problems) + len(sitemap_problems)} problems')
    for item in (page_problems + sitemap_problems)[:20]:
        print(item)
    return 1 if page_problems or sitemap_problems else 0


if __name__ == '__main__':
    sys.exit(main())
