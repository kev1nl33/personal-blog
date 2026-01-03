# AGENTS.md - 代理代码开发指南

本文档指导 AI 代理在个人博客项目中高效工作。

## 构建与同步命令

### 核心命令
```bash
# 同步所有 Notion 内容（文章、书单、咖啡数据）
python sync_notion.py

# 本地开发服务器
python -m http.server 8000

# 生成搜索索引
python generate_search_index.py

# 生成站点地图
python generate_sitemap.py
```

### 单个功能模块同步
```bash
# 仅同步博客文章
python -c "from sync_notion import main; main()"

# 仅同步咖啡豆档案
python -c "from sync_notion import sync_coffee_beans; sync_coffee_beans()"

# 仅同步咖啡馆探店
python -c "from sync_notion import sync_cafe_visits; sync_cafe_visits()"

# 仅同步冲煮日记
python -c "from sync_notion import sync_brewing_notes; sync_brewing_notes()"
```

## Python 代码规范

### 导入顺序
```python
# 1. 标准库
import os
import re
from datetime import datetime

# 2. 第三方库
import requests

# 3. 本地模块（如有）
# from .utils import helper
```

### 命名约定
- **函数**: `snake_case` (如 `query_database`)
- **变量**: `snake_case` (如 `article_data`)
- **常量**: `UPPER_SNAKE_CASE` (如 `NOTION_TOKEN`)
- **类**: `PascalCase` (如 `ArticleParser`)

### 错误处理
```python
try:
    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()['results']
except requests.exceptions.RequestException as e:
    print(f"❌ API 请求失败: {e}")
    return []
except Exception as e:
    print(f"❌ 处理失败: {e}")
    import traceback
    traceback.print_exc()
    return []
```

### 字符串格式化
使用 f-string（Python 3.6+）：
```python
# ✓ 推荐
filename = f'{url}.html'
message = f"处理文章: {title}"

# ❌ 避免
filename = '{}.html'.format(url)
```

### 类型提示（可选但推荐）
```python
def get_page_content(page_id: str) -> list:
    """获取页面内容"""
    url = f'https://api.notion.com/v1/blocks/{page_id}/children'
    # ...
```

## HTML 模板规范

### 基本结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - 计划李</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="{description}">
    <meta name="keywords" content="{keywords}">
    <!-- ... -->
</head>
<body>
    <!-- 导航栏 -->
    <nav class="nav">
        <!-- ... -->
    </nav>

    <!-- 主内容 -->
    <main>
        <!-- ... -->
    </main>

    <!-- 页脚 -->
    <footer class="footer">
        <!-- ... -->
    </footer>

    <!-- JavaScript -->
    <script src="scripts/main.js"></script>
</body>
</html>
```

### 语义化标签
- 使用 `<article>` 包装单篇文章
- 使用 `<section>` 划分内容区块
- 使用 `<nav>` 表示导航
- 使用 `<footer>` 表示页脚
- 图片必须包含 `alt` 属性

### SEO 最佳实践
```html
<!-- 必需的 Meta 标签 -->
<meta name="description" content="简洁描述，150-160字符">
<meta name="keywords" content="关键词1,关键词2,关键词3">
<link rel="canonical" href="完整URL">

<!-- Open Graph 标签（社交媒体分享） -->
<meta property="og:type" content="article">
<meta property="og:title" content="文章标题">
<meta property="og:description" content="文章描述">
<meta property="og:url" content="完整URL">
```

## CSS 样式规范

### Neo-Brutalism 设计系统
```css
:root {
    /* 核心颜色 */
    --brand-black: #0a0a0a;
    --brand-white: #f4f4f0;
    --brand-accent: #FF4D00;
    --brand-blue: #0047AB;
    --brand-green: #059669;

    /* 硬边框和阴影 */
    --border-width: 1px;
    --shadow-small: 4px 4px 0 var(--brand-black);
    --shadow-medium: 8px 8px 0 var(--brand-black);

    /* 过渡 */
    --transition: all 0.3s ease;
}
```

### Bento Card 组件样式
```css
.bento-card {
    background: white;
    border: 1px solid var(--brand-black);
    padding: 1.5rem;
    transition: var(--transition);
}

