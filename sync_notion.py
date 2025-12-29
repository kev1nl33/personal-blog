#!/usr/bin/env python3
"""
Notion 博客同步脚本（完整版）
从 Notion Database 读取文章并生成 HTML，同时更新文章列表
"""

import os
import re
import requests
from datetime import datetime

# Notion API 配置
NOTION_TOKEN = os.environ.get('NOTION_TOKEN', '')
DATABASE_ID = os.environ.get('NOTION_DATABASE_ID', '')
READING_LIST_DB_ID = os.environ.get('NOTION_READING_LIST_DB_ID', '2e71271652c047318638fcbf7fab4677')

# 咖啡内容数据库配置
COFFEE_BEANS_DB_ID = os.environ.get('COFFEE_BEANS_DB_ID', '2c0ee0e5ac2945acb2fea6856fb95d31')
CAFE_VISITS_DB_ID = os.environ.get('CAFE_VISITS_DB_ID', 'de0b87e30eb84278826c73f2e4d69b7d')
BREWING_NOTES_DB_ID = os.environ.get('BREWING_NOTES_DB_ID', '5a158f1d0cb54aed8414c426133e03da')

NOTION_VERSION = '2022-06-28'
HEADERS = {
    'Authorization': f'Bearer {NOTION_TOKEN}',
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json'
}

# 分类映射
CATEGORY_MAP = {
    '职业发展': 'career',
    'AI应用': 'ai',
    '投资思考': 'investment',
    '个人成长': 'personal',
    '读书笔记': 'reading'
}

def query_database():
    """查询 Notion 数据库获取所有已发布的文章"""
    url = f'https://api.notion.com/v1/databases/{DATABASE_ID}/query'
    
    payload = {
        "filter": {
            "property": "已发布",
            "checkbox": {
                "equals": True
            }
        },
        "sorts": [
            {
                "property": "发布日期",
                "direction": "descending"
            }
        ]
    }
    
    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()['results']

def get_page_content(page_id):
    """获取页面内容（blocks）"""
    url = f'https://api.notion.com/v1/blocks/{page_id}/children'
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()['results']

def block_to_html(block):
    """将 Notion block 转换为 HTML"""
    block_type = block['type']
    
    if block_type == 'paragraph':
        text = rich_text_to_html(block['paragraph']['rich_text'])
        return f'<p>{text}</p>\n'
    
    elif block_type == 'heading_1':
        text = rich_text_to_html(block['heading_1']['rich_text'])
        return f'<h2>{text}</h2>\n'
    
    elif block_type == 'heading_2':
        text = rich_text_to_html(block['heading_2']['rich_text'])
        return f'<h3>{text}</h3>\n'
    
    elif block_type == 'heading_3':
        text = rich_text_to_html(block['heading_3']['rich_text'])
        return f'<h4>{text}</h4>\n'
    
    elif block_type == 'bulleted_list_item':
        text = rich_text_to_html(block['bulleted_list_item']['rich_text'])
        return f'<li>{text}</li>\n'
    
    elif block_type == 'numbered_list_item':
        text = rich_text_to_html(block['numbered_list_item']['rich_text'])
        return f'<li>{text}</li>\n'
    
    elif block_type == 'quote':
        text = rich_text_to_html(block['quote']['rich_text'])
        return f'<blockquote><p>{text}</p></blockquote>\n'
    
    elif block_type == 'code':
        text = plain_text(block['code']['rich_text'])
        return f'<pre><code>{text}</code></pre>\n'
    
    return ''

def rich_text_to_html(rich_text):
    """将 Notion rich text 转换为 HTML"""
    html = ''
    for text in rich_text:
        content = text['plain_text']
        # HTML 转义
        content = content.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        
        annotations = text.get('annotations', {})
        
        if annotations.get('bold'):
            content = f'<strong>{content}</strong>'
        if annotations.get('italic'):
            content = f'<em>{content}</em>'
        if annotations.get('code'):
            content = f'<code>{content}</code>'
        
        if text.get('href'):
            content = f'<a href="{text["href"]}">{content}</a>'
        
        html += content
    
    return html

def plain_text(rich_text):
    """获取纯文本"""
    return ''.join([text['plain_text'] for text in rich_text])

def get_property_value(properties, prop_name):
    """从 properties 中提取值"""
    prop = properties.get(prop_name, {})
    prop_type = prop.get('type')

    if prop_type == 'title':
        return plain_text(prop['title'])
    elif prop_type == 'rich_text':
        return plain_text(prop['rich_text'])
    elif prop_type == 'select':
        return prop['select']['name'] if prop.get('select') else ''
    elif prop_type == 'multi_select':
        return [item['name'] for item in prop.get('multi_select', [])]
    elif prop_type == 'date':
        return prop['date']['start'] if prop.get('date') else ''
    elif prop_type == 'number':
        return prop.get('number', 5)
    elif prop_type == 'checkbox':
        return prop.get('checkbox', False)
    elif prop_type == 'url':
        return prop.get('url', '')
    elif prop_type == 'files':
        # 处理文件类型（如封面图）
        files = prop.get('files', [])
        if files and len(files) > 0:
            # 返回第一个文件的URL
            file = files[0]
            if file.get('type') == 'external':
                return file.get('external', {}).get('url', '')
            elif file.get('type') == 'file':
                return file.get('file', {}).get('url', '')
        return ''

    return ''

