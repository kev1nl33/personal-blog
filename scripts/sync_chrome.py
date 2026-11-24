#!/usr/bin/env python3
"""局部同步共享导航、页脚、静态资源版本号与 JSON-LD，绝不修改正文 <main>。

受管范围：根目录与 series/ 下除 coffee*.html、name-explain.html 之外的现役 HTML。
用法：
    python3 scripts/sync_chrome.py          # 同步全部受管页面
    python3 scripts/sync_chrome.py --check  # 仅检查是否过期（退出码 1 表示需同步）
"""
import argparse
import hashlib
import json
import re
import sys
from html import escape
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = 'https://aikevin.dpdns.org'
EXCLUDED_EXACT = {'name-explain.html'}
BRAND_NAME = 'AIKev1n'
AUTHOR_NAME = 'Kev1n'

NAV_ITEMS = [
    ('blog.html', '文章'),
    ('weekly.html', '札记'),
    ('visual-design.html', '认知武器'),
    ('coffee.html', '咖啡角'),
    ('travel.html', '看世界'),
    ('about.html', '关于'),
]

TITLE_BRAND_RE = re.compile(r'\s*[-–—]\s*(?:计划李|AIKev1n|Kev1n)\s*$')

HOME_LIQUID_LOADER = (
    '<script data-liquid-logo-loader>'
    "if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){"
    "const boot=()=>{const l=document.createElement('link');l.rel='stylesheet';"
    "l.href='/experiments/liquid-glass-logo/dist/liquid-logo-nav.css?v=liquid-nav-6';document.head.appendChild(l);"
    "import('/experiments/liquid-glass-logo/dist/liquid-logo-nav.js?v=liquid-nav-6').catch(()=>{});};"
    "if('requestIdleCallback' in window)requestIdleCallback(boot,{timeout:1500});else setTimeout(boot,400);"
    '}</script>'
)


def managed_pages(root=ROOT):
    root = Path(root)
    pages = []
    for p in sorted(list(root.glob('*.html')) + list(root.glob('series/*.html'))):
        if p.name in EXCLUDED_EXACT or p.name.startswith('coffee') or '-backup-' in p.name:
            continue
        pages.append(p)
    return pages


def file_version(root, rel_path):
    target = Path(root) / rel_path
    if not target.is_file():
        return '1'
    return hashlib.sha256(target.read_bytes()).hexdigest()[:8]


def prefix_for(path, root):
    rel = path.relative_to(root).as_posix()
    if rel == '404.html':
        return '/'
    depth = len(Path(rel).parts) - 1
    return '../' * depth


def active_nav_target(path, root, soup):
    rel = path.relative_to(root).as_posix()
    if rel == 'index.html':
        return 'logo'
    if rel in ('now.html', '404.html'):
        return None
    if rel == 'about.html':
        return 'about.html'
    if rel == 'visual-design.html':
        return 'visual-design.html'
    if rel in ('travel.html', 'gallery.html') or rel.startswith('travel-'):
        return 'travel.html'
    if rel == 'weekly.html' or rel.startswith('weekly-'):
        return 'weekly.html'
    if rel == 'blog.html' or rel.startswith('series/'):
        return 'blog.html'
    sec = soup.select_one('meta[property="article:section"]')
    if sec and sec.get('content', '').strip() == '札记':
        return 'weekly.html'
    return 'blog.html'


def build_nav(path, root, soup):
    prefix = prefix_for(path, root)
    active = active_nav_target(path, root, soup)
    is_home = path.relative_to(root).as_posix() == 'index.html'
    logo_current = ' aria-current="page"' if active == 'logo' else ''
    mark_id = ' id="nav-liquid-logo"' if is_home else ''
    logo_html = (
        f'<a class="nav-logo nav-logo--liquid" href="{prefix}index.html"{logo_current} aria-label="{BRAND_NAME} 首页">'
        f'<span class="nav-logo-mark"{mark_id}>'
        f'<img class="nav-logo-static nav-logo-static--light" src="/experiments/liquid-glass-logo/logo.svg" alt="" width="52" height="52">'
        f'<img class="nav-logo-static nav-logo-static--dark" src="/experiments/liquid-glass-logo/logo-dark.svg" alt="" width="52" height="52">'
        f'</span>{BRAND_NAME}<span aria-hidden="true"></span></a>'
    )
    items = []
    for href, label in NAV_ITEMS:
        current = ' aria-current="page"' if active == href else ''
        items.append(f'<li><a href="{prefix}{href}" class="nav-link"{current}>{label}</a></li>')
    return (
        '<nav class="site-nav" aria-label="主导航"><div class="container nav-inner">\n'
        f'{logo_html}\n'
        '<button class="nav-toggle" aria-controls="site-menu" aria-expanded="false" aria-label="打开菜单" hidden>菜单 <span aria-hidden="true">＋</span></button>\n'
        f'<ul class="nav-links" id="site-menu">{"".join(items)}</ul>'
        '<button class="theme-toggle" type="button" aria-pressed="false" aria-label="切换到深色模式" hidden>'
        '<svg class="theme-icon theme-icon--moon" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M14.2 11.6A5.4 5.4 0 0 1 8.2 4.4 6.2 6.2 0 1 0 15.6 13a5.4 5.4 0 0 1-1.4-1.4Z"></path></svg></button>'
        '<button class="search-trigger" type="button" data-search-open aria-label="搜索全站" aria-haspopup="dialog">'
        '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="m13 13 4 4"></path></svg>'
        '<span class="search-trigger-label">搜索</span><kbd aria-hidden="true">/</kbd></button>'
        '</div></nav>'
    )


