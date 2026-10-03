"""Static site rendering shared by local builds and Notion synchronization."""
import json
import hashlib
import os
import re
import tempfile
from datetime import datetime
from html import escape
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parent
BASE_URL = 'https://kev1nl33.github.io/personal-blog'
NAV = [('index.html', '首页'), ('blog.html', '文章'), ('visual-design.html', '认知武器'),
       ('coffee.html', '咖啡角'), ('travel.html', '看世界'), ('gallery.html', '回忆录'), ('about.html', '关于')]
CATEGORY_NAMES = {'career': '职业发展', 'ai': 'AI应用', 'investment': '投资思考',
                  'personal': '个人成长', 'reading': '读书笔记'}


def safe_slug(value):
    if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z0-9_-]+', value):
        raise ValueError('Invalid published URL slug')
    return value


def replace_region(source, name, content):
    pattern = rf'(<!-- {re.escape(name)}:start -->).*?(<!-- {re.escape(name)}:end -->)'
    if len(re.findall(pattern, source, re.S)) != 1:
        raise ValueError(f'Expected exactly one {name} region')
    return re.sub(pattern, lambda match: match[1] + '\n' + content + '\n' + match[2], source, flags=re.S)


def with_site_motion(content, name):
    """Attach shared motion to live pages, including nested cognitive tools."""
    depth = len(Path(name).parts) - 1
    prefix = '../' * depth
    for kind, folder in [('css', 'styles'), ('js', 'scripts')]:
        content = re.sub(r'<(?:link|script)\b[^>]*(?:href|src)=["\'][^"\']*' + folder + r'/motion\.' + kind + r'(?:\?[^"\']*)?["\'][^>]*>(?:</script>)?[ \t]*\n?', '', content)
    digest = hashlib.sha256((ROOT / 'scripts/motion.js').read_bytes() + (ROOT / 'styles/motion.css').read_bytes()).hexdigest()[:12]
    content = content.replace('</head>', f'<link rel="stylesheet" href="{prefix}styles/motion.css?v={digest}">\n</head>')
    return content.replace('</body>', f'<script src="{prefix}scripts/motion.js?v={digest}" defer></script>\n</body>')


def commit_outputs(outputs, root=ROOT):
    """Validate the complete batch before replacing any file, with rollback on error."""
    root = Path(root).resolve()
    staged, originals, replaced = [], {}, []
    try:
        for name, content in outputs.items():
            if str(name).endswith('.html'):
                content = with_site_motion(content, name)
            target = (root / name).resolve()
            if root not in target.parents or target.suffix not in {'.html', '.json'}:
                raise ValueError('Output outside site root')
            if target.suffix == '.html' and ('<!DOCTYPE html>' not in content or '</html>' not in content):
                raise ValueError(f'Incomplete HTML: {name}')
            if target.suffix == '.json':
                json.loads(content)
            originals[target] = target.read_bytes() if target.exists() else None
            target.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=target.parent, delete=False) as handle:
                handle.write(content)
                staged.append((Path(handle.name), target))
        for temporary, target in staged:
            os.replace(temporary, target)
            replaced.append(target)
    except Exception:
        for target in reversed(replaced):
            if originals[target] is None:
                target.unlink(missing_ok=True)
            else:
                target.write_bytes(originals[target])
        raise
    finally:
        for temporary, _ in staged:
            temporary.unlink(missing_ok=True)


def navigation(active):
    links = ''.join(f'<li><a href="{url}" class="nav-link"'
                    f'{chr(32) + "aria-current=page" if url == active else ""}>{label}</a></li>' for url, label in NAV)
    return f'''<a class="skip-link" href="#main">跳到内容</a>
<nav class="site-nav" aria-label="主导航"><div class="container nav-inner">
<a class="nav-logo" href="index.html" aria-label="计划李 首页">计划李<span aria-hidden="true">▪</span></a>
<button class="nav-toggle" aria-controls="site-menu" aria-expanded="false" aria-label="打开菜单" hidden>菜单 <span aria-hidden="true">＋</span></button>
<ul class="nav-links" id="site-menu">{links}</ul></div></nav>'''


