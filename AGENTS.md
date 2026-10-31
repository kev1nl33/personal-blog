# AGENTS.md - 代理代码开发指南

本文档指导 AI 代理在个人博客项目中高效工作。

## 本地开发命令

直接编辑根目录的 HTML 页面，以及 styles/ 和 scripts/ 中的源文件。已发布 URL 保持不变。

```bash
python3 -m http.server 8000
npm run build
npm test
python3 validate_site.py
python3 generate_search_index.py
python3 generate_sitemap.py
```

默认构建只编译 CSS，不重新生成 HTML。templates/ 和 data/ 保留为既有参考资料，当前 HTML 是维护来源。

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
- **常量**: `UPPER_SNAKE_CASE` (如 `BASE_URL`)
- **类**: `PascalCase` (如 `ArticleParser`)

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
    # 从本地页面读取内容
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

- 根目录页面的 canonical 与 sitemap 使用 `https://aikevin.dpdns.org` 的无 `.html` 地址，首页为 `/`；咖啡页元数据独立维护。近况页统一使用 `https://aikevin.dpdns.org/now`，站内近况入口使用 `/now`，`now.html` 保留为源文件及兼容访问地址。
- 新增「最近在做」页沿用 about 页的公共导航、页脚和阅读变量；入口放在 about 的「现在」节点及 index/about/blog/now 的页脚，不扩充全站主导航。
- sitemap 的根页面收录范围沿用 `generate_sitemap.py` 的排除规则，额外排除 `404.html`；根页面 `lastmod` 取对应文件最近一次 Git 提交日期，不使用文件系统时间。脚本会合并保留现有 sitemap 中 `/projects/` 条目及其元数据，不从 projects 目录重建；禁止手工删除这些条目后裸跑脚本指望自动找回。
- 文章的 `meta description` 与 `og:description` 使用该文摘要；移除跨页面重复的通用 `meta keywords`，不再为新页面添加通用关键词。
- 文章 `og:image` 优先使用自己的封面；无封面使用 `https://aikevin.dpdns.org/assets/readme/cover.png`（由既有 `assets/readme/cover.svg` 导出的品牌位图），不再以新加坡旅行照片充当文章默认图。已有游记分享图保留。
- `404.html` 复用公共样式、导航和页脚，资源与站内链接从根路径引用，以支持任意深度的不存在地址；设置 `noindex`，不加入搜索列表或 sitemap。
```html
<!-- 必需的 Meta 标签 -->
<meta name="description" content="简洁描述，150-160字符">
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

### 中文阅读排版

- 中文常规文章正文桌面宽度以 `37em` 为上限，行高 `1.8`；移动端保留现有容器边距。
- 正文段落、列表、引用、图片和标题节奏使用 `styles/main.css` 的 `--reading-*` 变量；文章规则放 `styles/article.css`，游记规则放 `styles/travel-journal.css`。
- 混排间距只使用 `@supports` 下的 `text-autospace` 和 `text-spacing-trim` 渐进增强，不批量改写正文字符。
- 排版规则限定中文常规文章、首页、文章列表、关于页和旅行页面。coffee 页面、英文文章、`memoir-cutout.css` 特殊页面保持独立，不应用新的阅读规则。
- 公共页面支持深色模式。`scripts/theme-init.js` 在样式表之前同步设置 `html[data-theme]`：有 `localStorage.theme` 时用手动选择，否则跟随 `prefers-color-scheme`。系统偏好监听也由 `theme-init.js` 管理，无手动覆盖时实时跟随；存储不可用时仍检测系统，手动选择在当前会话内保持有效。导航栏 `.theme-toggle` 由 `scripts/main.js` 启用，通过 `window.siteTheme` 切换并记住选择，监听 `themechange` 更新按钮状态。颜色走 `styles/main.css` 的语义变量，只在 `[data-theme="dark"]` 下切换；深色时中文文章与旅行照片亮度 `.88`。咖啡角（`coffee*.html`）保持浅色、不显示主题按钮。`projects/108 Cognitive Weapons/*.html` 复用 `theme-init.js`，跟随认知武器索引页（`visual-design.html`）的主题选择与系统偏好，不添加独立主题按钮；其他项目页面保持原有独立样式。新页面接入时，在 `<head>` 最前面加入 `<script src="scripts/theme-init.js?v=theme-1"></script>`（404 用根路径 `/scripts/theme-init.js`），并在 `.search-trigger` 前放入 `.theme-toggle` 按钮。

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
- `styles/cognitive-theme.css`：仅供 `projects/108 Cognitive Weapons/*.html` 使用的深色主题适配；颜色对齐公共站点，不引入公共布局或改变浅色页面。
- `scripts/cognitive-theme.js`：认知武器详情页的 Chart.js 主题适配，复用 `scripts/theme-init.js` 的主题状态与事件，保留图表数据与浅色配置。

### JavaScript 文件
- `kebab-case.js` (如 `main.js`, `search.js`)
- 放在 `scripts/` 目录

### Python 文件
- `snake_case.py` (如 `generate_sitemap.py`)
- 放在项目根目录

## 旅行实拍素材约定

- 旅行照片存 R2 桶 `blog-gallery`（wrangler.toml 绑定 `GALLERY_BUCKET`），key 为仓库路径去掉 `images/` 前缀（如 `travel/japan-2023/osaka-248.jpg`）；页面通过 Pages Function `/media/travel/<目的地>-<年份>/<文件>` 只读引用，不提交图片文件本身。`singapore-2025` 是历史例外：图片保留在 `images/travel/singapore-2025/`，引用走本地相对路径。
- 使用 `singapore-013.jpg` 这样的稳定编号命名，编号对应外部选片清单。
- 仅上传页面使用的压缩图片：长边不超过 1800px、单张小于 400KB，移除 EXIF（含 GPS）；原始照片和验收截图保留在任务素材目录，不进入仓库。
- 新增或替换图片时同步检查页面引用；删除无引用的旅行图片前先确认用途。

### 响应式 WebP 变体

- 每张被页面引用的旅行照片生成两档 WebP：`<文件名>-800.webp` 与 `<文件名>-1600.webp`（质量从 78 逐级下探，仍大于原图时该档不输出、`srcset` 只给 800w）。变体只存在任务暂存目录 `~/cc-tasks/webp/out/<目的地>-<年份>/`，上传到 R2 的 `travel/<目的地>-<年份>/` 下，**不提交进仓库**，也不覆盖原图。
- 生成用 `python3 scripts/make-webp.py`（需要 Pillow）：从 `travel.html`、游记页和 `data/memoir.json` 收集引用，R2 图按公开 URL 下载、新加坡读仓库副本；输出前剥离 EXIF/XMP/ICC 并逐张校验。脚本幂等，状态记录在 `out/.state.json`，`--only` 可只跑抽样。
- 页面用 `<picture><source type="image/webp" srcset="…-800.webp 800w, …-1600.webp 1600w" sizes="…"><img src="原 JPG" …></picture>`，原 JPG 始终作为回退；`width`/`height`/`alt` 保留，只有首图或 hero 用 `fetchpriority="high"`，其余 `loading="lazy"`。灯箱链接继续指向原 JPG。
- 变体与标记必须同批上线：先上传 WebP 再部署 HTML。若变体缺失，`scripts/main.js` 会在加载失败时移除 `<source>` 并回退 JPG；回忆录数据用 `"webp": {"800": …, "1600": …}` 字段，加载失败同样回退 `src`。
- 新加坡照片仍以 `images/travel/singapore-2025/` 为原图来源，WebP 变体暂存到 `out/singapore-2025/`，上传后 key 为 `travel/singapore-2025/…`，页面 WebP 走 `/media/travel/singapore-2025/…`。

## 旅行总览维护

- `travel.html` 的 `#travel-trips` 集中维护旅行卡片，卡片顺序即展示顺序；名称、日期、简介、封面和入口均直接在 HTML 编辑，不通过旧模板生成。
- 每张卡片以 `data-country` 标记国家，以可选的 `data-photo-directory` 指向实拍目录：R2 上的旅行写 `/media/travel/<目录>`，本地保留的写 `images/travel/<目录>`；资料图不计入收录照片。
- 增加旅行或调整实拍素材后运行 `python3 update_travel_overview.py`，按实际素材去重统计国家和照片并更新 HTML 中的总计（本地目录按文件统计，`/media/` 目录按对应游记页收录的去重引用统计）；随后更新搜索索引并验证页面。
- 验收截图与交付说明保存在仓库外的任务目录；任务目录先写结构约定，截图放 `verify/`，交付说明为 `delivery.md`，不进入站点仓库。

## 文章分类与元数据

- 根目录文章 HTML 是唯一维护来源，不新增 frontmatter。分类保存为 `<meta property="article:section">`；`article:type`（essay / note / cheatsheet）、`article:lang`（zh / en）、`article:featured`（true / false）、`article:series`、`article:series_order`、`article:updated` 使用相同的 property/content 结构，后三项可空。
- 分类固定为职业转型、AI 与工具、投资、自我认知、家庭与生活、读书笔记、周报；列表 URL 值依次为 career、ai、investment、personal、life、reading、weekly。英文文章的分类显示为英文，元数据仍用统一分类值。
- 标签存于重复的 `article:tag` meta，每篇 1–3 个。维护时同步 blog.html 卡片的 data-category、data-tags、data-type 和筛选入口；搜索索引从 HTML 派生。
- 首页精选在 `index.html` 的 `#start-here` 手工维护，顺序和短摘要保持独立，`article:featured` 与精选保持一致。最近文章固定四篇：以 `blog.html` 的 `#blogGrid` 卡片顺序为准，仅取 essay，按文章链接 slug 排除首页精选，再从后续补满；卡片标题、摘要和阅读时间复用文章列表，不从旧模板或缓存生成。
- 更新文章列表、精选或系列目录后运行 `python3 update_reading_links.py`；可用 `python3 update_reading_links.py --check` 检查是否需要同步。该脚本仅更新首页最近文章区和下述两组正篇的系列导航，不重建整页、不更新搜索索引或 sitemap。首页其他区块与正文不在其写入范围。
- `series/` 只放直接维护的系列索引 HTML，使用 kebab-case 命名；共享样式在 `styles/series.css`，资源和站内链接相对当前页面解析。canonical 与 sitemap 使用无 `.html` 地址，搜索索引保留实际 `.html` 路径。
- 周报系列使用根目录 `weekly.html`（复用 `styles/series.css`），`ol.series-list` 按期号倒序维护；单篇命名 `weekly-YYYY-wNN.html`，系列名为「周报」、编号用 `YYYYNN` 保持跨年连续排序，发布日期取源文覆盖期结束日。正文保留公开叙事，移除 Obsidian 内部素材来源与资金状况；不自动同步 Obsidian。单篇正文外提供返回周报入口，首篇不显示空的前后篇链接；后续新增时维护相邻期导航。相关阅读复用同系列优先规则。
- 系列成员设置 `article:series` 与从 1 开始的 `article:series_order`；正文之外添加系列返回入口和顺序导航，首篇无上一篇、末篇无下一篇。番外仅列在索引页，不混入正篇编号。
- `series/experience-tickets.html` 与 `series/leaving-the-system.html` 的 `ol.series-list` 是正篇成员及阅读顺序的维护来源，链接内 `h3` 为导航标题；`ul.series-list` 番外不参与上一篇/下一篇。`update_reading_links.py` 从目录生成每篇唯一的 `.series-nav`，保留首尾边界及系列目录返回入口，插入正文之外、`.article-end` 之前。不得在脚本另抄成员清单，也不得为同步导航重写正文或调整成员；成员确需变动时先维护目录及相应元数据，再同步并验证。
- 人生体验券正文之前使用统一信息框（周期、投入、一句话结果、给生活打分）；从正文提炼事实，未提供的分数写「待补」，不推测。系列页、搜索索引、sitemap 和导航检查随成员变动同步维护。
- 不通过旧模板或 data 缓存重新生成 HTML；调整分类和标签不改文章正文或 SEO 摘要。更新后运行搜索索引生成和既有测试。
- 中文文章的文末 `.article-end` 内使用唯一 `nav.related-reading`，标题固定为「相关阅读」，最多 3 条站内文章链接且排除本文；无相关候选不显示空区块。运行 `python3 update_related_reading.py` 局部同步，`--check` 检查是否过期。候选从根目录 HTML 的 `article:type`、`article:lang=zh`、系列、分类与标签派生，优先同系列（按编号距离），其次共同标签数、同分类，文件名作为稳定排序兜底；无任何关系不推荐。英文页、旅行、相册及正文均不在写入范围，生成区块不另维护成员清单。修改文章标题、系列、分类或标签后同步相关阅读并运行测试。

## 回信入口与近况维护

- 关于页保持联系区及 40 篇带 `article:type` 元数据的文章，在现有页尾加入 `mailto:kevinlee19951002@gmail.com`，链接文案固定为「读完如果有共鸣，欢迎回信，告诉我你的版本。」；正文、投资声明和英文页既有界面标签保持不变。
- `now.html` 使用「在做 / 在读 / 在想」三行，页首用 `<time datetime="YYYY-MM-DD">` 标注实际更新日期；未提供的内容写「待补」，不编造近况。首页作者区保留小入口，主导航不扩充。
- RSS 按老板确认跳过，不生成 feed.xml、不加 alternate 或页脚 RSS 入口；评论系统继续暂缓。

## 页面维护

- 新增导航项或改动主导航时，先确认内容入口，再按 `id="site-menu"` 批量同步所有共享导航页并逐页核对 `aria-current` 和移动端菜单；独立导航与明确禁止修改的页面保留并记录例外。

直接编辑 HTML、CSS 和 JavaScript；保持文章正文、已发布 URL 和本地资源链接完整。敏感配置使用环境变量，不写入前端。

## 测试与验证

### 本地测试流程
1. 直接修改对应的 HTML、CSS 或 JavaScript 文件
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

## 关键设计原则

1. **Neo-Brutalism**: 硬边框、无圆角、极端对比度
2. **信息优先**: 清晰的层级结构，无多余装饰
3. **性能优先**: 静态 HTML、懒加载图片、CDN 加速
4. **SEO 友好**: 语义化 HTML、完整的 Meta 标签
5. **响应式设计**: 移动端优先，适配所有设备

## 常见问题

**Q: 如何添加新的 CSS 样式？**
A: 在 `styles/main.css` 或对应的 CSS 文件中添加，遵循 Neo-Brutalism 规范。

**Q: 如何修改导航栏？**
A: 编辑 `index.html`, `blog.html` 等页面中的 `<nav>` 部分，并检查各页面导航一致性。

**Q: 如何优化图片？**
A: 运行 `node scripts/image-optimizer.js` 或手动使用工具压缩图片。

---

**维护者**: Kevin
**最后更新**: 2026-10-28
**项目主页**: https://github.com/kev1nl33/personal-blog
