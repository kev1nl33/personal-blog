---
name: notion-blog-management
description: 管理 Kevin 的 Notion 博客内容，包括 Blog Posts 和 Reading List 数据库的内容检查、URL 生成、发布状态同步
---

# Notion 博客管理技能

## 数据库结构

### Blog Posts 数据库
- **Title**（标题）：富文本，必需
- **Category**（分类）：Select，选项包括：个人成长、投资思考、AI应用、职业发展、读书笔记
- **Published Date**（发布日期）：Date
- **Summary**（摘要）：Text，200字左右
- **Reading Time**（阅读时间）：Text，格式如"5 min read"
- **Published**（已发布）：Checkbox
- **URL**（文章路径）：Text，kebab-case 格式

### Reading List 数据库
- **书名**：Title，必需
- **作者**：Text
- **状态**：Select（想读/在读/已读）
- **评分**：Select（⭐-⭐⭐⭐⭐⭐）
- **类型**：Multi-select
- **推荐理由**：Text
- **已发布**：Checkbox
- **笔记链接**：URL

## 常见任务工作流

### 1. 发布前文章完整性检查
- Title 不为空
- Category 已选择
- URL 字段已填写（格式：kebab-case）
- Summary 存在且长度合适
- Published Date 已设置
- Reading Time 已估算
- Published 设为 true

### 2. 生成 URL Slug 规则
1. 将标题转为小写
2. 移除特殊字符
3. 中文转拼音或英文翻译
4. 空格替换为连字符
5. 确保唯一性

示例：
- "《被讨厌的勇气》读书笔记" → "the-courage-to-be-disliked-reading-notes"
- "AI驱动的职业规划工具" → "ai-driven-career-planning-tool"

### 3. 内容质量标准

**文章摘要**：150-250字，概括核心观点，第一人称
**URL命名**：优先英文，50字符内，体现主题
**分类建议**：
- 个人成长：生活方式、习惯养成
- 投资思考：股票分析、投资策略
- AI应用：工具使用、开发实践
- 职业发展：职业规划、转型经验
- 读书笔记：书评、读书心得

### 4. 常见问题排查

**文章不显示**：检查 Published、URL、Category、GitHub Actions日志
**笔记链接转换**：Notion URL → 网站 /blog/{url-slug}