.bento-card:hover {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-small);
}
```

### 响应式断点
```css
/* 移动端优先设计 */
@media (min-width: 640px)  { /* sm: 小屏 */ }
@media (min-width: 768px)  { /* md: 平板 */ }
@media (min-width: 1024px) { /* lg: 桌面 */ }
@media (min-width: 1280px) { /* xl: 大屏 */ }
```

### 字体使用
```css
/* 正文: Noto Sans SC */
body {
    font-family: 'Noto Sans SC', 'Inter', sans-serif;
}

/* 引用: Noto Serif SC */
.article-content {
    font-family: 'Noto Serif SC', serif;
}

/* 代码: JetBrains Mono */
code {
    font-family: 'JetBrains Mono', monospace;
}
```

## JavaScript 规范

### 事件监听
```javascript
// ✓ 推荐：DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // 初始化代码
});

// 简单脚本也可直接在底部执行
```

### 函数命名
```javascript
// 动作函数
function applyFilters() { }
function updateProgressBar() { }

// 事件处理器
function handleSearchInput(event) { }

// 工具函数
function formatDate(dateStr) { }
```

### 错误处理
```javascript
try {
    // 可能出错的代码
} catch (error) {
    console.error('操作失败:', error);
    // 优雅降级
}
```

### DOM 操作
```javascript
// 查询元素
const element = document.querySelector('.selector');
const elements = document.querySelectorAll('.selector');

// 修改类名
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('expanded');

// 修改属性
element.setAttribute('src', imageUrl);
element.dataset.value = 'some-value';
```

## 文件命名约定

### HTML 文件
- `kebab-case.html` (如 `article-title.html`)
- 首页：`index.html`
- 列表页：`blog.html`

### CSS 文件
- `kebab-case.css` (如 `main.css`, `article.css`)
- 放在 `styles/` 目录

### JavaScript 文件
- `kebab-case.js` (如 `main.js`, `search.js`)
- 放在 `scripts/` 目录

### Python 文件
- `snake_case.py` (如 `sync_notion.py`)
- 放在项目根目录

## Notion 数据库同步注意事项

⚠️ **重要约束**
1. 不要直接编辑生成的 HTML 文件（会被覆盖）
2. 修改内容应该在 Notion 中进行
3. URL 一旦发布不可修改（会破坏外部链接）
4. 使用环境变量存储敏感信息

### 模式匹配
使用正则表达式更新 HTML 模板：
```python
# 查找并替换内容区域
pattern = r'(<div class="blog-grid" id="blogGrid">)(.*?)(</div>)'
replacement = r'\1\n' + new_content + r'\3'
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
```

## 测试与验证

### 本地测试流程
1. 运行 `python sync_notion.py` 同步内容
2. 运行 `python -m http.server 8000` 启动本地服务器
3. 访问 `http://localhost:8000` 检查显示效果
4. 测试响应式布局（调整浏览器窗口大小）

### 验证清单
- [ ] 文章显示正确
- [ ] 标签/分类筛选正常
- [ ] 搜索功能正常
- [ ] 响应式布局正确（移动端/平板/桌面）
- [ ] 图片加载正常
- [ ] 导航链接有效
- [ ] SEO meta 标签完整

## GitHub Actions 工作流

### 自动同步
- **触发时间**: 每日 UTC 00:00（北京时间 08:00）
- **手动触发**: GitHub → Actions → "Sync from Notion" → Run workflow

### 本地测试 Actions
```bash
# 提交更改后推送触发自动部署
git add .
git commit -m "Update content"
git push origin main
```

## 关键设计原则

1. **Neo-Brutalism**: 硬边框、无圆角、极端对比度
2. **信息优先**: 清晰的层级结构，无多余装饰
3. **性能优先**: 静态 HTML、懒加载图片、CDN 加速
4. **SEO 友好**: 语义化 HTML、完整的 Meta 标签
5. **响应式设计**: 移动端优先，适配所有设备

## 常见问题

**Q: 如何调试同步脚本？**
A: 修改 `sync_notion.py` 后，本地运行 `python sync_notion.py` 查看输出。

**Q: 如何添加新的 CSS 样式？**
A: 在 `styles/main.css` 或对应的 CSS 文件中添加，遵循 Neo-Brutalism 规范。

**Q: 如何修改导航栏？**
A: 编辑 `index.html`, `blog.html` 等页面中的 `<nav>` 部分，或统一在模板中修改。

**Q: 如何优化图片？**
A: 运行 `node scripts/image-optimizer.js` 或手动使用工具压缩图片。

---

**维护者**: Kevin
**最后更新**: 2025-01-03
**项目主页**: https://github.com/kev1nl33/personal-blog