def generate_article_html(article_data):
    """生成文章 HTML（Neo-Brutalism 设计）"""
    # 生成分类标签的CSS类
    category_class_map = {
        'career': 'tag--teal',
        'ai': 'tag--ai',
        'investment': 'tag--investment',
        'personal': 'tag--personal',
        'reading': 'tag--reading'
    }
    category_en = article_data.get('category_en', 'personal')
    tag_class = category_class_map.get(category_en, 'tag--personal')

    template = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - 计划李</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="{description}">
    <meta name="keywords" content="{keywords}">
    <meta name="author" content="计划李 (Kevin)">
    <meta name="robots" content="index, follow">
    <meta name="language" content="zh-CN">

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:url" content="{article_url}">
    <meta property="og:site_name" content="计划李的个人博客">
    <meta property="og:locale" content="zh_CN">
    <meta property="article:author" content="计划李">
    <meta property="article:published_time" content="{date_short}">
    <meta property="article:section" content="{category}">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:creator" content="@计划李">

    <!-- Canonical URL -->
    <link rel="canonical" href="{article_url}">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Noto+Serif+SC:wght@400;700&family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        brand: {{
                            black: '#0a0a0a',
                            white: '#f4f4f0',
                            accent: '#FF4D00',
                            blue: '#0047AB',
                            green: '#059669',
                            gray: '#8a8a8a'
                        }}
                    }},
                    fontFamily: {{
                        sans: ['"Noto Sans SC"', 'Inter', 'sans-serif'],
                        serif: ['"Noto Serif SC"', 'serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    }}
                }}
            }}
        }}
    </script>

    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/neo-brutalism.css">

    <style>
        /* 文章页面专用样式 */
        .article-wrapper {{
            max-width: 960px;
            margin: 0 auto;
            padding: 0 1rem;
        }}

        @media (min-width: 768px) {{
            .article-wrapper {{
                padding: 0 2rem;
            }}
        }}

        .article-content p {{
            font-family: 'Noto Serif SC', Georgia, serif;
            font-size: 1.175rem;
            line-height: 2;
            margin-bottom: 1.75rem;
            color: #1f2937;
            letter-spacing: 0.01em;
        }}

        .article-content h2 {{
            font-size: 1.75rem;
            font-weight: 700;
            margin-top: 3rem;
            margin-bottom: 1rem;
            color: #0a0a0a;
            padding-left: 1rem;
            border-left: 4px solid #FF4D00;
        }}

        .article-content h3 {{
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: #0a0a0a;
            padding-left: 1rem;
            border-left: 4px solid #0a0a0a;
        }}

        .article-content h4 {{
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: #0a0a0a;
        }}

        .article-content blockquote {{
            background: white;
            border: 1px solid #0a0a0a;
            border-left: 4px solid #FF4D00;
            padding: 1.5rem;
            margin: 2rem 0;
            font-family: 'Noto Serif SC', serif;
            font-style: italic;
        }}

        .article-content ul,
        .article-content ol {{
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }}

        .article-content li {{
            font-family: 'Noto Serif SC', Georgia, serif;
            margin-bottom: 0.75rem;
            font-size: 1.175rem;
            line-height: 2;
            color: #1f2937;
        }}

        .article-content a {{
            color: #FF4D00;
            text-decoration: underline;
            text-underline-offset: 2px;
        }}

        .article-content a:hover {{
            background: #FF4D00;
            color: white;
            text-decoration: none;
            padding: 0 0.25rem;
        }}

        .article-content code {{
            background: #f4f4f0;
            border: 1px solid #0a0a0a;
            padding: 0.125rem 0.375rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9em;
        }}

        .article-content pre {{
            background: #0a0a0a;
            color: #f4f4f0;
            padding: 1.5rem;
            border: 2px solid #0a0a0a;
            overflow-x: auto;
            margin: 2rem 0;
        }}

        .article-content pre code {{
            background: none;
            border: none;
            padding: 0;
            color: inherit;
        }}

        .article-content strong {{
            font-weight: 700;
            color: #0a0a0a;
        }}

        /* 目录导航样式 */
        .toc-container {{
            position: fixed;
            top: 120px;
            right: calc((100vw - 960px) / 2 - 220px);
            width: 200px;
            max-height: calc(100vh - 160px);
            overflow-y: auto;
            z-index: 100;
        }}

        .toc-card {{
            background: white;
            border: 1px solid #0a0a0a;
            padding: 1.25rem;
        }}

        .toc-title {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #8a8a8a;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e5e5e5;
        }}

        .toc-list {{
            list-style: none;
            padding: 0;
            margin: 0;
        }}

        .toc-item {{
            margin-bottom: 0.5rem;
        }}

        .toc-link {{
            display: block;
            font-size: 0.875rem;
            color: #6b7280;
            text-decoration: none;
            padding: 0.25rem 0;
            padding-left: 0.75rem;
            border-left: 2px solid transparent;
            transition: all 0.2s ease;
            line-height: 1.4;
        }}

        .toc-link:hover {{
            color: #0a0a0a;
            border-left-color: #0a0a0a;
        }}

        .toc-link.active {{
            color: #FF4D00;
            border-left-color: #FF4D00;
            font-weight: 600;
        }}

        .toc-link.toc-h3 {{
            font-size: 0.8rem;
            padding-left: 1.25rem;
            color: #9ca3af;
        }}

        .toc-link.toc-h3:hover {{
            color: #6b7280;
        }}

        .toc-link.toc-h3.active {{
            color: #FF4D00;
        }}

        .toc-link.toc-h4 {{
            font-size: 0.75rem;
            padding-left: 1.75rem;
            color: #d1d5db;
        }}

        .toc-link.toc-h4:hover {{
            color: #9ca3af;
        }}

        .toc-link.toc-h4.active {{
            color: #FF4D00;
        }}

        /* 隐藏目录在小屏幕 */
        @media (max-width: 1400px) {{
            .toc-container {{
                display: none;
            }}
        }}

        /* 阅读进度条 */
        .reading-progress {{
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: #FF4D00;
            z-index: 9999;
            transition: width 0.1s ease-out;
        }}

        /* 返回顶部按钮 */
        .back-to-top {{
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            background: #0a0a0a;
            color: white;
            border: 2px solid #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
            font-size: 1.25rem;
        }}

        .back-to-top:hover {{
            background: #FF4D00;
            border-color: #FF4D00;
            transform: translateY(-4px);
            box-shadow: 4px 4px 0px #0a0a0a;
        }}

        .back-to-top.visible {{
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }}

        @media (max-width: 768px) {{
            .back-to-top {{
                bottom: 1rem;
                right: 1rem;
                width: 40px;
                height: 40px;
            }}
        }}
    </style>
