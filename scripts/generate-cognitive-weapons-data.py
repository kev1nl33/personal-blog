#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成108种认知武器的数据文件
从HTML文件中提取标题和描述，生成JSON数据
"""

import os
import json
import re
from html.parser import HTMLParser

class TitleExtractor(HTMLParser):
    """提取HTML中的title标签内容"""
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data

def extract_title_from_html(file_path):
    """从HTML文件中提取标题"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            parser = TitleExtractor()
            parser.feed(content)
            return parser.title.strip()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def extract_title_from_js_config(file_path):
    """从JavaScript配置中提取中文和英文标题（用于017及之后的文件）"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

            # 提取中文标题：zh: { header: { title: "xxx"
            zh_match = re.search(r'zh:\s*{[^}]*header:\s*{[^}]*title:\s*["\']([^"\']+)["\']', content, re.DOTALL)
            zh_title = zh_match.group(1) if zh_match else None

            # 提取英文标题：en: { header: { title: "xxx"
            en_match = re.search(r'en:\s*{[^}]*header:\s*{[^}]*title:\s*["\']([^"\']+)["\']', content, re.DOTALL)
            en_title = en_match.group(1) if en_match else None

            return zh_title, en_title
    except Exception as e:
        print(f"Error extracting JS config from {file_path}: {e}")
        return None, None

def parse_filename(filename):
    """从文件名解析序号和英文标题"""
    # 格式: 001_The Learning Pyramid.html
    match = re.match(r'(\d+)_(.+)\.html', filename)
    if match:
        number = match.group(1)
        en_title = match.group(2)
        return number, en_title
    return None, None

def generate_cognitive_weapons_data():
    """生成认知武器数据"""
    projects_dir = "projects/108 Cognitive Weapons"
    data = []

    # 获取所有HTML文件
    files = [f for f in os.listdir(projects_dir) if f.endswith('.html')]
    files.sort()  # 按文件名排序

    for filename in files:
        number, en_title_from_filename = parse_filename(filename)
        if not number:
            continue

        file_path = os.path.join(projects_dir, filename)

        # 尝试从JavaScript配置中提取标题（用于017及之后的文件）
        js_zh_title, js_en_title = extract_title_from_js_config(file_path)

        # 如果JS配置中有标题，优先使用
        if js_zh_title and js_en_title:
            cn_title = js_zh_title
            en_title = js_en_title
            description = f"{en_title} - {cn_title}"
            print(f"  {number}: {cn_title} ({en_title}) [从JS配置提取]")
        else:
            # 否则从HTML title标签提取（适用于001-016）
            full_title = extract_title_from_html(file_path)
            cn_title = en_title_from_filename  # 默认使用文件名中的英文标题
            en_title = en_title_from_filename
            description = en_title_from_filename

            if full_title and full_title != "认知模型工厂 - Cognitive Model Generator":
                # 尝试提取中文标题（第一个 - 之前的部分）
                # 格式: "中文标题 - 108种认知武器 | English Title - 108 Cognitive Weapons"
                parts = full_title.split('-')
                if len(parts) > 0:
                    cn_part = parts[0].strip()
                    # 如果包含中文字符，使用它
                    if any('\u4e00' <= c <= '\u9fff' for c in cn_part):
                        cn_title = cn_part

                # 尝试提取英文标题（| 之后，第二个 - 之前）
                if '|' in full_title:
                    en_parts = full_title.split('|')
                    if len(en_parts) > 1:
                        en_part = en_parts[1].split('-')[0].strip()
                        if en_part:
                            en_title = en_part

                description = f"{en_title} - {cn_title}"
                print(f"  {number}: {cn_title} ({en_title}) [从HTML title提取]")

        # 创建项目数据
        project = {
            "number": number,
            "cn_title": cn_title,
            "en_title": en_title,
            "description": description,
            "url": f"projects/108 Cognitive Weapons/{filename}"
        }

        data.append(project)

    # 保存为JSON文件
    output_file = "data/cognitive-weapons.json"
    os.makedirs("data", exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 成功生成 {len(data)} 个认知武器数据")
    print(f"📄 保存到: {output_file}")

    return len(data)

if __name__ == "__main__":
    count = generate_cognitive_weapons_data()
    print(f"\n总计: {count} 个认知武器")
