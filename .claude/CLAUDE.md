# Website Architect - 个人博客网站主 Agent

## 项目概述

这是一个基于 Notion 作为 CMS 的个人博客网站，使用 GitHub Actions 自动同步内容并部署到 Vercel。

## 技术栈

- **前端**: 静态 HTML + CSS（Tailwind 风格）
- **数据源**: Notion API
- **同步脚本**: Python (`sync_notion.py`)
- **部署**: GitHub Pages / Vercel
- **CI/CD**: GitHub Actions

## 项目结构

```
personal-blog/
├── .github/workflows/    # GitHub Actions 工作流
├── scripts/              # 构建脚本
├── styles/               # CSS 样式文件
├── sync_notion.py        # Notion 同步脚本
├── index.html            # 首页
├── blog.html             # 博客列表
├── books.html            # 书单页面
├── about.html            # 关于页面
└── *.html                # 各篇博客文章
```

## Notion 数据库结构

### Blog Posts 数据库
| 字段 | 类型 | 说明 |
|------|------|------|
| Title | Title | 文章标题 |
| Category | Select | 分类：个人成长/投资思考/AI应用/职业发展/读书笔记 |
| Published Date | Date | 发布日期 |
| Summary | Text | 文章摘要 |
| Reading Time | Text | 预计阅读时间 |
| Published | Checkbox | 是否发布 |
| URL | Text | 文章路径 slug |

### Reading List 数据库
| 字段 | 类型 | 说明 |
|------|------|------|
| 书名 | Title | 书籍名称 |
| 作者 | Text | 作者名 |
| 状态 | Select | 想读/在读/已读 |
| 评分 | Select | ⭐-⭐⭐⭐⭐⭐ |
| 类型 | Multi-select | 书籍类型 |
| 推荐理由 | Text | 推荐理由 |
| 已发布 | Checkbox | 是否显示 |
| 笔记链接 | URL | 读书笔记链接 |

## 可用 Subagents

调用方式：`@agent-name` 或使用 Task 工具

### 1. notion-content-manager
- 职责：Notion 内容管理和验证
- 使用场景：检查内容完整性、生成 URL slug、验证必填字段

### 2. frontend-developer
- 职责：前端开发和 UI 实现
- 使用场景：组件开发、样式调整、响应式优化

### 3. backend-integration
- 职责：后端集成和自动化
- 使用场景：Notion API 调用、同步脚本、GitHub Actions

### 4. content-strategist
- 职责：内容策略和 SEO
- 使用场景：内容审核、SEO 优化、元数据生成

## 常用工作流

### 添加新文章
1. 在 Notion 中创建文章 → `@notion-content-manager` 验证字段
2. 触发同步 → `@backend-integration` 检查 Actions
3. 检查页面 → `@frontend-developer` 确认渲染

### 样式调整
1. 分析需求 → `@frontend-developer` 实现
2. 检查响应式 → `@frontend-developer` 测试

### SEO 优化
1. 分析现状 → `@content-strategist` 审核
2. 生成元数据 → `@content-strategist` 优化

## 决策原则

1. **简单优先**: 保持静态网站的简洁性
2. **内容为王**: 技术服务于内容展示
3. **自动化**: 减少手动操作，依赖 Notion 到网站的自动同步
4. **性能优先**: 保持页面加载速度

## 注意事项

- 所有内容源自 Notion，不要直接修改生成的 HTML 内容部分
- 可以修改模板、样式和同步脚本
- 保持 URL slug 的一致性
