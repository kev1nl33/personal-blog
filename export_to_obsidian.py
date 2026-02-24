#!/usr/bin/env python3
"""
将 Notion 博客文章导出为 Markdown 格式到 Obsidian 目录
"""

import os
import re
import requests
from datetime import datetime

# Notion API 配置
NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
DATABASE_ID = os.environ.get("NOTION_DATABASE_ID", "")

# Obsidian 目录路径
OBSIDIAN_PATH = "/Users/liran/Library/Mobile Documents/iCloud~md~obsidian/Documents/个人博客网站/Articles"

NOTION_VERSION = "2022-06-28"
HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
}

# 分类映射
CATEGORY_MAP = {
    "职业发展": "career",
    "AI应用": "ai",
    "投资思考": "investment",
    "个人成长": "personal",
    "读书笔记": "reading",
}


def query_database():
    """查询 Notion 数据库获取所有已发布的文章"""
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"

    payload = {
        "filter": {"property": "已发布", "checkbox": {"equals": True}},
        "sorts": [{"property": "发布日期", "direction": "descending"}],
    }

    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()["results"]


def get_page_content(page_id):
    """获取页面内容（blocks），支持分页获取"""
    url = f"https://api.notion.com/v1/blocks/{page_id}/children"
    all_blocks = []
    start_cursor = None

    while True:
        params = {}
        if start_cursor:
            params["start_cursor"] = start_cursor

        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()
        data = response.json()

        all_blocks.extend(data["results"])

        # 检查是否还有更多内容
        if not data.get("has_more"):
            break

        start_cursor = data.get("next_cursor")

    return all_blocks


def plain_text(rich_text):
    """获取纯文本"""
    return "".join([text["plain_text"] for text in rich_text])


def rich_text_to_markdown(rich_text):
    """将 Notion rich text 转换为 Markdown"""
    md = ""
    for text in rich_text:
        content = text["plain_text"]

        # Markdown 特殊字符转义（但不破坏已有的 Markdown 格式）
        # 只转义可能会干扰格式的字符
        content = content.replace("*", "\\*")  # 转义星号（如果用于斜体/粗体）

        annotations = text.get("annotations", {})

        # 应用格式
        if annotations.get("code"):
            content = f"`{content}`"
        else:
            if annotations.get("bold"):
                content = f"**{content}**"
            if annotations.get("italic"):
                content = f"*{content}*"
            if annotations.get("strikethrough"):
                content = f"~~{content}~~"
            if annotations.get("underline"):
                content = f"<u>{content}</u>"

        # 处理链接
        if text.get("href"):
            content = f"[{content}]({text['href']})"

        md += content

    return md


def block_to_markdown(block):
    """将 Notion block 转换为 Markdown"""
    block_type = block["type"]

    if block_type == "paragraph":
        text = rich_text_to_markdown(block["paragraph"]["rich_text"])
        return f"{text}\n\n"

    elif block_type == "heading_1":
        text = rich_text_to_markdown(block["heading_1"]["rich_text"])
        return f"# {text}\n\n"

    elif block_type == "heading_2":
        text = rich_text_to_markdown(block["heading_2"]["rich_text"])
        return f"## {text}\n\n"

    elif block_type == "heading_3":
        text = rich_text_to_markdown(block["heading_3"]["rich_text"])
        return f"### {text}\n\n"

    elif block_type == "bulleted_list_item":
        text = rich_text_to_markdown(block["bulleted_list_item"]["rich_text"])
        return f"- {text}\n"

    elif block_type == "numbered_list_item":
        text = rich_text_to_markdown(block["numbered_list_item"]["rich_text"])
        return f"1. {text}\n"

    elif block_type == "quote":
        text = rich_text_to_markdown(block["quote"]["rich_text"])
        return f"> {text}\n\n"

    elif block_type == "code":
        text = plain_text(block["code"]["rich_text"])
        language = block["code"].get("language", "")
        return f"```{language}\n{text}\n```\n\n"

    elif block_type == "divider":
        return "---\n\n"

    elif block_type == "callout":
        text = rich_text_to_markdown(block["callout"]["rich_text"])
        emoji = block["callout"].get("icon", {}).get("emoji", "💡")
        return f"> {emoji} {text}\n\n"

    elif block_type == "to_do":
        text = rich_text_to_markdown(block["to_do"]["rich_text"])
        checked = block["to_do"].get("checked", False)
        checkbox = "[x]" if checked else "[ ]"
        return f"- {checkbox} {text}\n"

    return ""


def get_property_value(properties, prop_name):
    """从 properties 中提取值"""
    prop = properties.get(prop_name, {})
    prop_type = prop.get("type")

    if prop_type == "title":
        return plain_text(prop["title"])
    elif prop_type == "rich_text":
        return plain_text(prop["rich_text"])
    elif prop_type == "select":
        return prop["select"]["name"] if prop.get("select") else ""
    elif prop_type == "multi_select":
        return [item["name"] for item in prop.get("multi_select", [])]
    elif prop_type == "date":
        return prop["date"]["start"] if prop.get("date") else ""
    elif prop_type == "number":
        return prop.get("number", 5)
    elif prop_type == "checkbox":
        return prop.get("checkbox", False)
    elif prop_type == "url":
        return prop.get("url", "")

    return ""


def sanitize_filename(filename):
    """清理文件名，移除不合法的字符"""
    # 移除或替换不合法的文件名字符
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # 限制文件名长度
    if len(filename) > 200:
        filename = filename[:200]
    return filename


