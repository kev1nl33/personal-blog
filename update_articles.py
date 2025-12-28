#!/usr/bin/env python3
"""
批量更新文章页面样式
使用 she-arrived.html 作为模板
"""

import os
import re
from pathlib import Path

# 文章文件列表（排除 she-arrived.html 作为模板）
ARTICLE_FILES = [
    "Product-thinking.html",
    "ai-career-tools.html",
    "ai-subscriptions-review.html",
    "breaking-decision-paralysis-with-ai.html",
    "career-transition.html",
    "chatgpt-vs-claude-communication.html",
    "claude-skills-deep-dive.html",
    "cycling-weight-loss-journey.html",
    "freelance-first-year.html",
    "gcdf-certification-guide.html",
    "knowledge-management-evolution.html",
    "living-in-the-moment.html",
    "minimalism-digital-life.html",
    "name-explain.html",
    "npc-principle.html",
    "overcoming-instincts.html",
    "resignation-decision-process.html",
    "tech-stock-analysis.html",
    "the-courage-to-be-disliked-reading-notes.html",
    "vision-pro-office-experience.html",
]

# 分类到 tag class 的映射
CATEGORY_TAG_MAP = {
    "个人成长": "tag--personal",
    "职业发展": "tag--career",
    "AI应用": "tag--ai",
    "投资思考": "tag--investment",
    "读书笔记": "tag--reading",
}

def extract_article_info(html_content):
    """从旧的 HTML 中提取文章信息"""
    info = {}

    # 提取 title
    title_match = re.search(r'<title>(.+?) - 计划李</title>', html_content)
    info['title'] = title_match.group(1) if title_match else "未知标题"

    # 提取 description
    desc_match = re.search(r'<meta name="description" content="(.+?)"', html_content)
    info['description'] = desc_match.group(1) if desc_match else ""

    # 提取 keywords
    keywords_match = re.search(r'<meta name="keywords" content="(.+?)"', html_content)
    info['keywords'] = keywords_match.group(1) if keywords_match else ""

    # 提取 canonical URL
    canonical_match = re.search(r'<link rel="canonical" href="(.+?)"', html_content)
    info['canonical'] = canonical_match.group(1) if canonical_match else ""

    # 提取 og:url
    og_url_match = re.search(r'<meta property="og:url" content="(.+?)"', html_content)
    info['og_url'] = og_url_match.group(1) if og_url_match else ""

    # 提取发布日期
    date_match = re.search(r'<meta property="article:published_time" content="(.+?)"', html_content)
    info['date'] = date_match.group(1) if date_match else ""

    # 提取分类
    section_match = re.search(r'<meta property="article:section" content="(.+?)"', html_content)
    info['category'] = section_match.group(1) if section_match else "个人成长"

    # 提取阅读时间
    read_time_match = re.search(r'<span class="article-read">(\d+)分钟', html_content)
    if not read_time_match:
        read_time_match = re.search(r'(\d+)分钟阅读', html_content)
    info['read_time'] = read_time_match.group(1) if read_time_match else "5"

    # 提取文章内容
    content_match = re.search(r'<div class="article-content">(.*?)</div>\s*</div>\s*</article>', html_content, re.DOTALL)
    if content_match:
        info['content'] = content_match.group(1).strip()
    else:
        # 尝试另一种模式
        content_match = re.search(r'<div class="article-content">(.*?)</div>\s*</div>\s*</div>\s*</article>', html_content, re.DOTALL)
        info['content'] = content_match.group(1).strip() if content_match else ""

    return info

def format_date_chinese(date_str):
    """将日期格式化为中文格式"""
    if not date_str:
        return "未知日期"
    try:
        parts = date_str.split('-')
        if len(parts) == 3:
            return f"{parts[0]}年{int(parts[1])}月{int(parts[2])}日"
    except:
        pass
    return date_str

def get_tag_class(category):
    """获取分类对应的 tag class"""
    return CATEGORY_TAG_MAP.get(category, "tag--personal")