def build_footer(path, root):
    prefix = prefix_for(path, root)
    rel = path.relative_to(root).as_posix()
    now_current = ' aria-current="page"' if rel == 'now.html' else ''
    return (
        f'<footer class="site-footer"><div class="container footer-inner">'
        f'<a class="footer-brand" href="{prefix}index.html">{BRAND_NAME}<span aria-hidden="true">▪</span></a>'
        f'<p>持续观察，认真生活。<br><span class="footer-copy">© 2026 {AUTHOR_NAME} · {BRAND_NAME}</span></p>'
        f'<nav aria-label="页脚">'
        f'<a href="{prefix}about.html">关于</a>'
        f'<a href="/now"{now_current}>最近在做</a>'
        f'<a href="/second-brain/">第二大脑</a>'
        f'<a href="https://www.zhihu.com/people/xia-yu-de-xia-tian-40" target="_blank" rel="noopener noreferrer">知乎 ↗</a>'
        f'<a href="https://github.com/kev1nl33" target="_blank" rel="noopener noreferrer">GitHub ↗</a>'
        f'</nav></div></footer>'
    )


def build_json_ld(path, root, soup):
    rel = path.relative_to(root).as_posix()
    canonical_tag = soup.find('link', rel='canonical')
    url = canonical_tag.get('href', f'{BASE_URL}/') if canonical_tag else f'{BASE_URL}/'
    desc_tag = soup.find('meta', attrs={'name': 'description'})
    desc = desc_tag.get('content', '').strip() if desc_tag else ''
    og_img_tag = soup.find('meta', property='og:image')
    image = og_img_tag.get('content', f'{BASE_URL}/assets/readme/cover.png') if og_img_tag else f'{BASE_URL}/assets/readme/cover.png'

    person = {
        '@type': 'Person',
        'name': AUTHOR_NAME,
        'alternateName': [BRAND_NAME, '计划李'],
        'url': f'{BASE_URL}/about',
        'sameAs': [
            'https://www.zhihu.com/people/xia-yu-de-xia-tian-40',
            'https://github.com/kev1nl33',
        ],
    }

    if rel == 'index.html':
        data = {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'WebSite',
                    'name': f'{BRAND_NAME} - 一个普通人的生活实验',
                    'url': f'{BASE_URL}/',
                    'description': desc,
                    'inLanguage': 'zh-CN',
                    'author': person,
                },
                person,
            ],
        }
    elif rel == 'about.html':
        data = {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            'url': url,
            'mainEntity': person,
        }
    elif soup.select_one('meta[property="article:type"]'):
        h1 = soup.h1.get_text(' ', strip=True) if soup.h1 else ''
        pub = soup.select_one('meta[property="article:published_time"]')
        sec = soup.select_one('meta[property="article:section"]')
        lang = soup.select_one('meta[property="article:lang"]')
        tags = [m.get('content', '').strip() for m in soup.select('meta[property="article:tag"]') if m.get('content', '').strip()]
        data = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': h1,
            'description': desc,
            'url': url,
            'mainEntityOfPage': url,
            'image': image,
            'inLanguage': 'en' if (lang and lang.get('content') == 'en') else 'zh-CN',
            'author': person,
        }
        if pub and pub.get('content', '').strip():
            data['datePublished'] = pub['content'].strip()
        if sec and sec.get('content', '').strip():
            data['articleSection'] = sec['content'].strip()
        if tags:
            data['keywords'] = tags
    else:
        return ''

    payload = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    return f'<script type="application/ld+json" data-site-ld>{payload}</script>'


def normalize_title(raw_title, rel):
    raw_title = raw_title.strip()
    if rel == 'index.html':
        return f'{BRAND_NAME} - 一个普通人的生活实验'
    if rel.startswith('weekly-'):
        # 札记单篇保持干净标题，补充站点名
        base = TITLE_BRAND_RE.sub('', raw_title).strip()
        return f'{base} - {BRAND_NAME}'
    if TITLE_BRAND_RE.search(raw_title):
        return TITLE_BRAND_RE.sub(f' - {BRAND_NAME}', raw_title)
    return raw_title


