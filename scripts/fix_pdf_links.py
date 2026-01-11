#!/usr/bin/env python3
"""
修复认知武器页面中的 PDF 链接路径
将错误的 '108种认知武器/' 路径替换为正确的 'chinese-originals/'
"""

import os
import re
import glob


def fix_pdf_links():
    # 获取所有 HTML 文件
    html_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "projects", "108 Cognitive Weapons"
    )
    html_files = glob.glob(os.path.join(html_dir, "*.html"))

    fixed_count = 0

    for html_file in html_files:
        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()

        # 查找并替换错误的 PDF 链接路径
        # 从 href="108种认知武器/XXX.pdf" 改为 href="chinese-originals/XXX.pdf"
        new_content = re.sub(
            r'href="108种认知武器/', 'href="chinese-originals/', content
        )

        if new_content != content:
            with open(html_file, "w", encoding="utf-8") as f:
                f.write(new_content)
            fixed_count += 1
            print(f"✅ 已修复: {os.path.basename(html_file)}")

    print(f"\n🎉 共修复 {fixed_count} 个文件")


if __name__ == "__main__":
    fix_pdf_links()
