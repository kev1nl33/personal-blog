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
    '个人成长': 'personal'
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
    elif prop_type == 'date':
        return prop['date']['start'] if prop.get('date') else ''
    elif prop_type == 'number':
        return prop.get('number', 5)
    elif prop_type == 'checkbox':
        return prop.get('checkbox', False)
    
    return ''

def generate_article_html(article_data):
    """生成文章 HTML"""
    template = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - 计划李</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/article.css">
</head>
<body>
    <!-- 导航栏 -->
    <nav class="nav">
        <div class="container">
            <div class="nav-content">
                <a href="index.html" class="logo">计划李</a>
                <ul class="nav-links">
                    <li><a href="index.html">首页</a></li>
                    <li><a href="blog.html">文章</a></li>
                    <li><a href="weekly.html">周刊</a></li>
                    <li><a href="about.html">关于</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- 文章内容 -->
    <article class="article-container">
        <div class="container">
            <div class="article-header">
                <div class="article-tag">{category}</div>
                <h1 class="article-title">{title}</h1>
                <div class="article-meta">
                    <span class="article-author">计划李</span>
                    <span class="article-date">{date}</span>
                    <span class="article-read">{read_time}分钟阅读</span>
                </div>
            </div>

            <div class="article-content">
                {content}
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
</body>
</html>'''
    
    return template.format(**article_data)

def generate_blog_card(article):
    """生成单个文章卡片 HTML"""
    return f'''                <article class="blog-card" data-category="{article['category_en']}">
                    <div class="blog-tag">{article['category']}</div>
                    <h2 class="blog-title">{article['title']}</h2>
                    <p class="blog-excerpt">{article['excerpt']}</p>
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
            article_data = {
                'title': title,
                'category': category,
                'category_en': CATEGORY_MAP.get(category, 'personal'),
                'date': formatted_date,
                'date_short': formatted_date_short,
                'excerpt': excerpt or '暂无摘要',
                'read_time': read_time,
                'url': url,
                'content': content_html
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

if __name__ == '__main__':
    main()