</head>
<body class="bg-grid min-h-screen">
    <!-- 阅读进度条 -->
    <div class="reading-progress" id="reading-progress"></div>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" id="back-to-top" title="返回顶部">↑</button>

    <!-- 导航栏 -->
    <nav class="nav">
        <div class="container">
            <div class="nav-content">
                <a href="index.html" class="logo">计划李</a>
                <ul class="nav-links">
                    <li><a href="index.html">首页</a></li>
                    <li><a href="blog.html">文章</a></li>
                    <li><a href="visual-design.html">认知武器</a></li>
                    <li><a href="coffee.html">咖啡角</a></li>
                    <li><a href="about.html">关于</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- 目录导航 -->
    <aside class="toc-container" id="toc">
        <div class="toc-card">
            <div class="toc-title">目录</div>
            <ul class="toc-list" id="toc-list">
                <!-- 由 JavaScript 动态生成 -->
            </ul>
        </div>
    </aside>

    <!-- 文章内容 -->
    <article class="py-12 md:py-16">
        <div class="article-wrapper">
            <!-- 文章头部卡片 -->
            <div class="bento-card p-8 md:p-12 mb-8 reveal">
                <div class="mb-4">
                    <span class="tag {tag_class}">{category}</span>
                </div>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight display-text">
                    {title}
                </h1>
                <p class="font-serif italic text-lg md:text-xl text-gray-600 mb-6">
                    {excerpt}
                </p>
                <div class="flex flex-wrap gap-4 text-sm font-mono text-gray-500">
                    <span>计划李</span>
                    <span>·</span>
                    <span>{date}</span>
                    <span>·</span>
                    <span>{read_time}分钟阅读</span>
                </div>
            </div>

            <!-- 文章正文 -->
            <div class="bento-card p-8 md:p-12 reveal">
                <div class="article-content">
                    {content}
                </div>
            </div>
        </div>
    </article>

    <!-- 页脚 -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; 2025 计划李. All rights reserved.</p>
                <div class="social-links">
                    <a href="https://zhihu.com" target="_blank">知乎</a>
                    <a href="https://github.com" target="_blank">GitHub</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Reveal 动画
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {{
            entries.forEach(entry => {{
                if (entry.isIntersecting) {{
                    entry.target.classList.add('active');
                }}
            }});
        }}, {{ threshold: 0.1 }});

        revealElements.forEach(el => {{
            observer.observe(el);
        }});

        // 目录导航生成
        document.addEventListener('DOMContentLoaded', function() {{
            const articleContent = document.querySelector('.article-content');
            const tocList = document.getElementById('toc-list');
            const headings = articleContent.querySelectorAll('h2, h3, h4');

            if (headings.length === 0) {{
                document.getElementById('toc').style.display = 'none';
                return;
            }}

            // 生成目录
            headings.forEach((heading, index) => {{
                // 为标题添加 ID
                const id = 'heading-' + index;
                heading.id = id;

                // 创建目录项
                const li = document.createElement('li');
                li.className = 'toc-item';

                const a = document.createElement('a');
                a.href = '#' + id;
                a.className = 'toc-link toc-' + heading.tagName.toLowerCase();
                a.textContent = heading.textContent;

                // 点击平滑滚动
                a.addEventListener('click', function(e) {{
                    e.preventDefault();
                    heading.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
                }});

                li.appendChild(a);
                tocList.appendChild(li);
            }});

            // 滚动高亮当前章节
            const tocLinks = document.querySelectorAll('.toc-link');

            function updateActiveLink() {{
                let currentHeading = null;
                const scrollPosition = window.scrollY + 150;

                headings.forEach(heading => {{
                    if (heading.offsetTop <= scrollPosition) {{
                        currentHeading = heading;
                    }}
                }});

                tocLinks.forEach(link => {{
                    link.classList.remove('active');
                    if (currentHeading && link.getAttribute('href') === '#' + currentHeading.id) {{
                        link.classList.add('active');
                    }}
                }});
            }}

            window.addEventListener('scroll', updateActiveLink);
            updateActiveLink();
        }});

        // 阅读进度条
        const progressBar = document.getElementById('reading-progress');

        function updateProgressBar() {{
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        }}

        window.addEventListener('scroll', updateProgressBar);
        updateProgressBar();

        // 返回顶部按钮
        const backToTop = document.getElementById('back-to-top');

        function toggleBackToTop() {{
            if (window.scrollY > 400) {{
                backToTop.classList.add('visible');
            }} else {{
                backToTop.classList.remove('visible');
            }}
        }}

        backToTop.addEventListener('click', function() {{
            window.scrollTo({{
                top: 0,
                behavior: 'smooth'
            }});
        }});

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();
    </script>
</body>
</html>'''

    # 添加tag_class到article_data
    article_data['tag_class'] = tag_class
    return template.format(**article_data)

def generate_blog_card(article):
    """生成单个文章卡片 HTML"""
    # 生成标签HTML
    tags_data = ','.join(article.get('tags', []))
    tags_html = ''
    if article.get('tags'):
        tags_html = '<div class="blog-tags">' + ''.join([f'<span class="blog-item-tag">{tag}</span>' for tag in article['tags']]) + '</div>'

    return f'''                <article class="blog-card" data-category="{article['category_en']}" data-tags="{tags_data}">
                    <div class="blog-tag">{article['category']}</div>
                    <h2 class="blog-title">{article['title']}</h2>
                    <p class="blog-excerpt">{article['excerpt']}</p>
                    {tags_html}
                    <div class="blog-meta">
                        <span class="blog-date">{article['date_short']}</span>
                        <span class="blog-read">{article['read_time']}分钟阅读</span>
                    </div>
                    <a href="{article['url']}.html" class="read-more">阅读全文 →</a>
                </article>

'''

def update_blog_html(articles):
    """更新 blog.html 的文章列表"""
    try:
        with open('blog.html', 'r', encoding='utf-8') as f:
            content = f.read()

        # 收集所有唯一标签
        all_tags = set()
        for article in articles:
            for tag in article.get('tags', []):
                all_tags.add(tag)

        # 生成标签筛选按钮HTML
        tags_buttons_html = '<button class="tag-btn active" data-tag="all">全部标签</button>'
        for tag in sorted(all_tags):
            tags_buttons_html += f'<button class="tag-btn" data-tag="{tag}">{tag}</button>'

        # 替换标签筛选区域
        tag_pattern = r'(<div class="tag-filters" id="tagFilters">)(.*?)(</div>)'
        if re.search(tag_pattern, content, flags=re.DOTALL):
            content = re.sub(tag_pattern, r'\1\n                ' + tags_buttons_html + r'\n            \3', content, flags=re.DOTALL)

        # 生成所有文章卡片
        cards_html = ''.join([generate_blog_card(article) for article in articles])

        # 替换文章列表部分
        # 查找 <div class="blog-grid" id="blogGrid"> 到下一个 </div> 之间的内容
        pattern = r'(<div class="blog-grid" id="blogGrid">)(.*?)(</div>\s*</div>\s*</section>)'
        replacement = r'\1\n' + cards_html + r'            \3'

        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        with open('blog.html', 'w', encoding='utf-8') as f:
            f.write(new_content)

        print("✅ blog.html 更新成功")
        return True
    except Exception as e:
        print(f"❌ 更新 blog.html 失败: {e}")
        return False

def update_index_html(articles):
    """更新 index.html 的精选文章"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 只取前3篇文章作为精选
        featured = articles[:3]
        
        cards_html = ''
        for article in featured:
            cards_html += f'''                <article class="article-card">
                    <div class="article-tag">{article['category']}</div>
                    <h3 class="article-title">{article['title']}</h3>
                    <p class="article-excerpt">{article['excerpt'][:50]}...</p>
                    <div class="article-meta">
                        <span class="article-date">{article['date_short']}</span>
                        <span class="article-read">{article['read_time']}分钟阅读</span>
                    </div>
                </article>

