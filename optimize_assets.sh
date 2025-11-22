#!/bin/bash
# 资源优化脚本：压缩CSS和JS文件

echo "🚀 开始优化资源..."

# 检查是否安装了必要的工具
command -v python3 >/dev/null 2>&1 || { echo "❌ 需要 Python 3"; exit 1; }

# 创建优化后的目录
mkdir -p dist/styles dist/scripts

echo "📦 压缩CSS文件..."
python3 << 'EOF'
import re
import glob

def minify_css(css):
    # 移除注释
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    # 移除多余空白
    css = re.sub(r'\s+', ' ', css)
    # 移除属性周围的空格
    css = re.sub(r'\s*([{}:;,])\s*', r'\1', css)
    # 移除最后一个分号
    css = re.sub(r';\}', '}', css)
    return css.strip()

for file in glob.glob('styles/*.css'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    minified = minify_css(content)
    output = file.replace('styles/', 'dist/styles/')

    with open(output, 'w', encoding='utf-8') as f:
        f.write(minified)

    original_size = len(content)
    minified_size = len(minified)
    savings = (1 - minified_size / original_size) * 100

    print(f"✅ {file} -> {output} (减少 {savings:.1f}%)")

EOF

echo "📦 压缩JS文件..."
python3 << 'EOF'
import re
import glob

def minify_js(js):
    # 移除单行注释（保留URL中的//）
    js = re.sub(r'(?<!:)//.*$', '', js, flags=re.MULTILINE)
    # 移除多行注释
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    # 移除多余空白
    js = re.sub(r'\s+', ' ', js)
    # 移除不必要的空格
    js = re.sub(r'\s*([{}();,:])\s*', r'\1', js)
    return js.strip()

for file in glob.glob('scripts/*.js'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    minified = minify_js(content)
    output = file.replace('scripts/', 'dist/scripts/')

    with open(output, 'w', encoding='utf-8') as f:
        f.write(minified)

    original_size = len(content)
    minified_size = len(minified)
    savings = (1 - minified_size / original_size) * 100

    print(f"✅ {file} -> {output} (减少 {savings:.1f}%)")

EOF

echo "🎉 资源优化完成！"
echo "📁 优化后的文件保存在 dist/ 目录"