def generate_markdown_frontmatter(article_data):
    """生成 Markdown frontmatter（YAML 格式）"""
    frontmatter = "---\n"
    frontmatter += f'title: "{article_data["title"]}"\n'
    frontmatter += f'category: "{article_data["category"]}"\n'
    frontmatter += f'category_en: "{article_data["category_en"]}"\n'
    frontmatter += f'date: "{article_data["date_short"]}"\n'
    frontmatter += f'read_time: {article_data["read_time"]}\n'

    if article_data.get("tags"):
        tags_str = ", ".join([f'"{tag}"' for tag in article_data["tags"]])
        frontmatter += f'tags: [{tags_str}]\n'

    frontmatter += f'url: "{article_data["url"]}"\n'
    frontmatter += f'published: true\n'
    frontmatter += "---\n\n"

    return frontmatter


def generate_markdown_content(article_data, blocks):
    """生成完整的 Markdown 内容"""
    md_content = ""

    # 添加 frontmatter
    md_content += generate_markdown_frontmatter(article_data)

    # 添加摘要
    if article_data.get("excerpt"):
        md_content += f"> {article_data['excerpt']}\n\n"

    # 添加分割线
    md_content += "---\n\n"

    # 转换 blocks 为 Markdown
    in_list = False
    list_type = None
    list_content = []

    for block in blocks:
        block_type = block["type"]

        # 处理列表
        if block_type in ["bulleted_list_item", "numbered_list_item"]:
            if not in_list:
                list_type = "ul" if block_type == "bulleted_list_item" else "ol"
                in_list = True
            list_content.append(block_to_markdown(block))
        else:
            if in_list:
                # 输出累积的列表内容
                md_content += "\n".join(list_content)
                md_content += "\n"
                list_content = []
                in_list = False
            md_content += block_to_markdown(block)

    # 输出最后的列表
    if in_list:
        md_content += "\n".join(list_content)
        md_content += "\n"

    return md_content


def save_to_obsidian(filename, content):
    """保存 Markdown 文件到 Obsidian 目录"""
    # 确保 Obsidian 目录存在
    os.makedirs(OBSIDIAN_PATH, exist_ok=True)

    # 清理文件名
    filename = sanitize_filename(filename)
    filepath = os.path.join(OBSIDIAN_PATH, filename)

    # 写入文件
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return filepath


def main():
    """主函数"""
    print("🚀 开始从 Notion 导出文章到 Obsidian...")

    # 检查环境变量
    if not NOTION_TOKEN:
        print("❌ 错误: NOTION_TOKEN 环境变量未设置")
        print("   请运行: export NOTION_TOKEN='your_notion_token'")
        return

    if not DATABASE_ID:
        print("❌ 错误: NOTION_DATABASE_ID 环境变量未设置")
        print("   请运行: export NOTION_DATABASE_ID='your_database_id'")
        return

    # 检查 Obsidian 目录
    if not os.path.exists(OBSIDIAN_PATH):
        print(f"⚠️  警告: Obsidian 目录不存在: {OBSIDIAN_PATH}")
        print(f"   正在创建目录...")
        try:
            os.makedirs(OBSIDIAN_PATH, exist_ok=True)
            print(f"   ✅ 目录创建成功")
        except Exception as e:
            print(f"   ❌ 创建目录失败: {e}")
            return

    # 查询数据库
    try:
        pages = query_database()
        print(f"📚 找到 {len(pages)} 篇已发布文章")
    except Exception as e:
        print(f"❌ 查询 Notion 数据库失败: {e}")
        return

    exported_count = 0

    for page in pages:
        try:
            # 提取文章信息
            properties = page["properties"]
            title = get_property_value(properties, "标题")
            category = get_property_value(properties, "分类")
            tags = get_property_value(properties, "标签")
            date = get_property_value(properties, "发布日期")
            excerpt = get_property_value(properties, "摘要")
            read_time = get_property_value(properties, "阅读时间")
            url = get_property_value(properties, "URL")

            if not url:
                print(f"⚠️  跳过文章 '{title}': 缺少 URL")
                continue

            print(f"📝 处理文章: {title}")

            # 获取文章内容
            blocks = get_page_content(page["id"])

            # 格式化日期
            if date:
                try:
                    date_obj = datetime.fromisoformat(date.replace("Z", "+00:00"))
                    formatted_date = date_obj.strftime("%Y年%m月%d日")
                    formatted_date_short = date_obj.strftime("%Y-%m-%d")
                except:
                    formatted_date = datetime.now().strftime("%Y年%m月%d日")
                    formatted_date_short = datetime.now().strftime("%Y-%m-%d")
            else:
                formatted_date = datetime.now().strftime("%Y年%m月%d日")
                formatted_date_short = datetime.now().strftime("%Y-%m-%d")

            # 准备文章数据
            tags_list = tags if isinstance(tags, list) else []

            article_data = {
                "title": title,
                "category": category,
                "category_en": CATEGORY_MAP.get(category, "personal"),
                "tags": tags_list,
                "date": formatted_date,
                "date_short": formatted_date_short,
                "excerpt": excerpt or "",
                "read_time": read_time or 5,
                "url": url,
            }

            # 生成 Markdown 内容
            markdown_content = generate_markdown_content(article_data, blocks)

            # 生成文件名
            filename = f"{formatted_date_short}-{url}.md"

            # 保存到 Obsidian
            filepath = save_to_obsidian(filename, markdown_content)
            print(f"  ✅ 已导出: {filepath}")
            exported_count += 1

        except Exception as e:
            print(f"  ❌ 处理文章失败: {e}")
            import traceback
            traceback.print_exc()
            continue

    print(f"\n🎉 导出完成！共导出 {exported_count} 篇文章到 Obsidian")
    print(f"📂 目标目录: {OBSIDIAN_PATH}")


if __name__ == "__main__":
    main()