'''
        
        # 替换精选文章部分
        pattern = r'(<div class="articles-grid">)(.*?)(</div>\s*</div>\s*</section>\s*<!-- 关于简介 -->)'
        replacement = r'\1\n' + cards_html + r'            \3'
        
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ index.html 更新成功")
        return True
    except Exception as e:
        print(f"❌ 更新 index.html 失败: {e}")
        return False

def main():
    """主函数"""
    print("🚀 开始从 Notion 同步文章...")
    
    # 查询数据库
    try:
        pages = query_database()
        print(f"📚 找到 {len(pages)} 篇已发布文章")
    except Exception as e:
        print(f"❌ 查询 Notion 数据库失败: {e}")
        return
    
    articles = []
    
    for page in pages:
        try:
            # 提取文章信息
            properties = page['properties']
            title = get_property_value(properties, '标题')
            category = get_property_value(properties, '分类')
            tags = get_property_value(properties, '标签')  # 从Notion获取标签(multi_select)
            date = get_property_value(properties, '发布日期')
            excerpt = get_property_value(properties, '摘要')
            read_time = get_property_value(properties, '阅读时间')
            url = get_property_value(properties, 'URL')
            
            if not url:
                print(f"⚠️  跳过文章 '{title}': 缺少 URL")
                continue
            
            print(f"📝 处理文章: {title}")
            
            # 获取文章内容
            blocks = get_page_content(page['id'])
            content_html = ''
            
            in_list = False
            list_type = None
            
            for block in blocks:
                block_type = block['type']
                
                # 处理列表
                if block_type in ['bulleted_list_item', 'numbered_list_item']:
                    if not in_list:
                        list_type = 'ul' if block_type == 'bulleted_list_item' else 'ol'
                        content_html += f'<{list_type}>\n'
                        in_list = True
                    content_html += block_to_html(block)
                else:
                    if in_list:
                        content_html += f'</{list_type}>\n'
                        in_list = False
                    content_html += block_to_html(block)
            
            if in_list:
                content_html += f'</{list_type}>\n'
            
            # 格式化日期
            if date:
                try:
                    date_obj = datetime.fromisoformat(date.replace('Z', '+00:00'))
                    formatted_date = date_obj.strftime('%Y年%m月%d日')
                    formatted_date_short = date_obj.strftime('%Y-%m-%d')
                except:
                    formatted_date = datetime.now().strftime('%Y年%m月%d日')
                    formatted_date_short = datetime.now().strftime('%Y-%m-%d')
            else:
                formatted_date = datetime.now().strftime('%Y年%m月%d日')
                formatted_date_short = datetime.now().strftime('%Y-%m-%d')
            
            # 准备文章数据
            # 处理tags - 如果是列表则保持，否则转为空列表
            tags_list = tags if isinstance(tags, list) else []

            # 生成关键词
            keywords = [category] + tags_list + ['计划李', 'Kevin', '个人博客', '职业规划', 'GCDF']
            keywords_str = ', '.join(keywords)

            # 生成描述
            description = (excerpt or '暂无摘要')[:160]

            # 生成文章URL
            article_url = f"https://kev1nl33.github.io/personal-blog/{url}.html"

            article_data = {
                'title': title,
                'category': category,
                'category_en': CATEGORY_MAP.get(category, 'personal'),
                'tags': tags_list,
                'date': formatted_date,
                'date_short': formatted_date_short,
                'excerpt': excerpt or '暂无摘要',
                'read_time': read_time,
                'url': url,
                'content': content_html,
                'keywords': keywords_str,
                'description': description,
                'article_url': article_url
            }
            
            articles.append(article_data)
            
            # 生成文章 HTML
            article_html = generate_article_html(article_data)
            
            # 保存文章
            filename = f'{url}.html'
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(article_html)
            print(f"  ✅ 已生成: {filename}")
            
        except Exception as e:
            print(f"  ❌ 处理文章失败: {e}")
            continue
    
    if articles:
        # 更新文章列表页
        print("\n📋 更新文章列表...")
        update_blog_html(articles)
        
        # 更新首页
        print("🏠 更新首页...")
        update_index_html(articles)
        
        print(f"\n🎉 同步完成！共生成 {len(articles)} 篇文章")
    else:
        print("\n⚠️  没有文章需要同步")

def query_reading_list():
    """查询 Reading List 数据库获取所有已发布的书籍"""
    url = f'https://api.notion.com/v1/databases/{READING_LIST_DB_ID}/query'

    payload = {
        "filter": {
            "property": "已发布",
            "checkbox": {
                "equals": True
            }
        },
        "sorts": [
            {
                "property": "完成日期",
                "direction": "descending"
            }
        ]
    }

    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()['results']


def generate_book_card(book):
    """生成单个书籍卡片 HTML（带封面图的网格布局）"""
    # 数据属性，用于筛选、搜索和排序
    tags_data = ','.join(book.get('tags', []))
    title_data = book.get('title', '')
    author_data = book.get('author', '未知')
    rating_num = book.get('rating', '').count('⭐')  # 评分数字，用于排序
    date_data = book.get('date', '')  # 完成日期

    # 封面图HTML
    cover_url = book.get('cover_url', '')
    if cover_url:
        cover_html = f'''<div class="book-cover">
                        <img src="{cover_url}" alt="{book['title']}" class="book-cover-img" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'book-cover-placeholder\\'><div class=\\'book-cover-placeholder-icon\\'>📖</div><div class=\\'book-cover-placeholder-title\\'>{book['title']}</div></div>'">
                    </div>'''
    else:
        # 无封面图时显示占位符
        cover_html = f'''<div class="book-cover">
                        <div class="book-cover-placeholder">
                            <div class="book-cover-placeholder-icon">📖</div>
                            <div class="book-cover-placeholder-title">{book['title']}</div>
                        </div>
                    </div>'''

    # 生成评分星星
    rating = book.get('rating', '')
    stars = ''.join(['<span class="star">⭐</span>' for _ in range(rating.count('⭐'))])
    rating_html = f'<div class="book-rating">{stars}</div>' if stars else ''

    # 生成类型标签
    tags_html = ''
    if book.get('tags'):
        tags_html = '<div class="book-tags">' + ''.join([f'<span class="book-tag">{tag}</span>' for tag in book['tags']]) + '</div>'

    # 推荐理由
    recommendation_html = ''
    if book.get('recommendation'):
        recommendation_html = f'<p class="book-recommendation">{book["recommendation"]}</p>'

    # 笔记链接（如果有）
    links_html = ''
    if book.get('notes_url'):
        links_html = f'<div class="book-links"><a href="{book["notes_url"]}" class="book-notes-link">📝 查看读书笔记</a></div>'

    return f'''                <article class="book-card" data-tags="{tags_data}" data-title="{title_data}" data-author="{author_data}" data-rating="{rating_num}" data-date="{date_data}">
                    {cover_html}
                    <div class="book-content">
                        <h3 class="book-title">{book['title']}</h3>
                        <p class="book-author">作者：{book['author']}</p>
                        {rating_html}
                        {tags_html}
                        {recommendation_html}
                        {links_html}
                    </div>
                </article>