def sync_page(path, root, versions):
    source = path.read_text(encoding='utf-8')
    soup = BeautifulSoup(source, 'html.parser')
    rel = path.relative_to(root).as_posix()
    prefix = prefix_for(path, root)
    is_home = rel == 'index.html'

    # 1. Replace <nav class="site-nav">...</nav>
    nav_html = build_nav(path, root, soup)
    source, n_nav = re.subn(r'<nav\b[^>]*class="site-nav"[^>]*>.*?</nav>', lambda _: nav_html, source, count=1, flags=re.S)
    if n_nav != 1:
        raise ValueError(f'{rel}: 预期 1 个 .site-nav，实际找到 {n_nav} 个')

    # 2. Replace <footer class="site-footer">...</footer>
    footer_html = build_footer(path, root)
    source, n_foot = re.subn(r'<footer\b[^>]*class="site-footer"[^>]*>.*?</footer>', lambda _: footer_html, source, count=1, flags=re.S)
    if n_foot != 1:
        raise ValueError(f'{rel}: 预期 1 个 .site-footer，实际找到 {n_foot} 个')

    # 3. Remove eager liquid-logo-nav CSS/JS & any old lazy loader
    source = re.sub(r'[ \t]*<link\b[^>]*liquid-logo-nav\.css[^>]*>\n?', '', source)
    source = re.sub(r'[ \t]*<script\b[^>]*liquid-logo-nav\.js[^>]*></script>\n?', '', source)
    source = re.sub(r'[ \t]*<script\b[^>]*data-liquid-logo-loader[^>]*>.*?</script>\n?', '', source, flags=re.S)

    # 4. Ensure search.css and search.js exist exactly once on all managed pages
    if 'styles/search.css' not in source:
        source = source.replace('</head>', f'<link rel="stylesheet" href="{prefix}styles/search.css?v={versions["styles/search.css"]}">\n</head>', 1)
    if 'scripts/search.js' not in source:
        source = source.replace('</body>', f'<script src="{prefix}scripts/search.js?v={versions["scripts/search.js"]}" defer></script>\n</body>', 1)

    # 5. On index.html only, attach lazy desktop-only liquid glass logo loader
    if is_home:
        source = source.replace('</body>', f'{HOME_LIQUID_LOADER}\n</body>', 1)

    # 6. Normalize shared asset query versions to deterministic content hashes
    def refresh_version(match):
        attr, quote_ch, lead, asset = match.groups()
        lead = lead or ''
        if asset in versions:
            return f'{attr}={quote_ch}{lead}{asset}?v={versions[asset]}{quote_ch}'
        return match.group(0)

    source = re.sub(
        r'\b(href|src)=(["\'])(\.\./|/)?(styles/[a-z0-9-]+\.css|scripts/[a-z0-9-]+\.js)(?:\?[^"\']*)?\2',
        refresh_version,
        source,
    )

    # 7. Unify <title> and og:title brand suffix + author meta
    title_match = re.search(r'<title>(.*?)</title>', source, re.S)
    if title_match:
        new_title = normalize_title(title_match.group(1), rel)
        source = source[:title_match.start()] + f'<title>{escape(new_title)}</title>' + source[title_match.end():]
        # Keep og:title aligned when it matches old title or weekly title
        source = re.sub(
            r'(<meta\b[^>]*property="og:title"[^>]*content=")([^"]*)(")',
            lambda m: f'{m.group(1)}{escape(normalize_title(m.group(2), rel), quote=True)}{m.group(3)}',
            source,
            count=1,
        )
        source = re.sub(
            r'(<meta\b[^>]*content=")([^"]*)("[^>]*property="og:title"[^>]*>)',
            lambda m: f'{m.group(1)}{escape(normalize_title(m.group(2), rel), quote=True)}{m.group(3)}',
            source,
            count=1,
        )

    # 8. Sync JSON-LD structured data block (re-parse light metadata from updated head)
    source = re.sub(r'[ \t]*<script\b[^>]*data-site-ld[^>]*>.*?</script>\n?', '', source, flags=re.S)
    ld_html = build_json_ld(path, root, BeautifulSoup(source, 'html.parser'))
    if ld_html:
        source = source.replace('</head>', f'{ld_html}\n</head>', 1)

    return source


def chrome_updates(root=ROOT):
    root = Path(root)
    versions = {}
    for folder in ('styles', 'scripts'):
        for f in sorted((root / folder).glob('*')):
            if f.is_file() and f.suffix in ('.css', '.js'):
                versions[f'{folder}/{f.name}'] = file_version(root, f'{folder}/{f.name}')
    return {p: sync_page(p, root, versions) for p in managed_pages(root)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='只检查，不写入')
    args = parser.parse_args()
    changed = {
        path: content
        for path, content in chrome_updates().items()
        if path.read_text(encoding='utf-8') != content
    }
    for path, content in changed.items():
        if not args.check:
            path.write_text(content, encoding='utf-8')
        print(f'{"待同步" if args.check else "已同步"}：{path.relative_to(ROOT)}')
    if not changed:
        print('共享导航、页脚、资源版本与 JSON-LD 已同步。')
    return int(args.check and bool(changed))


if __name__ == '__main__':
    raise SystemExit(main())