def page(title, description, url, body, active=None, css='', js='', kind=''):
    template = Template((ROOT / 'templates/page.html').read_text())
    result = template.substitute(title=escape(title), description=escape(description, quote=True),
                               canonical=escape(f'{BASE_URL}/{url}', quote=True),
                               navigation=navigation(active or url), body=body,
                               css=css, js=js, kind=kind, year=datetime.now().year)
    version = hashlib.sha256(b''.join(p.read_bytes() for folder in ['styles', 'scripts'] for p in sorted((ROOT / folder).glob('*')) if p.is_file())).hexdigest()[:10]
    return re.sub(r'(styles/[^\"]+\.css|scripts/[^\"]+\.js)(\")', lambda m: m.group(1) + '?v=' + version + m.group(2), result)


def article_card(article, featured=False):
    slug = safe_slug(article['url'])
    title, excerpt = escape(article['title']), escape(article.get('excerpt', ''))
    category = escape(article.get('category_en', 'personal'), quote=True)
    tags = escape(','.join(article.get('tags', [])), quote=True)
    date = escape(str(article.get('date_short', '')))
    read_time = escape(str(article.get('read_time') or 5))
    return f'''<article class="{'feature-story' if featured else 'blog-card'}" data-category="{category}" data-tags="{tags}">
<div class="story-meta"><span class="card-tag">{escape(article.get('category', '个人成长'))}</span><time datetime="{date}">{date}</time></div>
<h2 class="blog-card-title"><a href="{slug}.html">{title}</a></h2>
<p class="blog-card-excerpt">{excerpt}</p>
<div class="story-foot"><span>{read_time} 分钟阅读</span><a href="{slug}.html" aria-label="阅读全文：{escape(article['title'], quote=True)}">阅读全文 <span aria-hidden="true">↗</span></a></div></article>'''


def render_article(article):
    slug = safe_slug(article['url'])
    body = Template((ROOT / 'templates/article.html').read_text()).substitute(
        title=escape(article['title']), excerpt=escape(article.get('excerpt', '')),
        category=escape(article.get('category', '个人成长')),
        date=escape(str(article.get('date_short', ''))), read_time=escape(str(article.get('read_time') or 5)),
        content=article.get('content', ''),
    )
    result = page(f'{article["title"]} - 计划李', article.get('excerpt', '')[:160], f'{slug}.html', body,
                active='blog.html', css='<link rel="stylesheet" href="styles/article.css">',
                js='<script src="scripts/toc.js" defer></script>', kind='article-page')
    return result.replace('<meta property="og:type" content="website">',
        '<meta property="og:type" content="article">' +
        f'<meta property="article:published_time" content="{escape(str(article.get("date_short", "")), quote=True)}">' +
        f'<meta property="article:section" content="{escape(article.get("category", ""), quote=True)}">')


def render_home(articles):
    template = Template((ROOT / 'templates/home.html').read_text())
    body = template.substitute(featured=article_card(articles[0], True) if articles else '<p>文章整理中。</p>',
                               recent=''.join(article_card(a) for a in articles[1:4]), count=len(articles))
    return page('计划李 - 一个普通人的生活实验', '记录职业转型、AI 应用、投资思考和日常生活。一个普通人的生活实验。', 'index.html', body, kind='home-page')


def render_blog(articles):
    categories = ''.join(f'<button class="category-btn" data-category="{key}" aria-pressed="false">{label}<span class="count-pill">{sum(a.get("category_en") == key for a in articles)}</span></button>' for key, label in CATEGORY_NAMES.items())
    tags = sorted({tag for article in articles for tag in article.get('tags', [])})
    options = ''.join(f'<option value="{escape(tag, quote=True)}">{escape(tag)}</option>' for tag in tags)
    body = Template((ROOT / 'templates/blog.html').read_text()).substitute(
        count=len(articles), categories=categories, tags=options,
        cards=''.join(article_card(article) for article in articles))
    return page('所有文章 - 计划李', '按主题与关键词浏览计划李的文章：职业发展、AI应用、投资思考、个人成长、读书笔记。', 'blog.html', body,
                js='<script src="scripts/blog.js" defer></script>', kind='archive-page')