'''


def update_books_html(books_by_status):
    """更新 books.html 的书籍列表"""
    try:
        with open('books.html', 'r', encoding='utf-8') as f:
            content = f.read()

        # 更新已读书籍
        if books_by_status.get('已读'):
            read_cards = ''.join([generate_book_card(book) for book in books_by_status['已读']])
            pattern = r'(<div class="books-grid" id="readBooks">)(.*?)(</div>\s*</div>\s*</section>)'
            replacement = r'\1\n' + read_cards + r'            \3'
            content = re.sub(pattern, replacement, content, flags=re.DOTALL, count=1)

        # 更新在读书籍
        if books_by_status.get('在读'):
            reading_cards = ''.join([generate_book_card(book) for book in books_by_status['在读']])
            # 找到第二个 books-section
            parts = content.split('<div class="books-grid" id="readingBooks">')
            if len(parts) > 1:
                after = parts[1].split('</div>\n        </div>\n    </section>')[0]
                content = content.replace(
                    f'<div class="books-grid" id="readingBooks">{after}</div>\n        </div>\n    </section>',
                    f'<div class="books-grid" id="readingBooks">\n{reading_cards}            </div>\n        </div>\n    </section>'
                )

        # 更新想读书籍
        if books_by_status.get('想读'):
            want_cards = ''.join([generate_book_card(book) for book in books_by_status['想读']])
            parts = content.split('<div class="books-grid" id="wantToReadBooks">')
            if len(parts) > 1:
                after = parts[1].split('</div>\n        </div>\n    </section>')[0]
                content = content.replace(
                    f'<div class="books-grid" id="wantToReadBooks">{after}</div>\n        </div>\n    </section>',
                    f'<div class="books-grid" id="wantToReadBooks">\n{want_cards}            </div>\n        </div>\n    </section>'
                )

        with open('books.html', 'w', encoding='utf-8') as f:
            f.write(content)

        print("✅ books.html 更新成功")
        return True
    except Exception as e:
        print(f"❌ 更新 books.html 失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def notion_url_to_local(notion_url):
    """将 Notion 页面 URL 转换为本地 HTML 文件路径"""
    if not notion_url:
        return ''

    # 从 Notion URL 中提取页面 ID
    # Notion URL 格式: https://www.notion.so/page-title-<page-id>
    # 或: https://www.notion.so/<workspace>/page-title-<page-id>
    try:
        # 提取最后的 page-id 部分（32位十六进制）
        import re
        match = re.search(r'([a-f0-9]{32})', notion_url)
        if match:
            page_id = match.group(1)
            # 查询博客文章数据库，找到对应的 URL
            # 这里我们假设笔记链接指向的是博客文章
            return convert_notion_page_to_local_url(page_id)
    except Exception as e:
        print(f"  ⚠️  URL 转换失败: {e}")

    # 如果转换失败，返回空字符串
    return ''


def convert_notion_page_to_local_url(page_id):
    """根据 Notion 页面 ID 查找本地 URL"""
    try:
        # 查询博客文章数据库
        pages = query_database()

        for page in pages:
            # 获取页面 ID（移除所有连字符）
            notion_page_id = page['id'].replace('-', '')

            if notion_page_id == page_id:
                # 找到匹配的页面，返回其 URL
                properties = page['properties']
                url = get_property_value(properties, 'URL')
                return url if url else ''

    except Exception as e:
        print(f"  ⚠️  查询页面失败: {e}")

    return ''


def fetch_douban_cover(douban_url):
    """从豆瓣页面抓取封面图URL"""
    if not douban_url:
        return ''

    try:
        import time
        time.sleep(0.5)  # 避免请求过快

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(douban_url, headers=headers, timeout=10)
        response.raise_for_status()

        # 使用正则表达式提取封面图URL
        import re
        # 豆瓣图书页面的封面图通常在 <img ... src="xxx" ... /> 标签中
        match = re.search(r'<img[^>]*src="(https://img\d*\.doubanio\.com/[^"]+)"[^>]*alt="[^"]*封面"', response.text)
        if not match:
            # 尝试另一种模式
            match = re.search(r'<img[^>]*src="(https://img\d*\.doubanio\.com/view/subject/[^"]+\.jpg)"', response.text)

        if match:
            cover_url = match.group(1)
            # 转换为较大尺寸的图片
            cover_url = cover_url.replace('/s/', '/l/').replace('/m/', '/l/')
            print(f"  ✅ 从豆瓣获取封面: {cover_url[:50]}...")
            return cover_url
    except Exception as e:
        print(f"  ⚠️  从豆瓣获取封面失败: {e}")

    return ''


def sync_reading_list():
    """同步阅读书单"""
    print("\n📚 开始同步阅读书单...")

    try:
        books = query_reading_list()
        print(f"📖 找到 {len(books)} 本已发布的书籍")
    except Exception as e:
        print(f"❌ 查询 Reading List 数据库失败: {e}")
        return

    # 按状态分组
    books_by_status = {
        '已读': [],
        '在读': [],
        '想读': []
    }

    for book in books:
        try:
            properties = book['properties']

            # 提取书籍信息
            title = get_property_value(properties, '书名')
            author = get_property_value(properties, '作者')
            status = get_property_value(properties, '状态')
            rating = get_property_value(properties, '评分')
            tags = get_property_value(properties, '类型')
            recommendation = get_property_value(properties, '推荐理由')
            notes = get_property_value(properties, '阅读笔记')
            date = get_property_value(properties, '完成日期')
            douban_url = get_property_value(properties, '豆瓣链接')
            notes_link = get_property_value(properties, '笔记链接')

            # 提取封面图 - 优先从字段获取,其次从页面封面获取,最后从豆瓣抓取
            cover_url = get_property_value(properties, '封面图')
            if not cover_url and book.get('cover'):
                # 从页面封面获取
                cover = book['cover']
                if cover.get('type') == 'external':
                    cover_url = cover.get('external', {}).get('url', '')
                elif cover.get('type') == 'file':
                    cover_url = cover.get('file', {}).get('url', '')

            # 如果仍然没有封面图，尝试从豆瓣链接获取
            if not cover_url and douban_url:
                print(f"  🔍 尝试从豆瓣获取封面: {title}")
                cover_url = fetch_douban_cover(douban_url)

            if not title:
                print(f"⚠️  跳过书籍: 缺少书名")
                continue

            # 格式化日期
            formatted_date = ''
            if date:
                try:
                    date_obj = datetime.fromisoformat(date.replace('Z', '+00:00'))
                    formatted_date = date_obj.strftime('%Y-%m-%d')
                except:
                    formatted_date = date

            # 转换笔记链接
            local_notes_url = ''
            if notes_link:
                local_notes_url = notion_url_to_local(notes_link)
                if local_notes_url:
                    print(f"  🔗 笔记链接转换成功: {local_notes_url}")

            book_data = {
                'title': title,
                'author': author or '未知',
                'status': status,
                'rating': rating,
                'tags': tags if isinstance(tags, list) else [],
                'recommendation': recommendation,
                'notes': notes,
                'date': formatted_date,
                'douban_url': douban_url,
                'notes_url': local_notes_url,
                'cover_url': cover_url  # 添加封面图URL
            }

            # 添加到对应状态的列表
            if status in books_by_status:
                books_by_status[status].append(book_data)

            print(f"  ✅ 处理书籍: {title} ({status}){' [有封面]' if cover_url else ''}")

        except Exception as e:
            print(f"  ❌ 处理书籍失败: {e}")
            import traceback
            traceback.print_exc()
            continue

    # 更新 books.html
    if any(books_by_status.values()):
        print("\n📋 更新书单页面...")
        update_books_html(books_by_status)
        total = sum(len(books) for books in books_by_status.values())
        print(f"\n🎉 书单同步完成！共 {total} 本书籍")
        print(f"   已读: {len(books_by_status['已读'])} 本")
        print(f"   在读: {len(books_by_status['在读'])} 本")
        print(f"   想读: {len(books_by_status['想读'])} 本")
    else:
        print("\n⚠️  没有书籍需要同步")


def query_coffee_beans():
    """查询咖啡豆档案数据库"""
    url = f'https://api.notion.com/v1/databases/{COFFEE_BEANS_DB_ID}/query'

    payload = {
        "filter": {
            "property": "已发布",
            "checkbox": {
                "equals": True
            }
        },
        "sorts": [
            {
                "property": "购买日期",
                "direction": "descending"
            }
        ]
    }

    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()['results']


def generate_bean_card_html(bean):
    """生成单个咖啡豆卡片HTML"""
    # 生成风味标签
    flavors = bean.get('flavor_notes', '').split('、')
    flavor_tags = ''.join([f'<span class="coffee-tag border-2 border-coffee-dark">{f.strip()}</span>' for f in flavors if f.strip()])

    # 生成冲煮参数
    brew_params_html = f'''<div class="brew-params border-2 border-brand-black bg-coffee-foam mb-4">
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get('dose', 15)}g</div>
                            <div class="brew-param-label">粉量</div>
                        </div>
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get('ratio', '1:16')}</div>
                            <div class="brew-param-label">粉水比</div>
                        </div>
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get('temperature', 92)}°C</div>
                            <div class="brew-param-label">水温</div>
                        </div>
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get('brew_time', '2:30')}</div>
                            <div class="brew-param-label">时间</div>
                        </div>
                    </div>'''

    return f'''                <div class="bean-card reveal border-2 border-brand-black bg-white">
                    <h3 class="text-2xl font-black mb-1 text-brand-black">{bean['name']}</h3>
                    <p class="text-sm text-coffee-medium font-mono mb-4 uppercase tracking-wider">{bean['origin']} · {bean['roast']}</p>

                    <div class="mb-4">
                        <span class="text-xs font-mono text-coffee-dark font-bold uppercase block mb-2">风味描述</span>
                        <div class="flex flex-wrap gap-2">
                            {flavor_tags}
                        </div>
                    </div>

                    {brew_params_html}

                    <div class="mb-4">
                        <span class="text-xs font-mono text-coffee-dark font-bold uppercase block mb-2">品鉴笔记</span>
                        <p class="text-sm text-gray-600 font-serif leading-relaxed">{bean.get('tasting_notes', '暂无品鉴笔记')}</p>
                    </div>

                    <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span class="text-sm font-mono text-coffee-medium">{bean.get('source', '未知来源')}</span>
                        <span class="text-xl">{bean.get('rating', '⭐⭐⭐⭐')}</span>
                    </div>
                </div>

