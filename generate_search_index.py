#!/usr/bin/env python3
"""
生成全站搜索索引 JSON
"""

import json
import glob
import re
from bs4 import BeautifulSoup

def extract_text_from_html(html_content):
    """从HTML中提取纯文本"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # 移除script和style标签
    for script in soup(["script", "style"]):
        script.decompose()

    # 获取文本
    text = soup.get_text()

    # 清理文本
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = ' '.join(chunk for chunk in chunks if chunk)

    return text

def generate_search_index():
    """生成搜索索引"""
    search_index = []

    # 获取所有HTML文件
    html_files = glob.glob("*.html")

    # 排除不需要的文件
    excluded_files = {'books-preview.html', 'test.html', 'article1.html'}

    for html_file in html_files:
        if html_file in excluded_files:
            continue

        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            soup = BeautifulSoup(content, 'html.parser')

            # 提取标题
            title_tag = soup.find('title')
            title = title_tag.text if title_tag else html_file.replace('.html', '')

            # 提取meta描述
            description_tag = soup.find('meta', {'name': 'description'})
            description = description_tag.get('content', '') if description_tag else ''

            # 提取关键词
            keywords_tag = soup.find('meta', {'name': 'keywords'})
            keywords = keywords_tag.get('content', '') if keywords_tag else ''

            # 提取主要内容（优先从article标签）
            article_content = soup.find('article') or soup.find('main') or soup.find('body')
            if article_content:
                # 移除导航栏和页脚
                for nav in article_content.find_all(['nav', 'footer']):
                    nav.decompose()

                content_text = extract_text_from_html(str(article_content))
            else:
                content_text = extract_text_from_html(content)

            # 限制内容长度
            content_preview = content_text[:500] if content_text else description

            # 提取分类（如果有）
            category = ''
            category_tag = soup.find(class_=['blog-tag', 'article-tag'])
            if category_tag:
                category = category_tag.text.strip()

            # 添加到索引
            search_index.append({
                'url': html_file,
                'title': title.replace(' - 计划李', '').strip(),
                'description': description or content_preview[:200],
                'category': category,
                'keywords': keywords,
                'content': content_preview
            })

            print(f"✅ 已索引: {html_file} - {title}")

        except Exception as e:
            print(f"❌ 处理 {html_file} 失败: {e}")
            continue

    # 保存索引
    with open('search-index.json', 'w', encoding='utf-8') as f:
        json.dump(search_index, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 搜索索引已生成，包含 {len(search_index)} 个页面")

if __name__ == '__main__':
    print("🚀 开始生成搜索索引...")
    generate_search_index()