def render_coffee(source_root=ROOT):
    from bs4 import BeautifulSoup
    body = BeautifulSoup((ROOT / 'templates/coffee.html').read_text(), 'html.parser')
    counts = {'equipment': len(body.select('.equipment-expandable-card'))}
    bean_names = []
    for panel_id, filename, selector in [('beans', 'coffee-beans.html', '.bean-card'),
                                         ('cafes', 'coffee-shops.html', '.shop-card'),
                                         ('notes', 'coffee-notes.html', '.note-card')]:
        source = BeautifulSoup((Path(source_root) / filename).read_text(), 'html.parser')
        cards = source.select(selector)
        if panel_id == 'beans':
            bean_names = [heading.get_text(' ', strip=True) for card in cards
                          if (heading := card.select_one('h3'))]
        if panel_id == 'notes':
            title = body.find(id='coffee-latest-title')
            summary = body.select_one('.coffee-latest-copy p')
            if cards:
                heading = cards[0].select_one('h3')
                paragraph = cards[0].select_one('.note-content p')
                note_title = heading.get_text(' ', strip=True) if heading else '最近的冲煮记录'
                note_text = paragraph.get_text(' ', strip=True) if paragraph else ''
                title.string = note_title
                summary.string = note_text[:125].rsplit(' ', 1)[0] + ('…' if len(note_text) > 125 else '') if note_text else '打开笔记，看看这杯咖啡的记录。'
                if any(name.split()[0] in note_title or name.split()[0] in note_text for name in bean_names):
                    link = body.new_tag('a', href='#beans')
                    link['data-coffee-tab'] = 'beans'
                    link.string = '查看相关豆子 ↗'
                    body.select_one('.coffee-latest-copy').append(link)
            else:
                title.string = '下一杯，待记录。'
                summary.string = '新的冲煮笔记会从这里开始。'
        counts[panel_id] = len(cards)
        panel = body.find(id=panel_id)
        panel.clear()
        heading = body.new_tag('h2', attrs={'class': 'sr-only'})
        heading.string = {'beans':'豆子档案','cafes':'探店记录','notes':'冲煮日记'}[panel_id]
        panel.append(heading)
        grid = body.new_tag('div', attrs={'class': 'grid grid-cols-1 md:grid-cols-2 gap-6 py-8'})
        for card in cards:
            card['class'] = [name for name in card.get('class', []) if name not in ['reveal','md:ml-16']]
            grid.append(card)
        if not cards:
            message = body.new_tag('p')
            message.string = '暂时没有记录，下一次实践后继续更新。'
            grid.append(message)
        panel.append(grid)
    for key, count in counts.items():
        element = body.find(id='stat-' + key)
        if element:
            element.string = str(count)
    return page('咖啡角 - 计划李', '记录器具、豆子、探店与日常冲煮。', 'coffee.html', str(body),
                css='<link rel="stylesheet" href="styles/coffee.css">',
                js='<script src="scripts/coffee.js" defer></script>', kind='coffee-page')


def build_outputs(articles):
    outputs = {f'{safe_slug(a["url"])}.html': render_article(a) for a in articles}
    if len(outputs) != len(articles):
        raise ValueError('Duplicate published URLs')
    outputs.update({'index.html': render_home(articles), 'blog.html': render_blog(articles)})
    return outputs


def build_site():
    articles = sorted(json.loads((ROOT / 'data/articles.json').read_text()), key=lambda a: a.get('date_short', ''), reverse=True)
    outputs = build_outputs(articles)
    for name, title, description, css, js in [
        ('about', '关于 Kevin - 计划李', '职业转型、AI 应用与生活记录，了解计划李的经历和当前关注。', '', ''),
        ('coffee', '咖啡角 - 计划李', '记录器具、豆子、探店与日常冲煮。', 'coffee', '<script src="scripts/coffee.js" defer></script>'),
        ('travel', '看世界 - 计划李', '计划李的旅行记录与旅途计划。', 'travel', '<script src="scripts/travel.js" defer></script>'),
        ('gallery', '回忆录 - 计划李', '旅行相册与日常光影记录。', 'gallery', '<script src="scripts/gallery.js" defer></script>'),
        ('visual-design', '108种认知武器 - 计划李', '思维模型、认知工具与个人笔记。', 'visual-design', '<script src="scripts/cognitive.js" defer></script>'),
    ]:
        body = (ROOT / f'templates/{name}.html').read_text()
        outputs[f'{name}.html'] = page(title, description, f'{name}.html', body,
            css=f'<link rel="stylesheet" href="styles/{css}.css">' if css else '', js=js, kind=f'{name}-page')
    outputs['coffee.html'] = render_coffee()
    for path in list(ROOT.glob('*.html')) + list((ROOT / 'projects').rglob('*.html')):
        if path.name in {'test.html', 'article1.html'} or '-backup-' in path.name:
            continue
        name = str(path.relative_to(ROOT))
        if name not in outputs:
            outputs[name] = path.read_text()
    commit_outputs(outputs)
    print(f'Generated {len(outputs)} pages from templates and cached published content')

if __name__ == '__main__':
    build_site()
