#!/usr/bin/env python3
"""
修复HTML中的PDF链接，添加URL编码以处理特殊字符
"""

import os
import re
import glob
import urllib.parse

def fix_pdf_link_in_html(html_file_path):
    """修复单个HTML文件中的PDF链接编码"""

    filename = os.path.basename(html_file_path)

    # 读取HTML文件
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找PDF链接模式: href="108种认知武器/文件名.pdf"
    pattern = r'href="(108种认知武器/([^"]+\.pdf))"'

    def encode_link(match):
        full_link = match.group(1)  # 108种认知武器/xxx.pdf
        pdf_filename = match.group(2)  # xxx.pdf

        # URL编码PDF文件名（保留/和.）
        encoded_filename = urllib.parse.quote(pdf_filename, safe='')
        encoded_full_link = f"108种认知武器/{encoded_filename}"

        # 返回编码后的href
        return f'href="{encoded_full_link}"'

    # 检查是否需要修改
    original_content = content
    updated_content = re.sub(pattern, encode_link, content)

    if updated_content != original_content:
        # 写回文件
        with open(html_file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"✓ {filename} - 已更新PDF链接编码")
        return True
    else:
        print(f"  {filename} - 无需更新")
        return False


def main():
    """批量处理所有HTML文件"""

    # 获取所有108个HTML文件
    html_pattern = "projects/108 Cognitive Weapons/*.html"
    html_files = sorted(glob.glob(html_pattern))

    if not html_files:
        print(f"❌ 未找到HTML文件: {html_pattern}")
        return

    print(f"\n📚 找到 {len(html_files)} 个HTML文件\n")
    print("=" * 70)

    updated_count = 0

    for html_file in html_files:
        try:
            if fix_pdf_link_in_html(html_file):
                updated_count += 1
        except Exception as e:
            print(f"❌ {os.path.basename(html_file)} - 处理出错: {str(e)}")

    print("=" * 70)
    print(f"\n✅ 完成！")
    print(f"   - ✓ 已更新: {updated_count} 个文件")
    print(f"   - 总计: {len(html_files)} 个文件\n")

    if updated_count > 0:
        print("📝 提示：PDF链接现已包含URL编码，可以正确处理文件名中的特殊字符。\n")


if __name__ == "__main__":
    main()