def generate_new_article(info, filename):
    """生成新的文章 HTML"""
    tag_class = get_tag_class(info['category'])
    date_chinese = format_date_chinese(info['date'])

    template = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{info['title']} - 计划李</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="{info['description']}">
    <meta name="keywords" content="{info['keywords']}">
    <meta name="author" content="计划李 (Kevin)">
    <meta name="robots" content="index, follow">
    <meta name="language" content="zh-CN">

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="{info['title']}">
    <meta property="og:description" content="{info['description']}">
    <meta property="og:url" content="{info['og_url']}">
    <meta property="og:site_name" content="计划李的个人博客">
    <meta property="og:locale" content="zh_CN">
    <meta property="article:author" content="计划李">
    <meta property="article:published_time" content="{info['date']}">
    <meta property="article:section" content="{info['category']}">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{info['title']}">
    <meta name="twitter:description" content="{info['description']}">
    <meta name="twitter:creator" content="@计划李">

    <!-- Canonical URL -->
    <link rel="canonical" href="{info['canonical']}">

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
                    <span class="tag {tag_class}">{info['category']}</span>
                </div>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight display-text">
                    {info['title']}
                </h1>
                <p class="font-serif italic text-lg md:text-xl text-gray-600 mb-6">
                    {info['description']}
                </p>
                <div class="flex flex-wrap gap-4 text-sm font-mono text-gray-500">
                    <span>计划李</span>
                    <span>·</span>
                    <span>{date_chinese}</span>
                    <span>·</span>
                    <span>{info['read_time']}分钟阅读</span>
                </div>
            </div>

            <!-- 文章正文 -->
            <div class="bento-card p-8 md:p-12 reveal">
                <div class="article-content">
                    {info['content']}
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="mt-8 reveal">
                <a href="blog.html" class="btn-secondary inline-flex items-center">
                    ← 返回文章列表
                </a>
            </div>
        </div>
    </article>

    <!-- 页脚 -->
    <footer class="border-t-2 border-brand-black mt-16 py-8">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="font-mono text-xs text-gray-500">&copy; 2025 计划李. All rights reserved.</p>
                <div class="flex gap-6">
                    <a href="https://zhihu.com" target="_blank" class="font-mono text-xs font-bold hover:text-brand-accent transition-colors">知乎</a>
                    <a href="https://github.com" target="_blank" class="font-mono text-xs font-bold hover:text-brand-accent transition-colors">GitHub</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // 滚动显示动画
        const observerOptions = {{
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        }};

        const observer = new IntersectionObserver((entries) => {{
            entries.forEach(entry => {{
                if (entry.isIntersecting) {{
                    entry.target.classList.add('active');
                }}
            }});
        }}, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {{
            observer.observe(el);
        }});

        // 目录导航生成
        document.addEventListener('DOMContentLoaded', function() {{
            const articleContent = document.querySelector('.article-content');
            const tocList = document.getElementById('toc-list');
            const headings = articleContent.querySelectorAll('h2, h3');

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
</html>
'''
    return template

def main():
    base_dir = Path(__file__).parent
    updated_count = 0
    failed_files = []

    for filename in ARTICLE_FILES:
        filepath = base_dir / filename

        if not filepath.exists():
            print(f"⚠️  文件不存在: {filename}")
            failed_files.append(filename)
            continue

        try:
            # 读取原文件
            with open(filepath, 'r', encoding='utf-8') as f:
                old_content = f.read()

            # 提取文章信息
            info = extract_article_info(old_content)

            if not info['content']:
                print(f"⚠️  无法提取内容: {filename}")
                failed_files.append(filename)
                continue

            # 生成新文件
            new_content = generate_new_article(info, filename)

            # 写入新文件
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"✅ 已更新: {filename}")
            updated_count += 1

        except Exception as e:
            print(f"❌ 更新失败 {filename}: {str(e)}")
            failed_files.append(filename)

    print(f"\n📊 更新完成: {updated_count}/{len(ARTICLE_FILES)} 篇文章")
    if failed_files:
        print(f"❌ 失败文件: {', '.join(failed_files)}")

if __name__ == "__main__":
    main()
