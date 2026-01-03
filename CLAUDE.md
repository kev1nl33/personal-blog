# Personal Blog - Claude Code 使用指南

本项目是一个基于 Notion 的个人博客系统，支持通过 GitHub Actions 自动同步内容，并采用 Neo-Brutalism 设计风格。

## 项目架构

```
Notion 数据库 → GitHub Actions → sync_notion.py → HTML 文件 → Cloudflare Pages
```

**核心功能：**
- 从 Notion 数据库自动同步内容（博客文章）
- 静态 HTML/CSS/JS 网站，无需复杂框架
- Neo-Brutalism 新野兽派设计系统
- 全站搜索、文章推荐、目录导航

## 快速开始

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/kev1nl33/personal-blog.git
cd personal-blog

# 2. 安装依赖
pip install requests

# 3. 配置环境变量（可选，用于本地同步）
export NOTION_TOKEN="your_notion_token"
export NOTION_DATABASE_ID="your_database_id"
export COFFEE_BEANS_DB_ID="your_coffee_beans_id"
export CAFE_VISITS_DB_ID="your_cafe_visits_id"
export BREWING_NOTES_DB_ID="your_brewing_notes_id"

# 4. 本地预览
python -m http.server 8000
# 访问 http://localhost:8000

# 5. 手动同步内容（可选）
python sync_notion.py
```

### 使用 Claude Code

本项目针对 Claude Code 进行了优化，包含专用配置文件（`.claude/CLAUDE.md`）。

**推荐工作流：**

1. **内容管理** - 使用 Notion 技能管理博客内容
   ```bash
   # 在 Claude Code 中运行
   /notion-blog-skill
   ```

2. **SEO 优化** - 为文章生成 SEO 元数据
   ```bash
   /seo-optimization-skill
   ```

3. **内容审核** - 检查文章质量
   ```bash
   /content-review-skill
   ```

4. **自动化同步** - GitHub Actions 每日 UTC 00:00 自动同步

## 核心命令

```bash
# 内容同步
python sync_notion.py              # 同步博客文章
python generate_search_index.py    # 生成搜索索引
python generate_sitemap.py         # 生成站点地图

# 开发调试
python -m http.server 8000         # 本地服务器

# Git 工作流
git add .
git commit -m "Update content"
git push origin main               # 触发自动部署
```

## 设计系统

本项目采用 **Neo-Brutalism（新野兽派）** 设计风格：

**核心原则：**
- 极简主义、直接、锐利
- 极端对比度和几何精度
- 信息优先的层级结构
- 无多余装饰

**颜色体系：**
- `#0a0a0a` - 主要文本和边框（纯黑）
- `#f4f4f0` - 背景色（米白）
- `#FF4D00` - 强调色（警示橙）
- `#0047AB` - 区块色（克莱因蓝）
- `#059669` - 状态色（增长绿）

**视觉特征：**
- 硬边框（1-2px 黑色实线）
- 硬阴影（无模糊，如 `8px 8px 0px #0a0a0a`）
- 无圆角（保持锐利边缘）
- 网格背景（40x40px）
- Bento Box 卡片布局

**查看完整设计系统：**
访问 `/visual-design.html` 查看所有设计组件和样式指南。

## 文件结构

```
personal-blog/
├── .claude/
│   └── CLAUDE.md           # Claude Code 配置文件
├── .github/workflows/
│   └── sync-notion.yml     # 自动同步工作流
├── articles/               # 生成的文章页面（自动）
├── scripts/                # JavaScript 脚本
│   ├── blog.js            # 博客列表功能
│   ├── search.js          # 全站搜索
│   ├── toc.js             # 文章目录
│   └── recommendations.js # 文章推荐
├── styles/                # CSS 样式
│   ├── main.css           # 全局样式
│   ├── visual-design.css  # 设计系统工具类
│   ├── article.css        # 文章页样式
│   └── blog.css           # 博客列表样式
├── index.html             # 首页
├── blog.html              # 博客列表
├── visual-design.html     # 设计系统展示页
├── sync_notion.py         # Notion 同步脚本
└── CLAUDE.md              # 本文档
```

## 内容管理

### Notion 数据库字段

**博客文章（Blog Posts）：**
- 标题（Title）- 必填
- 分类（Category）- 必填：个人成长/投资思考/AI应用/职业发展/读书笔记
- 标签（Tags）- 可选
- 发布日期（Published Date）- 必填
- 摘要（Summary）- 必填，100-160 字符
- 阅读时间（Reading Time）- 可选
- 已发布（Published）- 必填，勾选后才会同步
- URL - 必填，kebab-case 格式

### URL 规则

```python
# 示例
输入: "《被讨厌的勇气》读书笔记"
输出: "the-courage-to-be-disliked-reading-notes"

# 规则：
# 1. 优先使用英文翻译
# 2. 小写字母
# 3. 用连字符替换空格和特殊字符
# 4. 最多 50 字符
# 5. 确保唯一性
```

## 关键约束

⚠️ **重要提示：**

1. **不要直接编辑生成的文章 HTML** - `articles/` 目录下的文件会在每次同步时被覆盖
2. **可以安全修改的文件：**
    - `sync_notion.py` 中的 HTML 模板
    - `styles/*.css` 样式文件
    - `scripts/*.js` 脚本文件
    - `index.html`, `blog.html` 的结构部分
    - `visual-design.html` 设计系统展示页

3. **URL 不可变性** - 文章发布后，不要修改 URL（会破坏外部链接）

4. **内容源头是 Notion** - 所有文章内容的修改应该在 Notion 中进行

## 部署流程

本项目使用 **Cloudflare Pages** 自动部署：

1. 在 Notion 中创建/编辑内容
2. 勾选"已发布"复选框
3. 等待 GitHub Actions 自动同步（每日 UTC 00:00）
4. 或手动触发：GitHub → Actions → "Sync from Notion and Deploy" → Run workflow
5. Cloudflare Pages 自动检测 main 分支变更并部署

## 常见问题

**Q: 如何添加新文章？**
A: 在 Notion 的 Blog Posts 数据库中创建新页面，填写所有必填字段，勾选"已发布"。

**Q: 修改文章后多久生效？**
A: 如果等待自动同步，最多 24 小时。可以在 GitHub Actions 中手动触发立即同步。

**Q: 如何修改设计样式？**
A: 编辑 `styles/*.css` 文件，参考 `visual-design.html` 中的设计系统规范。

**Q: 本地预览看不到最新内容？**
A: 运行 `python sync_notion.py` 手动同步（需要配置环境变量）。

**Q: 如何添加新的设计组件？**
A: 遵循 Neo-Brutalism 设计原则，在 `visual-design.css` 中添加工具类，在 `visual-design.html` 中展示示例。

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 遵循 Neo-Brutalism 设计规范
4. 提交变更：`git commit -m "Add new feature"`
5. 推送分支：`git push origin feature/new-feature`
6. 创建 Pull Request

## 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **内容管理**: Notion API
- **自动化**: GitHub Actions, Python 3
- **部署**: Cloudflare Pages
- **设计**: Neo-Brutalism, Responsive Design
- **字体**: Noto Sans SC, Noto Serif SC, JetBrains Mono
- **图标**: RemixIcon

## 性能优化

- 静态 HTML 生成，无客户端渲染
- 图片懒加载（`loading="lazy"`）
- CSS 模块化，按需加载
- 搜索索引预生成
- Cloudflare CDN 加速

## 许可证

MIT License

---

**维护者**: Kevin
**最后更新**: 2025-12-30
**Claude Code 版本**: 适配 Sonnet 4.5
