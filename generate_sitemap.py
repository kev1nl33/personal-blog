#!/usr/bin/env python3
"""
生成 sitemap.xml 和 robots.txt
"""

import glob
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", SITEMAP_NS)

BASE_URL = "https://aikevin.dpdns.org"


def generate_sitemap():
    """重建根页面并合并保留现有 projects 条目。"""
    # 必须先解析旧文件；解析失败时停止，避免覆盖尚未保留的条目。
    project_urls = []
    if Path("sitemap.xml").exists():
        existing = ET.parse("sitemap.xml").getroot()
        for entry in existing.findall(f"{{{SITEMAP_NS}}}url"):
            loc = entry.findtext(f"{{{SITEMAP_NS}}}loc", default="")
            if urlsplit(loc).path.startswith("/projects/"):
                project_urls.append(entry)

    # 获取所有 HTML 文件
    html_files = glob.glob("*.html") + glob.glob("series/*.html")

    # 排除不需要的文件
    excluded_files = {"404.html", "books-preview.html", "test.html", "article1.html", "books.html",
                      "coffee-beans.html", "coffee-notes.html", "coffee-shops.html", "coffee-equipment.html"}
    html_files = [f for f in html_files if f not in excluded_files and '-backup-' not in f]

    # 页面优先级设置
    priority_map = {
        "index.html": ("1.0", "daily"),
        "blog.html": ("0.9", "daily"),
        "about.html": ("0.8", "monthly"),
        "now.html": ("0.8", "monthly"),
        "weekly.html": ("0.8", "weekly"),
    }

    # 使用 Git 中的真实修改日期，避免检出或复制文件改变 lastmod
    def get_lastmod(filepath):
        date = subprocess.check_output(
            ["git", "log", "-1", "--format=%cs", "--", filepath], text=True
        ).strip()
        if not date:
            raise ValueError(f"{filepath} 尚无 Git 提交记录，无法确定 lastmod")
        return date

    page_count = len(html_files)

    # 生成 sitemap XML
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    # 先添加主要页面
    main_pages = ["index.html", "blog.html", "about.html", "now.html", "weekly.html"]
    for page in main_pages:
        if page in html_files:
            priority, changefreq = priority_map.get(page, ("0.5", "monthly"))
            lastmod = get_lastmod(page)
            url = f"{BASE_URL}/" if page == "index.html" else f"{BASE_URL}/{page[:-5]}"
            if page == "now.html":
                url = f"{BASE_URL}/now.html"

            sitemap.append("  <url>")
            sitemap.append(f"    <loc>{url}</loc>")
            sitemap.append(f"    <lastmod>{lastmod}</lastmod>")
            sitemap.append(f"    <changefreq>{changefreq}</changefreq>")
            sitemap.append(f"    <priority>{priority}</priority>")
            sitemap.append("  </url>")
            html_files.remove(page)

    # 添加其他文章页面
    for html_file in sorted(html_files):
        lastmod = get_lastmod(html_file)
        url = f"{BASE_URL}/{html_file[:-5]}"

        # 文章页面默认优先级
        priority = "0.7"
        changefreq = "monthly"

        sitemap.append("  <url>")
        sitemap.append(f"    <loc>{url}</loc>")
        sitemap.append(f"    <lastmod>{lastmod}</lastmod>")
        sitemap.append(f"    <changefreq>{changefreq}</changefreq>")
        sitemap.append(f"    <priority>{priority}</priority>")
        sitemap.append("  </url>")

    # 保留 projects 的原始字段值与顺序，不推断其源文件或修改日期。
    for entry in project_urls:
        sitemap.append("  " + ET.tostring(entry, encoding="unicode").strip())
    sitemap.append("</urlset>")

    # 写入文件
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap))

    print(f"✅ sitemap.xml 已生成，包含 {page_count + len(project_urls)} 个页面（保留 {len(project_urls)} 个 projects 条目）")


def generate_robots():
    """生成 robots.txt"""
    robots_content = """# robots.txt for 计划李的个人博客

User-agent: *
Allow: /

# Sitemap
Sitemap: https://aikevin.dpdns.org/sitemap.xml

# 禁止访问的路径（如果有）
Disallow: /scripts/
Disallow: /*.json$
"""

    with open("robots.txt", "w", encoding="utf-8") as f:
        f.write(robots_content)

    print("✅ robots.txt 已生成")


if __name__ == "__main__":
    print("🚀 开始生成 SEO 文件...")
    generate_sitemap()
    generate_robots()
    print("🎉 完成！")
