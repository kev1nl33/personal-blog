#!/usr/bin/env python3
"""
Notion 博客同步脚本（完整版）
从 Notion Database 读取文章并生成 HTML，同时更新文章列表
"""

import json
import os
import re
import shutil
import tempfile
from datetime import datetime
from html import escape
from pathlib import Path
from urllib.parse import urlparse

import requests

from site_builder import (ROOT, article_card, build_outputs, commit_outputs, render_article, render_blog, render_home, safe_slug)

# Notion API 配置
NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
DATABASE_ID = os.environ.get("NOTION_DATABASE_ID", "")

# 咖啡内容数据库配置
COFFEE_BEANS_DB_ID = os.environ.get(
    "COFFEE_BEANS_DB_ID", "2c0ee0e5ac2945acb2fea6856fb95d31"
)
CAFE_VISITS_DB_ID = os.environ.get(
    "CAFE_VISITS_DB_ID", "de0b87e30eb84278826c73f2e4d69b7d"
)
BREWING_NOTES_DB_ID = os.environ.get(
    "BREWING_NOTES_DB_ID", "5a158f1d0cb54aed8414c426133e03da"
)

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


def notion_query(url, payload):
    if not NOTION_TOKEN:
        raise RuntimeError('NOTION_TOKEN is not configured')
    results, cursor = [], None
    while True:
        request_payload = dict(payload)
        if cursor:
            request_payload['start_cursor'] = cursor
        response = requests.post(url, headers=HEADERS, json=request_payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        results.extend(data['results'])
        if not data.get('has_more'):
            return results
        next_cursor = data.get('next_cursor')
        if not next_cursor or next_cursor == cursor:
            raise ValueError('Invalid Notion pagination cursor')
        cursor = next_cursor


def safe_content_url(value):
    return value if urlparse(value).scheme in ('http', 'https', 'mailto') else '#'


def query_database():
    """查询 Notion 数据库获取所有已发布的文章"""
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"

    payload = {
        "filter": {"property": "已发布", "checkbox": {"equals": True}},
        "sorts": [{"property": "发布日期", "direction": "descending"}],
    }

    return notion_query(url, payload)


def get_page_content(page_id):
    """获取页面内容（blocks），支持分页获取"""
    url = f"https://api.notion.com/v1/blocks/{page_id}/children"
    all_blocks = []
    start_cursor = None

    while True:
        params = {}
        if start_cursor:
            params["start_cursor"] = start_cursor

        response = requests.get(url, headers=HEADERS, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        all_blocks.extend(data["results"])

        # 检查是否还有更多内容
        if not data.get("has_more"):
            break

        start_cursor = data.get("next_cursor")

    return all_blocks


def block_to_html(block):
    """将 Notion block 转换为 HTML"""
    block_type = block["type"]

    if block_type == "paragraph":
        text = rich_text_to_html(block["paragraph"]["rich_text"])
        return f"<p>{text}</p>\n"

    elif block_type == "heading_1":
        text = rich_text_to_html(block["heading_1"]["rich_text"])
        return f"<h2>{text}</h2>\n"

    elif block_type == "heading_2":
        text = rich_text_to_html(block["heading_2"]["rich_text"])
        return f"<h3>{text}</h3>\n"

    elif block_type == "heading_3":
        text = rich_text_to_html(block["heading_3"]["rich_text"])
        return f"<h4>{text}</h4>\n"

    elif block_type == "bulleted_list_item":
        text = rich_text_to_html(block["bulleted_list_item"]["rich_text"])
        return f"<li>{text}</li>\n"

    elif block_type == "numbered_list_item":
        text = rich_text_to_html(block["numbered_list_item"]["rich_text"])
        return f"<li>{text}</li>\n"

    elif block_type == "quote":
        text = rich_text_to_html(block["quote"]["rich_text"])
        return f"<blockquote><p>{text}</p></blockquote>\n"

    elif block_type == "code":
        text = plain_text(block["code"]["rich_text"])
        return f"<pre><code>{escape(text)}</code></pre>\n"

    return ""


def rich_text_to_html(rich_text):
    """将 Notion rich text 转换为 HTML"""
    html = ""
    for text in rich_text:
        content = text["plain_text"]
        # HTML 转义
        content = (
            content.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        )

        annotations = text.get("annotations", {})

        if annotations.get("bold"):
            content = f"<strong>{content}</strong>"
        if annotations.get("italic"):
            content = f"<em>{content}</em>"
        if annotations.get("code"):
            content = f"<code>{content}</code>"

        if text.get("href"):
            content = f'<a href="{escape(safe_content_url(text["href"]), quote=True)}">{content}</a>'

        html += content

    return html


def plain_text(rich_text):
    """获取纯文本"""
    return "".join([text["plain_text"] for text in rich_text])


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
    elif prop_type == "files":
        # 处理文件类型（如封面图）
        files = prop.get("files", [])
        if files and len(files) > 0:
            # 返回第一个文件的URL
            file = files[0]
            if file.get("type") == "external":
                return file.get("external", {}).get("url", "")
            elif file.get("type") == "file":
                return file.get("file", {}).get("url", "")
        return ""

    return ""


def generate_article_html(article_data):
    """Render from the same template as the local site build."""
    return render_article(article_data)


def generate_blog_card(article):
    return article_card(article)


def update_blog_html(articles):
    commit_outputs({'blog.html': render_blog(articles)}, Path.cwd())
    return True


def update_index_html(articles):
    commit_outputs({'index.html': render_home(articles)}, Path.cwd())
    return True


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
            properties = page["properties"]
            title = get_property_value(properties, "标题")
            category = get_property_value(properties, "分类")
            tags = get_property_value(
                properties, "标签"
            )  # 从Notion获取标签(multi_select)
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
            content_html = ""

            in_list = False
            list_type = None

            for block in blocks:
                block_type = block["type"]

                # 处理列表
                if block_type in ["bulleted_list_item", "numbered_list_item"]:
                    if not in_list:
                        list_type = "ul" if block_type == "bulleted_list_item" else "ol"
                        content_html += f"<{list_type}>\n"
                        in_list = True
                    content_html += block_to_html(block)
                else:
                    if in_list:
                        content_html += f"</{list_type}>\n"
                        in_list = False
                    content_html += block_to_html(block)

            if in_list:
                content_html += f"</{list_type}>\n"

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
            # 处理tags - 如果是列表则保持，否则转为空列表
            tags_list = tags if isinstance(tags, list) else []

            # 生成关键词
            keywords = (
                [category]
                + tags_list
                + ["计划李", "Kevin", "个人博客", "职业规划", "GCDF"]
            )
            keywords_str = ", ".join(keywords)

            # 生成描述
            description = (excerpt or "暂无摘要")[:160]

            # 生成文章URL
            article_url = f"https://kev1nl33.github.io/personal-blog/{url}.html"

            article_data = {
                "title": title,
                "category": category,
                "category_en": CATEGORY_MAP.get(category, "personal"),
                "tags": tags_list,
                "date": formatted_date,
                "date_short": formatted_date_short,
                "excerpt": excerpt or "暂无摘要",
                "read_time": read_time,
                "url": url,
                "content": content_html,
                "keywords": keywords_str,
                "description": description,
                "article_url": article_url,
            }

            articles.append(article_data)

            # 生成文章 HTML
            article_html = generate_article_html(article_data)

            safe_slug(url)
            print(f"  ✅ 已验证: {url}.html")

        except Exception as e:
            print(f"  ❌ 处理文章失败: {e}")
            return False

    articles.sort(key=lambda article: article.get('date_short', ''), reverse=True)
    outputs = build_outputs(articles)
    outputs['data/articles.json'] = json.dumps(articles, ensure_ascii=False, indent=2) + '\n'
    commit_outputs(outputs, Path.cwd())
    print(f"同步完成：{len(articles)} 篇文章")
    return True


def query_coffee_beans():
    """查询咖啡豆档案数据库"""
    url = f"https://api.notion.com/v1/databases/{COFFEE_BEANS_DB_ID}/query"

    payload = {
        "filter": {"property": "已发布", "checkbox": {"equals": True}},
        "sorts": [{"property": "购买日期", "direction": "descending"}],
    }

    return notion_query(url, payload)


def escape_fields(record):
    return {key: escape(value, quote=True) if isinstance(value, str)
            else [escape(item, quote=True) if isinstance(item, str) else item for item in value]
            if isinstance(value, list) else value for key, value in record.items()}


def generate_bean_card_html(bean):
    """生成单个咖啡豆卡片HTML"""
    bean = escape_fields(bean)
    # 生成风味标签
    flavors = bean.get("flavor_notes", "").split("、")
    flavor_tags = "".join(
        [
            f'<span class="coffee-tag border-2 border-coffee-dark">{f.strip()}</span>'
            for f in flavors
            if f.strip()
        ]
    )

    # 生成冲煮参数
    brew_params_html = f"""<div class="brew-params border-2 border-brand-black bg-coffee-foam mb-4">
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get("dose", 15)}g</div>
                            <div class="brew-param-label">粉量</div>
                        </div>
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get("ratio", "1:16")}</div>
                            <div class="brew-param-label">粉水比</div>
                        </div>
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get("temperature", 92)}°C</div>
                            <div class="brew-param-label">水温</div>
                        </div>
                        <div class="brew-param">
                            <div class="brew-param-value">{bean.get("brew_time", "2:30")}</div>
                            <div class="brew-param-label">时间</div>
                        </div>
                    </div>"""

    return f"""                <div class="bean-card reveal border-2 border-brand-black bg-white">
                    <h3 class="text-2xl font-black mb-1 text-brand-black">{bean["name"]}</h3>
                    <p class="text-sm text-coffee-medium font-mono mb-4 uppercase tracking-wider">{bean["origin"]} · {bean["roast"]}</p>

                    <div class="mb-4">
                        <span class="text-xs font-mono text-coffee-dark font-bold uppercase block mb-2">风味描述</span>
                        <div class="flex flex-wrap gap-2">
                            {flavor_tags}
                        </div>
                    </div>

                    {brew_params_html}

                    <div class="mb-4">
                        <span class="text-xs font-mono text-coffee-dark font-bold uppercase block mb-2">品鉴笔记</span>
                        <p class="text-sm text-gray-600 font-serif leading-relaxed">{bean.get("tasting_notes", "暂无品鉴笔记")}</p>
                    </div>

                    <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span class="text-sm font-mono text-coffee-medium">{bean.get("source", "未知来源")}</span>
                        <span class="text-xl">{bean.get("rating", "⭐⭐⭐⭐")}</span>
                    </div>
                </div>

"""


def update_coffee_beans_html(beans):
    """更新coffee-beans.html"""
    try:
        with open("coffee-beans.html", "r", encoding="utf-8") as f:
            content = f.read()

        # 生成所有豆子卡片
        cards_html = "".join([generate_bean_card_html(bean) for bean in beans])

        # 替换豆子列表部分
        pattern = r'(<div class="grid grid-cols-1 md:grid-cols-2 gap-6">)(.*?)(</div>\s*</div>\s*</section>)'
        replacement = r"\1\n" + cards_html + r"            \3"

        new_content, count = re.subn(pattern, lambda match: match[1] + '\n' + cards_html + match[3], content, flags=re.DOTALL)
        if count != 1:
            raise ValueError('Expected one coffee beans content region')
        commit_outputs({'coffee-beans.html': new_content}, Path.cwd())

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
        return False

    beans = []

    for bean_page in beans_data:
        try:
            properties = bean_page["properties"]

            bean = {
                "name": get_property_value(properties, "豆子名称"),
                "origin": get_property_value(properties, "产地"),
                "process": get_property_value(properties, "处理法"),
                "roast": get_property_value(properties, "烘焙度"),
                "flavor_notes": get_property_value(properties, "风味描述"),
                "dose": get_property_value(properties, "粉量"),
                "ratio": get_property_value(properties, "粉水比"),
                "temperature": get_property_value(properties, "水温"),
                "brew_time": get_property_value(properties, "萃取时间"),
                "tasting_notes": get_property_value(properties, "品鉴笔记"),
                "rating": get_property_value(properties, "评分"),
                "source": get_property_value(properties, "购买渠道"),
                "date": get_property_value(properties, "购买日期"),
            }

            beans.append(bean)
            print(f"  ✅ 处理咖啡豆: {bean['name']}")

        except Exception as e:
            print(f"  ❌ 处理咖啡豆失败: {e}")
            import traceback

            traceback.print_exc()
            return False

    return update_coffee_beans_html(beans)


def query_cafe_visits():
    """查询探店笔记数据库"""
    url = f"https://api.notion.com/v1/databases/{CAFE_VISITS_DB_ID}/query"

    payload = {
        "filter": {"property": "已发布", "checkbox": {"equals": True}},
        "sorts": [{"property": "访问日期", "direction": "descending"}],
    }

    return notion_query(url, payload)


def generate_shop_card_html(shop):
    """生成单个咖啡馆卡片HTML"""
    shop = escape_fields(shop)
    # 生成标签
    tags = shop.get("tags", [])
    tags_html = "".join(
        [
            f'<span class="coffee-tag border-2 border-coffee-dark">{tag}</span>'
            for tag in tags
        ]
    )

    # 根据推荐状态决定徽章和背景
    badge_html = ""
    bg_color = "coffee-cream"
    if shop.get("recommend"):
        badge_html = '<div class="absolute top-4 right-4"><span class="bg-brand-accent text-white text-xs font-bold px-3 py-1.5 font-mono border-2 border-brand-black uppercase tracking-wider">必去</span></div>'
        bg_color = "coffee-cream"

    # 图标选择
    icon_map = {
        "手冲专门店": "ri-cup-line",
        "精品咖啡": "ri-cup-line",
        "社区咖啡馆": "ri-home-heart-line",
        "烘焙坊": "ri-fire-line",
        "连锁品牌": "ri-store-2-line",
    }
    icon = "ri-cup-line"  # 默认图标
    for cafe_type in shop.get("types", []):
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
                            <span>{shop.get("city", "")} · {shop.get("district", "")}</span>
                        </div>
                        <h3 class="shop-name text-brand-black font-black">{shop["name"]}</h3>
                        <div class="shop-rating text-brand-accent font-bold">{shop.get("rating", "★★★★")}</div>
                        <p class="shop-highlight mb-4">
                            {shop.get("ambience", "暂无环境评价")}
                        </p>
                        <div class="mb-3">
                            <span class="font-mono text-xs text-coffee-dark font-bold uppercase">必点：</span>
                            <span class="font-serif text-sm text-gray-600">{shop.get("recommendations", "待补充")}</span>
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
        with open("coffee-shops.html", "r", encoding="utf-8") as f:
            content = f.read()

        # 生成所有咖啡馆卡片
        cards_html = "".join([generate_shop_card_html(shop) for shop in shops])

        # 替换咖啡馆列表部分
        pattern = r'(<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">)(.*?)(</div>\s*</div>\s*</section>\s*<!-- 返回咖啡角 -->)'
        replacement = r"\1\n" + cards_html + r"            \3"

        new_content, count = re.subn(pattern, lambda match: match[1] + '\n' + cards_html + match[3], content, flags=re.DOTALL)
        if count != 1:
            raise ValueError('Expected one coffee-shops.html content region')
        commit_outputs({'coffee-shops.html': new_content}, Path.cwd())

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
        return False

    shops = []

    for shop_page in shops_data:
        try:
            properties = shop_page["properties"]

            shop = {
                "name": get_property_value(properties, "咖啡馆名称"),
                "city": get_property_value(properties, "城市"),
                "district": get_property_value(properties, "区域"),
                "address": get_property_value(properties, "地址"),
                "types": get_property_value(properties, "类型"),
                "rating": get_property_value(properties, "评分"),
                "ambience": get_property_value(properties, "环境评价"),
                "quality": get_property_value(properties, "出品评价"),
                "recommendations": get_property_value(properties, "必点推荐"),
                "tags": get_property_value(properties, "特色标签"),
                "visit_date": get_property_value(properties, "访问日期"),
                "recommend": get_property_value(properties, "是否推荐"),
            }

            shops.append(shop)
            print(f"  ✅ 处理咖啡馆: {shop['name']}")

        except Exception as e:
            print(f"  ❌ 处理咖啡馆失败: {e}")
            import traceback

            traceback.print_exc()
            return False

    return update_coffee_shops_html(shops)


def query_brewing_notes():
    """查询冲煮日记数据库"""
    url = f"https://api.notion.com/v1/databases/{BREWING_NOTES_DB_ID}/query"

    payload = {
        "filter": {"property": "已发布", "checkbox": {"equals": True}},
        "sorts": [{"property": "日期", "direction": "descending"}],
    }

    return notion_query(url, payload)


def generate_note_card_html(note):
    """生成单个日记卡片HTML（方案C：卡片式布局）"""
    note = escape_fields(note)
    # 根据类型选择图标和颜色
    type_config = {
        "冲煮记录": {"icon": "☕", "dot_color": "coffee-dark", "bg_class": "bg-white"},
        "实验": {"icon": "🔬", "dot_color": "brand-accent", "bg_class": "bg-white"},
        "心情": {
            "icon": "💭",
            "dot_color": "coffee-cream",
            "bg_class": "bg-coffee-foam",
        },
        "学习": {"icon": "📚", "dot_color": "coffee-light", "bg_class": "bg-white"},
    }

    note_type = note.get("type", "冲煮记录")
    config = type_config.get(note_type, type_config["冲煮记录"])
    icon = config["icon"]
    dot_color = config["dot_color"]
    bg_class = config["bg_class"]

    # 格式化日期
    date_str = note.get("date", "")
    if date_str:
        try:
            date_obj = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            formatted_date = date_obj.strftime("%Y年%m月%d日 · %A")
            # 翻译星期
            weekday_map = {
                "Monday": "周一",
                "Tuesday": "周二",
                "Wednesday": "周三",
                "Thursday": "周四",
                "Friday": "周五",
                "Saturday": "周六",
                "Sunday": "周日",
            }
            for en, zh in weekday_map.items():
                formatted_date = formatted_date.replace(en, zh)
        except:
            formatted_date = date_str
    else:
        formatted_date = "未知日期"

    # 生成类型标签
    type_tag = (
        f'<span class="coffee-tag coffee-tag--dark border-2">{icon} {note_type}</span>'
    )

    # 生成冲煮器具信息
    equipment = note.get("equipment", "")
    equipment_html = ""
    if equipment:
        # 如果是列表（multi_select），取第一个或拼接
        if isinstance(equipment, list):
            equipment_str = ", ".join(equipment) if equipment else ""
        else:
            equipment_str = equipment

        if equipment_str:
            equipment_html = (
                f' · <span class="text-coffee-medium">{equipment_str}</span>'
            )

    # 生成标签
    tags = note.get("tags", [])
    tags_html = ""
    if tags and isinstance(tags, list):
        tags_html = f"""
                        <div class="pt-3 border-t border-gray-300">
                            <div class="flex flex-wrap gap-2">
                                {"".join([f'<span class="coffee-tag border-2 border-coffee-dark">{tag}</span>' for tag in tags])}
                            </div>
                        </div>"""

    return f"""                    <div class="note-card reveal md:ml-16 relative {bg_class} border-2 border-brand-black">
                        <div class="hidden md:block absolute -left-12 top-6 w-6 h-6 bg-{dot_color} border-2 border-brand-black"></div>

                        <!-- 标题栏 -->
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-xl font-black text-brand-black">{note.get("title", "无标题")}</h3>
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
                            {note.get("content", "暂无内容")}
                        </div>
                        {tags_html}
                    </div>

"""


def update_coffee_notes_html(notes):
    """更新coffee-notes.html"""
    try:
        with open("coffee-notes.html", "r", encoding="utf-8") as f:
            content = f.read()

        # 生成所有日记卡片
        cards_html = "".join([generate_note_card_html(note) for note in notes])

        # 替换日记列表部分
        pattern = (
            r'(<div class="space-y-8">)(.*?)(</div>\s*</div>\s*</div>\s*</section>)'
        )
        replacement = r"\1\n" + cards_html + r"                \3"

        new_content, count = re.subn(pattern, lambda match: match[1] + '\n' + cards_html + match[3], content, flags=re.DOTALL)
        if count != 1:
            raise ValueError('Expected one coffee-notes.html content region')
        commit_outputs({'coffee-notes.html': new_content}, Path.cwd())

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
        return False

    notes = []

    for note_page in notes_data:
        try:
            properties = note_page["properties"]

            # 获取日期
            date = get_property_value(properties, "日期")

            # 获取内容 - 先尝试从属性字段读取，如果为空则读取页面block内容
            content_text = get_property_value(properties, "内容")

            if content_text:
                # 如果内容字段有值，直接使用并转换为HTML段落
                content_html = f"<p>{content_text}</p>"
            else:
                # 否则尝试读取页面block内容
                content_blocks = get_page_content(note_page["id"])
                content_html = ""
                for block in content_blocks:
                    if block["type"] == "paragraph":
                        text = rich_text_to_html(block["paragraph"]["rich_text"])
                        content_html += f"<p>{text}</p>"

            note = {
                "title": get_property_value(properties, "标题"),
                "date": date,
                "type": get_property_value(properties, "类型"),
                "content": content_html or "暂无内容",
                "equipment": get_property_value(properties, "冲煮器具"),
                "tags": get_property_value(properties, "标签"),
            }

            notes.append(note)
            print(f"  ✅ 处理日记: {note['title']}")

        except Exception as e:
            print(f"  ❌ 处理日记失败: {e}")
            import traceback

            traceback.print_exc()
            return False

    return update_coffee_notes_html(notes)


def get_equipment_count():
    """从HTML文件中统计器具数量"""
    try:
        with open("coffee-equipment.html", "r", encoding="utf-8") as f:
            content = f.read()
        # 统计 class="equipment-card..." 的出现次数
        return content.count('class="equipment-card')
    except Exception as e:
        print(f"⚠️ 统计器具数量失败: {e}")
        return 0


def get_coffee_stats():
    """获取咖啡模块统计数据"""
    try:
        beans_count = len(query_coffee_beans())
    except:
        beans_count = 0

    try:
        cafes_count = len(query_cafe_visits())
    except:
        cafes_count = 0

    try:
        notes_count = len(query_brewing_notes())
    except:
        notes_count = 0

    return {
        "equipment": get_equipment_count(),
        "beans": beans_count,
        "cafes": cafes_count,
        "notes": notes_count,
    }


def get_latest_beans_data(limit=2):
    """获取最新N款豆子的数据"""
    try:
        beans_data = query_coffee_beans()[:limit]
        beans = []
        for bean_page in beans_data:
            properties = bean_page["properties"]
            bean = {
                "name": get_property_value(properties, "豆子名称"),
                "origin": get_property_value(properties, "产地"),
                "roast": get_property_value(properties, "烘焙度"),
            }
            beans.append(bean)
        return beans
    except Exception as e:
        print(f"  ⚠️ 获取豆子预览失败: {e}")
        return []


def get_latest_notes_data(limit=3):
    """获取最新N条日记的数据"""
    try:
        notes_data = query_brewing_notes()[:limit]
        notes = []
        for note_page in notes_data:
            properties = note_page["properties"]

            date_str = get_property_value(properties, "日期")
            formatted_date = ""
            if date_str and isinstance(date_str, str):
                try:
                    date_obj = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                    formatted_date = date_obj.strftime("%m月%d日")
                except:
                    formatted_date = date_str[:10] if len(date_str) >= 10 else date_str

            note = {
                "title": get_property_value(properties, "标题"),
                "date": formatted_date,
                "type": get_property_value(properties, "类型"),
            }
            notes.append(note)
        return notes
    except Exception as e:
        print(f"  ⚠️ 获取日记预览失败: {e}")
        return []


def get_city_distribution():
    """获取探店城市分布"""
    try:
        shops_data = query_cafe_visits()
        cities = {}
        for shop_page in shops_data:
            properties = shop_page["properties"]
            city = get_property_value(properties, "城市")
            if city:
                cities[city] = cities.get(city, 0) + 1
        return cities
    except Exception as e:
        print(f"  ⚠️ 获取城市分布失败: {e}")
        return {}


def generate_beans_preview_html(beans):
    """生成豆子预览HTML"""
    if not beans:
        return (
            '<p class="text-sm text-coffee-medium font-serif italic">暂无豆子记录</p>'
        )

    html = ""
    for bean in beans:
        html += f"""<div class="bean-preview">
                        <div class="bean-preview-name">{bean["name"]}</div>
                        <div class="bean-preview-meta">{bean["origin"]} · {bean["roast"]}</div>
                    </div>
"""
    return html


def generate_notes_preview_html(notes):
    """生成日记预览HTML"""
    if not notes:
        return (
            '<p class="text-sm text-coffee-medium font-serif italic">暂无冲煮日记</p>'
        )

    html = ""
    for note in notes:
        type_icon = (
            "☕"
            if note["type"] == "冲煮记录"
            else ("🔬" if note["type"] == "实验" else "💭")
        )
        html += f"""<div class="note-preview">
                        <div class="note-preview-title">{type_icon} {note["title"]}</div>
                        <div class="note-preview-date">{note["date"]}</div>
                    </div>
"""
    return html


def generate_cities_preview_html(cities):
    """生成城市标签HTML"""
    if not cities:
        return (
            '<p class="text-sm text-coffee-medium font-serif italic">暂无探店记录</p>'
        )

    html = '<div class="city-tags">'
    for city, count in sorted(cities.items(), key=lambda x: x[1], reverse=True):
        html += f"""<span class="city-tag">{city}<span class="city-tag-count">{count}</span></span>
"""
    html += "</div>"
    return html


def update_coffee_html():
    from site_builder import render_coffee
    commit_outputs({'coffee.html': render_coffee(Path.cwd())}, Path.cwd())
    return True


def sync_all():
    """Stage all APIs and generated files; publish only after every module succeeds."""
    if not NOTION_TOKEN or not DATABASE_ID:
        raise RuntimeError('Configure NOTION_TOKEN and NOTION_DATABASE_ID before syncing')
    original_cwd = Path.cwd()
    with tempfile.TemporaryDirectory(prefix='notion-build-') as folder:
        staging = Path(folder)
        for source in original_cwd.glob('*.html'):
            shutil.copy2(source, staging / source.name)
        shutil.copytree(original_cwd / 'data', staging / 'data')
        try:
            os.chdir(staging)
            for task in (main, sync_coffee_beans, sync_cafe_visits, sync_brewing_notes, update_coffee_html):
                if task() is not True:
                    raise RuntimeError(f'{task.__name__} failed; keeping the published site')
            outputs = {p.name: p.read_text() for p in staging.glob('*.html')}
            outputs['data/articles.json'] = (staging / 'data/articles.json').read_text()
        finally:
            os.chdir(original_cwd)
        commit_outputs(outputs, original_cwd)


if __name__ == '__main__':
    sync_all()
