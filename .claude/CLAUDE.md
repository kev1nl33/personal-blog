# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 个人博客网站架构指南

## 项目概述

这是一个基于 Notion 作为 CMS 的个人博客网站，使用 GitHub Actions 自动同步内容并部署。支持文章、周刊和书单三种内容类型。

## 技术栈

- **前端**: 静态 HTML + CSS（深色主题渐变设计）
- **脚本**: JavaScript (客户端交互) + Python (Notion 同步) + Node.js (周刊同步)
- **数据源**: Notion API（3个数据库：Blog Posts, Weekly, Reading List）
- **部署**: Cloudflare Pages / GitHub Pages
- **CI/CD**: GitHub Actions（每日自动同步 + 推送时触发）

## 核心命令

### 内容同步
```bash
# 同步博客文章和书单（Python）
python sync_notion.py

# 同步周刊（Node.js）
node scripts/sync-weekly.js

# 安装Python依赖
pip install requests
```

### 开发与部署
```bash
# 本地预览（使用任意静态服务器）
python -m http.server 8000

# 手动触发同步（通过GitHub Actions）
# 在GitHub仓库页面: Actions -> Sync from Notion and Deploy -> Run workflow
```

## 项目结构

```
personal-blog/
├── .github/workflows/
│   └── sync-notion.yml          # 自动同步工作流（每日00:00 UTC）
├── .claude/
│   ├── agents/                   # 4个专用子Agent
│   │   ├── notion-content-manager.md
│   │   ├── frontend-developer.md
│   │   ├── backend-integration.md
│   │   └── content-strategist.md
│   └── skills/                   # 3个专用技能
│       ├── notion-blog-skill/
│       ├── seo-optimization-skill/
│       └── content-review-skill/
├── scripts/
│   ├── sync-weekly.js           # 周刊同步脚本（Node.js）
│   ├── blog.js                  # 博客列表交互
│   ├── books.js                 # 书单筛选排序
│   ├── search.js                # 全站搜索功能
│   ├── toc.js                   # 文章目录生成
│   ├── recommendations.js       # 相关文章推荐
│   └── theme.js                 # 主题切换
├── styles/
│   ├── main.css                 # 全局样式（深色主题）
│   ├── article.css              # 文章页样式
│   ├── blog.css                 # 博客列表样式
│   ├── books.css                # 书单页样式（网格布局+封面图）
│   └── weekly.css               # 周刊样式
├── projects/                     # 项目展示（如：108 Cognitive Weapons）
├── sync_notion.py               # 博客和书单同步脚本（Python）
├── generate_search_index.py     # 生成搜索索引
├── search-index.json            # 搜索索引文件
├── index.html                   # 首页（精选文章）
├── blog.html                    # 文章列表页（带分类和标签筛选）
├── weekly.html                  # 周刊列表页
├── books.html                   # 书单页（已读/在读/想读）
├── about.html                   # 关于页面
└── *.html                       # 各篇博客文章和周刊（由Notion同步生成）
```

## Notion 数据库结构

### 1. Blog Posts 数据库
用于存储博客文章内容。

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| 标题 (Title) | Title | 文章标题 | ✓ |
| 分类 (Category) | Select | 个人成长/投资思考/AI应用/职业发展/读书笔记 | ✓ |
| 标签 (Tags) | Multi-select | 自定义标签 | - |
| 发布日期 (Published Date) | Date | 发布日期 | ✓ |
| 摘要 (Summary) | Text | 文章摘要（建议100-160字符） | ✓ |
| 阅读时间 (Reading Time) | Text | 预计阅读时间（如"5"） | - |
| 已发布 (Published) | Checkbox | 是否发布到网站 | ✓ |
| URL | Text | 文章路径slug（kebab-case格式） | ✓ |

### 2. Weekly 数据库
用于存储周刊内容。

| 字段 | 类型 | 说明 |
|------|------|------|
| 标题 | Title | 周刊标题（如"第1期"） |
| 期数 | Number | 周刊期数 |
| 发布日期 | Date | 发布日期 |
| 摘要 | Text | 周刊简介 |
| 已发布 | Checkbox | 是否发布 |
| URL | Text | 周刊路径slug |

### 3. Reading List 数据库
用于存储书单和读书笔记。

| 字段 | 类型 | 说明 |
|------|------|------|
| 书名 | Title | 书籍名称 |
| 作者 | Text | 作者名 |
| 状态 | Select | 想读/在读/已读 |
| 评分 | Select | ⭐-⭐⭐⭐⭐⭐ |
| 类型 | Multi-select | 书籍类型标签 |
| 推荐理由 | Text | 推荐理由 |
| 阅读笔记 | Text | 读书笔记内容 |
| 已发布 | Checkbox | 是否显示在网站 |
| 笔记链接 | URL | 指向Notion读书笔记页面 |
| 封面图 | Files | 书籍封面图片 |
| 豆瓣链接 | URL | 豆瓣图书链接（可自动抓取封面） |
| 完成日期 | Date | 阅读完成日期 |

## 核心工作流程

### 自动同步流程（GitHub Actions）

1. **触发时机**：
   - 每天 00:00 UTC（北京时间 08:00）自动运行
   - 推送到 main 分支时触发
   - 手动触发（workflow_dispatch）

2. **执行步骤**：
   ```yaml
   1. 检出代码
   2. 设置 Python 3.10
   3. 安装依赖 (pip install requests)
   4. 运行 sync_notion.py（同步文章和书单）
   5. 设置 Node.js 18
   6. 运行 scripts/sync-weekly.js（同步周刊）
   7. 提交更改到 Git
   8. 推送到 main 分支
   ```