'''


def update_coffee_beans_html(beans):
    """更新coffee-beans.html"""
    try:
        with open('coffee-beans.html', 'r', encoding='utf-8') as f:
            content = f.read()

        # 生成所有豆子卡片
        cards_html = ''.join([generate_bean_card_html(bean) for bean in beans])

        # 替换豆子列表部分
        pattern = r'(<div class="grid grid-cols-1 md:grid-cols-2 gap-6">)(.*?)(</div>\s*</div>\s*</section>)'
        replacement = r'\1\n' + cards_html + r'            \3'

        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        with open('coffee-beans.html', 'w', encoding='utf-8') as f:
            f.write(new_content)

        print("✅ coffee-beans.html 更新成功")
        return True
    except Exception as e:
        print(f"❌ 更新 coffee-beans.html 失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def sync_coffee_beans():
    """同步咖啡豆档案"""
    print("\n☕ 开始同步咖啡豆档案...")

    try:
        beans_data = query_coffee_beans()
        print(f"📦 找到 {len(beans_data)} 款已发布的咖啡豆")
    except Exception as e:
        print(f"❌ 查询咖啡豆档案数据库失败: {e}")
        return

    beans = []

    for bean_page in beans_data:
        try:
            properties = bean_page['properties']

            bean = {
                'name': get_property_value(properties, '豆子名称'),
                'origin': get_property_value(properties, '产地'),
                'process': get_property_value(properties, '处理法'),
                'roast': get_property_value(properties, '烘焙度'),
                'flavor_notes': get_property_value(properties, '风味描述'),
                'dose': get_property_value(properties, '粉量'),
                'ratio': get_property_value(properties, '粉水比'),
                'temperature': get_property_value(properties, '水温'),
                'brew_time': get_property_value(properties, '萃取时间'),
                'tasting_notes': get_property_value(properties, '品鉴笔记'),
                'rating': get_property_value(properties, '评分'),
                'source': get_property_value(properties, '购买渠道'),
                'date': get_property_value(properties, '购买日期')
            }

            beans.append(bean)
            print(f"  ✅ 处理咖啡豆: {bean['name']}")

        except Exception as e:
            print(f"  ❌ 处理咖啡豆失败: {e}")
            import traceback
            traceback.print_exc()
            continue

    if beans:
        print("\n📋 更新咖啡豆页面...")
        update_coffee_beans_html(beans)
        print(f"\n🎉 咖啡豆同步完成！共 {len(beans)} 款咖啡豆")
    else:
        print("\n⚠️  没有咖啡豆需要同步")


def query_cafe_visits():
    """查询探店笔记数据库"""
    url = f'https://api.notion.com/v1/databases/{CAFE_VISITS_DB_ID}/query'

    payload = {
        "filter": {
            "property": "已发布",
            "checkbox": {
                "equals": True
            }
        },
        "sorts": [
            {
                "property": "访问日期",
                "direction": "descending"
            }
        ]
    }

    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()['results']


def generate_shop_card_html(shop):
    """生成单个咖啡馆卡片HTML"""
    # 生成标签
    tags = shop.get('tags', [])
    tags_html = ''.join([f'<span class="coffee-tag border-2 border-coffee-dark">{tag}</span>' for tag in tags])

    # 根据推荐状态决定徽章和背景
    badge_html = ''
    bg_color = 'coffee-cream'
    if shop.get('recommend'):
        badge_html = '<div class="absolute top-4 right-4"><span class="bg-brand-accent text-white text-xs font-bold px-3 py-1.5 font-mono border-2 border-brand-black uppercase tracking-wider">必去</span></div>'
        bg_color = 'coffee-cream'

    # 图标选择
    icon_map = {
        '手冲专门店': 'ri-cup-line',
        '精品咖啡': 'ri-cup-line',
        '社区咖啡馆': 'ri-home-heart-line',
        '烘焙坊': 'ri-fire-line',
        '连锁品牌': 'ri-store-2-line'
    }
    icon = 'ri-cup-line'  # 默认图标
    for cafe_type in shop.get('types', []):
        if cafe_type in icon_map:
            icon = icon_map[cafe_type]
            break

    return f'''                <div class="shop-card reveal border-2 border-brand-black bg-white">
                    <div class="h-48 bg-{bg_color} border-b-2 border-brand-black flex items-center justify-center relative">
                        <i class="{icon} text-7xl text-coffee-dark"></i>
                        {badge_html}
                    </div>
                    <div class="shop-info">
                        <div class="shop-location">
                            <i class="ri-map-pin-line"></i>
                            <span>{shop.get('city', '')} · {shop.get('district', '')}</span>
                        </div>
                        <h3 class="shop-name text-brand-black font-black">{shop['name']}</h3>
                        <div class="shop-rating text-brand-accent font-bold">{shop.get('rating', '★★★★')}</div>
                        <p class="shop-highlight mb-4">
                            {shop.get('ambience', '暂无环境评价')}
                        </p>
                        <div class="mb-3">
                            <span class="font-mono text-xs text-coffee-dark font-bold uppercase">必点：</span>
                            <span class="font-serif text-sm text-gray-600">{shop.get('recommendations', '待补充')}</span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            {tags_html}
                        </div>
                    </div>
                </div>

