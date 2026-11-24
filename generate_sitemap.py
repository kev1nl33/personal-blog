#!/usr/bin/env python3
"""
生成 sitemap.xml 和 robots.txt（支持 --check 只读校验，未提交新文件自动回退发布日期）
"""

import argparse
from datetime import date
import glob
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", SITEMAP_NS)

BASE_URL = "https://aikevin.dpdns.org"
ROBOTS_CONTENT = """# robots.txt for AIKev1n 个人博客

User-agent: *
Allow: /

# Sitemap
Sitemap: https://aikevin.dpdns.org/sitemap.xml

# 禁止访问的路径
Disallow: /scripts/
Disallow: /*.json$
"""


def _fallback_lastmod(filepath: str) -> str:
    """新文件尚未 git commit 时，优先读取 article:published_time，其次当天日期。"""
    try:
        text = Path(filepath).read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return date.today().isoformat()
    match = re.search(r'property="article:published_time"\s+content="(\d{4}-\d{2}-\d{2})"', text)
    if not match:
        match = re.search(r'content="(\d{4}-\d{2}-\d{2})"\s+property="article:published_time"', text)
    if match:
        return match.group(1)
    return date.today().isoformat()


def build_sitemap_xml() -> tuple[str, int, int]:
    """构建 sitemap.xml 文本，合并保留现有 /projects/ 条目。"""
    # 必须先解析旧文件；解析失败时停止，避免覆盖尚未保留的条目。
    project_urls = []
    if Path("sitemap.xml").exists():
        existing = ET.parse("sitemap.xml").getroot()
        for entry in existing.findall(f"{{{SITEMAP_NS}}}url"):
            loc = entry.findtext(f"{{{SITEMAP_NS}}}loc", default="")
            if urlsplit(loc).path.startswith("/projects/"):
                project_urls.append(entry)

    html_files = glob.glob("*.html") + glob.glob("series/*.html")
    excluded_files = {
        "404.html", "books-preview.html", "test.html", "article1.html", "books.html",
        "coffee-beans.html", "coffee-notes.html", "coffee-shops.html", "coffee-equipment.html",
    }
    html_files = [f for f in html_files if f not in excluded_files and "-backup-" not in f]

    priority_map = {
        "index.html": ("1.0", "daily"),
        "blog.html": ("0.9", "daily"),
        "about.html": ("0.8", "monthly"),
        "now.html": ("0.8", "monthly"),
        "weekly.html": ("0.8", "weekly"),
    }

    def get_lastmod(filepath: str) -> str:
        try:
            recorded = subprocess.check_output(
                ["git", "log", "-1", "--format=%cs", "--", filepath],
                text=True,
                stderr=subprocess.DEVNULL,
            ).strip()
        except (subprocess.CalledProcessError, FileNotFoundError):
            recorded = ""
        return recorded or _fallback_lastmod(filepath)

    page_count = len(html_files)
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    main_pages = ["index.html", "blog.html", "about.html", "now.html", "weekly.html"]
    for page in main_pages:
        if page in html_files:
            priority, changefreq = priority_map.get(page, ("0.5", "monthly"))
            lastmod = get_lastmod(page)
            url = f"{BASE_URL}/" if page == "index.html" else f"{BASE_URL}/{page[:-5]}"

            sitemap.append("  <url>")
            sitemap.append(f"    <loc>{url}</loc>")
            sitemap.append(f"    <lastmod>{lastmod}</lastmod>")
            sitemap.append(f"    <changefreq>{changefreq}</changefreq>")
            sitemap.append(f"    <priority>{priority}</priority>")
            sitemap.append("  </url>")
            html_files.remove(page)

    for html_file in sorted(html_files):
        lastmod = get_lastmod(html_file)
        url = f"{BASE_URL}/{html_file[:-5]}"
        sitemap.append("  <url>")
        sitemap.append(f"    <loc>{url}</loc>")
        sitemap.append(f"    <lastmod>{lastmod}</lastmod>")
        sitemap.append("    <changefreq>monthly</changefreq>")
        sitemap.append("    <priority>0.7</priority>")
        sitemap.append("  </url>")

    # 保留 projects 的原始字段值与顺序，不推断其源文件或修改日期。
    for entry in project_urls:
        sitemap.append("  " + ET.tostring(entry, encoding="unicode").strip())
    sitemap.append("</urlset>")

    return "\n".join(sitemap), page_count, len(project_urls)


def generate_sitemap():
    xml_text, page_count, project_count = build_sitemap_xml()
    Path("sitemap.xml").write_text(xml_text, encoding="utf-8")
    print(f"✅ sitemap.xml 已生成，包含 {page_count + project_count} 个页面（保留 {project_count} 个 projects 条目）")


def generate_robots():
    Path("robots.txt").write_text(ROBOTS_CONTENT, encoding="utf-8")
    print("✅ robots.txt 已生成")


def main() -> int:
    parser = argparse.ArgumentParser(description="生成或校验 sitemap.xml 和 robots.txt")
    parser.add_argument("--check", action="store_true", help="只检查 sitemap.xml 是否最新，不写入")
    args = parser.parse_args()

    if args.check:
        expected, page_count, project_count = build_sitemap_xml()
        current = Path("sitemap.xml").read_text(encoding="utf-8") if Path("sitemap.xml").exists() else ""
        if current.strip() != expected.strip():
            print("sitemap.xml 已过期，请运行 python3 generate_sitemap.py")
            return 1
        print(f"sitemap.xml 已是最新，共 {page_count + project_count} 个页面")
        return 0

    print("🚀 开始生成 SEO 文件...")
    generate_sitemap()
    generate_robots()
    print("🎉 完成！")
    return 0


if __name__ == "__main__":
    sys.exit(main())
