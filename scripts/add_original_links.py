#!/usr/bin/env python3
"""
为108个认知武器HTML文件添加"阅读原文"链接
"""

import os
import re
import glob

def find_pdf_for_model(model_num, pdf_dir):
    """为指定的模型编号查找对应的PDF文件"""

    # 尝试多种匹配模式（考虑空格变化）
    patterns = [
        f"*【模型{model_num}】*.pdf",      # 标准格式
        f"*【模型{model_num} 】*.pdf",     # 模型后有空格
        f"*【 模型{model_num}】*.pdf",     # 模型前有空格
        f"*【 模型{model_num} 】*.pdf",    # 模型前后都有空格
    ]

    for pattern_str in patterns:
        pattern = os.path.join(pdf_dir, pattern_str)
        matches = glob.glob(pattern)
        if matches:
            return os.path.basename(matches[0])

    return None


def add_original_link(html_file_path, pdf_dir):
    """为单个HTML文件添加阅读原文链接"""

    # 从文件名提取编号 (例如: 001_The Learning Pyramid.html -> 001)
    filename = os.path.basename(html_file_path)
    match = re.match(r'(\d{3})_', filename)

    if not match:
        print(f"⚠️  跳过 {filename} - 无法提取编号")
        return False

    model_num = match.group(1)  # 例如: "001"

    # 查找对应的PDF文件
    pdf_filename = find_pdf_for_model(model_num, pdf_dir)

    if not pdf_filename:
        print(f"⚠️  {filename} - 未找到模型{model_num}对应的PDF文件")
        return False

    # 构建PDF相对路径（从HTML文件角度）
    pdf_relative_path = f"108种认知武器/{pdf_filename}"

    # 读取HTML文件
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否已经添加了链接（避免重复添加）
    if '<!-- ORIGINAL LINK SECTION -->' in content:
        print(f"✓ {filename} - 已存在原文链接，跳过")
        return False

    # 创建"阅读原文"链接的HTML（适配现有的深色主题设计）
    original_link_html = f'''
        <!-- ORIGINAL LINK SECTION -->
        <div class="max-w-7xl mx-auto mt-16 mb-12 px-6 reveal">
            <div class="bento-card p-8 bg-gradient-to-r from-brand-blue to-brand-accent text-white" style="background: linear-gradient(135deg, #0047AB 0%, #FF4D00 100%);">
                <div class="flex flex-col md:flex-row items-center justify-between">
                    <div class="mb-4 md:mb-0">
                        <div class="flex items-center mb-2">
                            <i class="ri-file-text-line text-2xl mr-3"></i>
                            <h3 class="text-xl font-bold">中文原文 / Original Chinese Version</h3>
                        </div>
                        <p class="text-sm opacity-90 font-serif">阅读完整的中文版认知武器模型 {model_num}</p>
                    </div>
                    <a href="{pdf_relative_path}"
                       target="_blank"
                       class="inline-flex items-center px-6 py-3 bg-white text-brand-black font-bold rounded-lg hover:bg-brand-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                       style="text-decoration: none;">
                        <i class="ri-file-pdf-line text-xl mr-2"></i>
                        阅读原文 PDF
                        <i class="ri-arrow-right-line ml-2"></i>
                    </a>
                </div>
            </div>
        </div>

'''

    # 在footer之前插入链接
    # 查找footer标签
    footer_pattern = r'(\s*<footer[^>]*>)'

    if re.search(footer_pattern, content):
        # 在footer之前插入
        updated_content = re.sub(
            footer_pattern,
            original_link_html + r'\1',
            content,
            count=1  # 只替换第一个匹配
        )

        # 写回文件
        with open(html_file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        print(f"✓ {filename} - 成功添加原文链接 (模型{model_num} -> {pdf_filename})")
        return True
    else:
        print(f"⚠️  {filename} - 未找到footer标签，跳过")
        return False


def main():
    """批量处理所有HTML文件"""

    # 设置路径
    base_dir = "projects/108 Cognitive Weapons"
    pdf_dir = os.path.join(base_dir, "108种认知武器")
    html_pattern = os.path.join(base_dir, "*.html")

    # 检查PDF目录是否存在
    if not os.path.exists(pdf_dir):
        print(f"❌ PDF目录不存在: {pdf_dir}")
        return

    # 获取所有108个HTML文件
    html_files = sorted(glob.glob(html_pattern))

    if not html_files:
        print(f"❌ 未找到HTML文件: {html_pattern}")
        return

    print(f"\n📚 找到 {len(html_files)} 个HTML文件")
    print(f"📁 PDF目录: {pdf_dir}\n")
    print("=" * 70)

    success_count = 0
    skip_count = 0
    error_count = 0

    for html_file in html_files:
        try:
            if add_original_link(html_file, pdf_dir):
                success_count += 1
            else:
                skip_count += 1
        except Exception as e:
            print(f"❌ {os.path.basename(html_file)} - 处理出错: {str(e)}")
            error_count += 1

    print("=" * 70)
    print(f"\n✅ 完成！")
    print(f"   - ✓ 成功添加: {success_count} 个文件")
    print(f"   - ⊘ 跳过: {skip_count} 个文件")
    if error_count > 0:
        print(f"   - ✗ 错误: {error_count} 个文件")
    print(f"   - 📊 总计: {len(html_files)} 个文件\n")


if __name__ == "__main__":
    main()