'''


def update_coffee_shops_html(shops):
    """更新coffee-shops.html"""
    try:
        with open('coffee-shops.html', 'r', encoding='utf-8') as f:
            content = f.read()

        # 生成所有咖啡馆卡片
        cards_html = ''.join([generate_shop_card_html(shop) for shop in shops])

        # 替换咖啡馆列表部分
        pattern = r'(<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">)(.*?)(</div>\s*</div>\s*</section>\s*<!-- 返回咖啡角 -->)'
        replacement = r'\1\n' + cards_html + r'            \3'

        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        with open('coffee-shops.html', 'w', encoding='utf-8') as f:
            f.write(new_content)

        print("✅ coffee-shops.html 更新成功")
        return True
    except Exception as e:
        print(f"❌ 更新 coffee-shops.html 失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def sync_cafe_visits():
    """同步探店笔记"""
    print("\n🏪 开始同步探店笔记...")

    try:
        shops_data = query_cafe_visits()
        print(f"📍 找到 {len(shops_data)} 家已发布的咖啡馆")
    except Exception as e:
        print(f"❌ 查询探店笔记数据库失败: {e}")
        return

    shops = []

    for shop_page in shops_data:
        try:
            properties = shop_page['properties']

            shop = {
                'name': get_property_value(properties, '咖啡馆名称'),
                'city': get_property_value(properties, '城市'),
                'district': get_property_value(properties, '区域'),
                'address': get_property_value(properties, '地址'),
                'types': get_property_value(properties, '类型'),
                'rating': get_property_value(properties, '评分'),
                'ambience': get_property_value(properties, '环境评价'),
                'quality': get_property_value(properties, '出品评价'),
                'recommendations': get_property_value(properties, '必点推荐'),
                'tags': get_property_value(properties, '特色标签'),
                'visit_date': get_property_value(properties, '访问日期'),
                'recommend': get_property_value(properties, '是否推荐')
            }

            shops.append(shop)
            print(f"  ✅ 处理咖啡馆: {shop['name']}")

        except Exception as e:
            print(f"  ❌ 处理咖啡馆失败: {e}")
            import traceback
            traceback.print_exc()
            continue

    if shops:
        print("\n📋 更新探店笔记页面...")
        update_coffee_shops_html(shops)
        print(f"\n🎉 探店笔记同步完成！共 {len(shops)} 家咖啡馆")
    else:
        print("\n⚠️  没有咖啡馆需要同步")


def query_brewing_notes():
    """查询冲煮日记数据库"""
    url = f'https://api.notion.com/v1/databases/{BREWING_NOTES_DB_ID}/query'

    payload = {
        "filter": {
            "property": "已发布",
            "checkbox": {
                "equals": True
            }
        },
        "sorts": [
            {
                "property": "日期",
                "direction": "descending"
            }
        ]
    }

    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()['results']


def generate_note_card_html(note):
    """生成单个日记卡片HTML（方案C：卡片式布局）"""
    # 根据类型选择图标和颜色
    type_config = {
        '冲煮记录': {'icon': '☕', 'dot_color': 'coffee-dark', 'bg_class': 'bg-white'},
        '实验': {'icon': '🔬', 'dot_color': 'brand-accent', 'bg_class': 'bg-white'},
        '心情': {'icon': '💭', 'dot_color': 'coffee-cream', 'bg_class': 'bg-coffee-foam'},
        '学习': {'icon': '📚', 'dot_color': 'coffee-light', 'bg_class': 'bg-white'}
    }

    note_type = note.get('type', '冲煮记录')
    config = type_config.get(note_type, type_config['冲煮记录'])
    icon = config['icon']
    dot_color = config['dot_color']
    bg_class = config['bg_class']

    # 格式化日期
    date_str = note.get('date', '')
    if date_str:
        try:
            date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            formatted_date = date_obj.strftime('%Y年%m月%d日 · %A')
            # 翻译星期
            weekday_map = {
                'Monday': '周一', 'Tuesday': '周二', 'Wednesday': '周三',
                'Thursday': '周四', 'Friday': '周五', 'Saturday': '周六', 'Sunday': '周日'
            }
            for en, zh in weekday_map.items():
                formatted_date = formatted_date.replace(en, zh)
        except:
            formatted_date = date_str
    else:
        formatted_date = '未知日期'

    # 生成类型标签
    type_tag = f'<span class="coffee-tag coffee-tag--dark border-2">{icon} {note_type}</span>'

    # 生成冲煮器具信息
    equipment = note.get('equipment', '')
    equipment_html = ''
    if equipment:
        # 如果是列表（multi_select），取第一个或拼接
        if isinstance(equipment, list):
            equipment_str = ', '.join(equipment) if equipment else ''
        else:
            equipment_str = equipment

        if equipment_str:
            equipment_html = f' · <span class="text-coffee-medium">{equipment_str}</span>'

    # 生成标签
    tags = note.get('tags', [])
    tags_html = ''
    if tags and isinstance(tags, list):
        tags_html = f'''
                        <div class="pt-3 border-t border-gray-300">
                            <div class="flex flex-wrap gap-2">
                                {''.join([f'<span class="coffee-tag border-2 border-coffee-dark">{tag}</span>' for tag in tags])}
                            </div>
                        </div>'''

    return f'''                    <div class="note-card reveal md:ml-16 relative {bg_class} border-2 border-brand-black">
                        <div class="hidden md:block absolute -left-12 top-6 w-6 h-6 bg-{dot_color} border-2 border-brand-black"></div>

                        <!-- 标题栏 -->
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-xl font-black text-brand-black">{note.get('title', '无标题')}</h3>
                            {type_tag}
                        </div>

                        <!-- 元信息行 -->
                        <div class="text-sm font-mono text-coffee-medium mb-4">
                            {formatted_date}{equipment_html}
                        </div>

                        <!-- 分隔线 -->
                        <div class="border-t border-gray-300 mb-4"></div>

                        <!-- 内容 -->
                        <div class="note-content mb-4">
                            {note.get('content', '暂无内容')}
                        </div>
                        {tags_html}
                    </div>