3. **环境变量**（在 GitHub Secrets 中配置）：
   - `NOTION_TOKEN`: Notion API 集成令牌
   - `NOTION_DATABASE_ID`: Blog Posts 数据库 ID
   - `WEEKLY_DATABASE_ID`: Weekly 数据库 ID
   - `NOTION_READING_LIST_DB_ID`: Reading List 数据库 ID

### sync_notion.py 工作流程

Python脚本负责同步博客文章和书单：

1. **文章同步** (`main()` 函数):
   - 查询 Notion Blog Posts 数据库（已发布=True）
   - 获取每篇文章的 blocks（内容）
   - 转换 Notion blocks 为 HTML（支持标题、段落、列表、引用、代码等）
   - 生成文章 HTML 文件（包含 SEO meta 标签）
   - 更新 `blog.html` 的文章列表
   - 更新 `index.html` 的精选文章（前3篇）

2. **书单同步** (`sync_reading_list()` 函数):
   - 查询 Reading List 数据库（已发布=True）
   - 提取书籍信息（标题、作者、评分、标签等）
   - 处理封面图（优先级：封面图字段 > 页面封面 > 豆瓣抓取）
   - 按状态分组（已读/在读/想读）
   - 更新 `books.html` 的对应区域

### scripts/sync-weekly.js 工作流程

Node.js脚本负责同步周刊：

1. 查询 Weekly 数据库（已发布=True）
2. 获取周刊内容
3. 生成周刊 HTML 文件（`weekly-{number}.html`）
4. 更新 `weekly.html` 的周刊列表

## 可用的 Claude Code Agents 和 Skills

### Agents（使用 Task 工具调用）

1. **notion-content-manager**
   - 职责：Notion 内容管理和验证
   - 使用场景：检查内容完整性、生成 URL slug、验证必填字段

2. **frontend-developer**
   - 职责：前端开发和 UI 实现
   - 使用场景：组件开发、样式调整、响应式优化

3. **backend-integration**
   - 职责：后端集成和自动化
   - 使用场景：Notion API 调用、同步脚本、GitHub Actions

4. **content-strategist**
   - 职责：内容策略和 SEO
   - 使用场景：内容审核、SEO 优化、元数据生成

### Skills（使用 Skill 工具调用）

1. **seo-optimization-skill**
   - 为博客文章生成 SEO 友好的元数据
   - 包括标题优化、描述生成、关键词建议

2. **notion-blog-skill**
   - 管理 Notion 博客内容
   - 检查内容完整性、URL 生成、发布状态同步

3. **content-review-skill**
   - 审核博客文章质量
   - 检查语法、逻辑、可读性
   - 理解并保持作者写作风格

## 内容生成规则

### URL Slug 生成规则
```
输入: "《被讨厌的勇气》读书笔记"
输出: "the-courage-to-be-disliked-reading-notes"

规则:
1. 优先使用英文翻译
2. 转小写
3. 空格和特殊字符转连字符
4. 最大长度 50 字符
5. 确保唯一性
```

### 文章分类映射
```python
CATEGORY_MAP = {
    '职业发展': 'career',
    'AI应用': 'ai',
    '投资思考': 'investment',
    '个人成长': 'personal',
    '读书笔记': 'reading'
}
```

### HTML 生成模板
- 所有页面包含统一的导航栏和页脚
- 文章页包含完整的 SEO meta 标签（Open Graph、Twitter Card）
- 支持的 Notion block 类型：
  - 段落 (paragraph)
  - 标题 1/2/3 (heading_1/2/3)
  - 无序列表 (bulleted_list_item)
  - 有序列表 (numbered_list_item)
  - 引用 (quote)
  - 代码块 (code)
  - Rich text 格式（粗体、斜体、代码、链接）

## 设计原则

1. **简单优先**: 保持静态网站的简洁性，不引入复杂框架
2. **内容为王**: 技术服务于内容展示，不要过度设计
3. **自动化**: 减少手动操作，依赖 Notion 到网站的自动同步
4. **性能优先**: 保持页面加载速度，优化图片和资源

## 重要注意事项

1. **不要直接修改生成的文章 HTML**：所有文章内容源自 Notion，直接修改会被下次同步覆盖
2. **可以修改的文件**：
   - 模板部分（sync_notion.py 中的 HTML 模板）
   - 样式文件（styles/*.css）
   - 脚本文件（scripts/*.js）
   - 布局页面（index.html, blog.html, books.html 的结构部分）
3. **URL slug 一致性**：一旦文章发布，不要修改 URL，避免链接失效
4. **豆瓣封面抓取**：有请求延迟（0.5秒），避免被限流
5. **Notion API 版本**：使用 `2022-06-28` 版本

## 常用工作流示例

### 添加新文章
1. 在 Notion Blog Posts 数据库创建文章
2. 填写所有必填字段（标题、分类、摘要、URL、发布日期）
3. 勾选"已发布"
4. 等待自动同步或手动运行 `python sync_notion.py`
5. 检查生成的 HTML 文件和 blog.html 更新

### 修改样式
1. 确定需要修改的页面（文章/博客列表/书单等）
2. 在对应的 CSS 文件中修改（styles/*.css）
3. 本地测试效果
4. 提交到 Git，推送触发自动部署

### SEO 优化
1. 使用 `seo-optimization-skill` 分析现有文章
2. 在 Notion 中更新文章的摘要和标题
3. 触发同步更新 meta 标签
4. 检查生成的 Open Graph 和 Twitter Card 标签
