#!/usr/bin/env python3
"""
生成 sitemap.xml 和 robots.txt
"""

import os
from datetime import datetime
import glob

BASE_URL = "https://kev1nl33.github.io/personal-blog"


def generate_sitemap():
    """生成 sitemap.xml"""
    # 获取所有 HTML 文件
    html_files = glob.glob("*.html")

    # 排除不需要的文件
    excluded_files = {"books-preview.html", "test.html", "article1.html", "books.html"}
    html_files = [f for f in html_files if f not in excluded_files and '-backup-' not in f]

    # 页面优先级设置
    priority_map = {
        "index.html": ("1.0", "daily"),
        "blog.html": ("0.9", "daily"),
        "about.html": ("0.8", "monthly"),
        "weekly.html": ("0.8", "weekly"),
    }

    # 获取文件修改时间
    def get_lastmod(filepath):
        timestamp = os.path.getmtime(filepath)
        return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")

    # 生成 sitemap XML
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    # 先添加主要页面
    main_pages = ["index.html", "blog.html", "about.html", "weekly.html"]
    for page in main_pages:
        if page in html_files:
            priority, changefreq = priority_map.get(page, ("0.5", "monthly"))
            lastmod = get_lastmod(page)
            url = f"{BASE_URL}/" if page == "index.html" else f"{BASE_URL}/{page}"

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
        url = f"{BASE_URL}/{html_file}"

        # 文章页面默认优先级
        priority = "0.7"
        changefreq = "monthly"

        sitemap.append("  <url>")
        sitemap.append(f"    <loc>{url}</loc>")
        sitemap.append(f"    <lastmod>{lastmod}</lastmod>")
        sitemap.append(f"    <changefreq>{changefreq}</changefreq>")
        sitemap.append(f"    <priority>{priority}</priority>")
        sitemap.append("  </url>")

    sitemap.append("</urlset>")

    # 写入文件
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap))

    print(f"✅ sitemap.xml 已生成，包含 {len(html_files) + len(main_pages)} 个页面")


def generate_robots():
    """生成 robots.txt"""
    robots_content = """# robots.txt for 计划李的个人博客

User-agent: *
Allow: /

# Sitemap
Sitemap: https://kev1nl33.github.io/personal-blog/sitemap.xml

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