'''


def update_coffee_notes_html(notes):
    """更新coffee-notes.html"""
    try:
        with open('coffee-notes.html', 'r', encoding='utf-8') as f:
            content = f.read()

        # 生成所有日记卡片
        cards_html = ''.join([generate_note_card_html(note) for note in notes])

        # 替换日记列表部分
        pattern = r'(<div class="space-y-8">)(.*?)(</div>\s*</div>\s*</div>\s*</section>)'
        replacement = r'\1\n' + cards_html + r'                \3'

        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        with open('coffee-notes.html', 'w', encoding='utf-8') as f:
            f.write(new_content)

        print("✅ coffee-notes.html 更新成功")
        return True
    except Exception as e:
        print(f"❌ 更新 coffee-notes.html 失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def sync_brewing_notes():
    """同步冲煮日记"""
    print("\n📝 开始同步冲煮日记...")

    try:
        notes_data = query_brewing_notes()
        print(f"📖 找到 {len(notes_data)} 条已发布的日记")
    except Exception as e:
        print(f"❌ 查询冲煮日记数据库失败: {e}")
        return

    notes = []

    for note_page in notes_data:
        try:
            properties = note_page['properties']

            # 获取日期
            date = get_property_value(properties, '日期')

            # 获取内容 - 先尝试从属性字段读取，如果为空则读取页面block内容
            content_text = get_property_value(properties, '内容')

            if content_text:
                # 如果内容字段有值，直接使用并转换为HTML段落
                content_html = f'<p>{content_text}</p>'
            else:
                # 否则尝试读取页面block内容
                content_blocks = get_page_content(note_page['id'])
                content_html = ''
                for block in content_blocks:
                    if block['type'] == 'paragraph':
                        text = rich_text_to_html(block['paragraph']['rich_text'])
                        content_html += f'<p>{text}</p>'

            note = {
                'title': get_property_value(properties, '标题'),
                'date': date,
                'type': get_property_value(properties, '类型'),
                'content': content_html or '暂无内容',
                'equipment': get_property_value(properties, '冲煮器具'),
                'tags': get_property_value(properties, '标签'),
            }

            notes.append(note)
            print(f"  ✅ 处理日记: {note['title']}")

        except Exception as e:
            print(f"  ❌ 处理日记失败: {e}")
            import traceback
            traceback.print_exc()
            continue

    if notes:
        print("\n📋 更新冲煮日记页面...")
        update_coffee_notes_html(notes)
        print(f"\n🎉 冲煮日记同步完成！共 {len(notes)} 条日记")
    else:
        print("\n⚠️  没有日记需要同步")


if __name__ == '__main__':
    main()
    sync_reading_list()
    sync_coffee_beans()
    sync_cafe_visits()
    sync_brewing_notes()
