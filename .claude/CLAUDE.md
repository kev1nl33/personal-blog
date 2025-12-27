# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notion-powered personal blog with automated content synchronization. A static HTML/CSS/JS website that syncs content from 3 Notion databases (Blog Posts, Weekly, Reading List) via GitHub Actions and deploys to Cloudflare Pages.

## Core Commands

### Content Synchronization
```bash
# Sync blog posts and reading list (Python)
python sync_notion.py

# Sync weekly content (Node.js) - Note: Weekly sync functionality has been removed
# node scripts/sync-weekly.js

# Generate search index
python generate_search_index.py

# Generate sitemap
python generate_sitemap.py
```

### Development
```bash
# Install Python dependencies
pip install requests

# Local preview
python -m http.server 8000
# Then visit http://localhost:8000

# Manual sync trigger
# GitHub: Actions → "Sync from Notion and Deploy" → Run workflow
```

## Architecture

### Data Flow
```
Notion DB → GitHub Actions (daily 00:00 UTC) → sync_notion.py → HTML files → Cloudflare Pages
```

### Sync Pipeline
1. **GitHub Actions** (`.github/workflows/sync-notion.yml`):
   - Triggers: Daily cron, push to main, manual dispatch
   - Runs Python sync script
   - Auto-commits and pushes changes

2. **sync_notion.py** - Main content synchronization:
   - `main()`: Syncs blog posts
     - Queries Notion API for published posts
     - Fetches blocks (content) for each page
     - Converts Notion blocks → HTML (supports: paragraphs, headings, lists, quotes, code)
     - Generates article HTML with SEO meta tags
     - Updates `blog.html` article list
     - Updates `index.html` featured articles (top 3)

   - `sync_reading_list()`: Syncs reading list
     - Queries Reading List database
     - Fetches book metadata (cover images prioritize: Files field → Page cover → Douban scraping)
     - Groups by status (已读/在读/想读)
     - Updates `books.html` sections

### Content Generation Rules

**URL Slug Format:**
```python
# Input: "《被讨厌的勇气》读书笔记"
# Output: "the-courage-to-be-disliked-reading-notes"

# Rules:
# 1. Prefer English translation
# 2. Lowercase
# 3. Replace spaces/special chars with hyphens
# 4. Max 50 characters
# 5. Ensure uniqueness
```

**Category Mapping:**
```python
CATEGORY_MAP = {
    '职业发展': 'career',
    'AI应用': 'ai',
    '投资思考': 'investment',
    '个人成长': 'personal',
    '读书笔记': 'reading'
}
```

**Supported Notion Block Types:**
- paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item
- quote, code
- Rich text: bold, italic, code, links

### Client-Side Architecture

**Scripts:**
- `blog.js`: Category/tag filtering, search functionality
- `search.js`: Full-site search using `search-index.json`
- `toc.js`: Auto-generate article table of contents
- `recommendations.js`: Related article suggestions
- `theme.js`: Theme switching
- `page-loader.js`: Page loading optimization
- `image-optimizer.js`: Image optimization

**Styles:**
- `main.css`: Global dark theme with gradients
- `article.css`, `blog.css`, `books.css`: Page-specific styles

## Notion Database Schema

### Blog Posts
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| 标题 (Title) | Title | ✓ | Article title |
| 分类 (Category) | Select | ✓ | One of: 个人成长/投资思考/AI应用/职业发展/读书笔记 |
| 标签 (Tags) | Multi-select | | Custom tags |
| 发布日期 (Published Date) | Date | ✓ | Publication date |
| 摘要 (Summary) | Text | ✓ | 100-160 chars recommended |
| 阅读时间 (Reading Time) | Text | | e.g., "5" |
| 已发布 (Published) | Checkbox | ✓ | Must be checked to sync |
| URL | Text | ✓ | kebab-case slug |

### Reading List
| Field | Type | Notes |
|-------|------|-------|
| 书名 | Title | Book title |
| 作者 | Text | Author name |
| 状态 | Select | 想读/在读/已读 |
| 评分 | Select | ⭐-⭐⭐⭐⭐⭐ |
| 类型 | Multi-select | Genre tags |
| 推荐理由 | Text | Recommendation |
| 阅读笔记 | Text | Reading notes |
| 已发布 | Checkbox | Display on website |
| 笔记链接 | URL | Link to Notion notes |
| 封面图 | Files | Book cover image |
| 豆瓣链接 | URL | Douban link (auto-fetch cover) |
| 完成日期 | Date | Completion date |

## Environment Variables

Required GitHub Secrets:
- `NOTION_TOKEN`: Notion API integration token
- `NOTION_DATABASE_ID`: Blog Posts database ID
- `NOTION_READING_LIST_DB_ID`: Reading List database ID
- `WEEKLY_DATABASE_ID`: Weekly database ID (if re-enabled)

## Claude Code Integration

### Available Agents (via Task tool)

1. **notion-content-manager**: Notion content validation
   - Check field completeness, generate URL slugs, verify required fields

2. **frontend-developer**: Frontend development
   - Component development, styling, responsive design

3. **backend-integration**: Backend integration
   - Notion API calls, sync scripts, GitHub Actions

4. **content-strategist**: Content strategy & SEO
   - Content review, SEO optimization, metadata generation

### Available Skills (via Skill tool)

1. **seo-optimization-skill**: Generate SEO metadata
   - Title optimization, description generation, keyword suggestions

2. **notion-blog-skill**: Manage Notion blog content
   - Content integrity checks, URL generation, publish status sync

3. **content-review-skill**: Review article quality
   - Grammar, logic, readability checks
   - Maintain author's writing style

## Critical Constraints

1. **DO NOT directly edit generated article HTML files** - they are overwritten on next sync. Source of truth is Notion.

2. **Safe to modify:**
   - HTML templates in `sync_notion.py`
   - Style files (`styles/*.css`)
   - Script files (`scripts/*.js`)
   - Layout pages (`index.html`, `blog.html`, `books.html` - structural parts only)

3. **URL immutability**: Once published, don't change article URLs (breaks links)

4. **Douban scraping**: Has 0.5s delay to avoid rate limiting

5. **Notion API version**: Uses `2022-06-28`

## Design Principles

- **Simplicity first**: Keep static site simple, no complex frameworks
- **Content-driven**: Technology serves content, avoid over-engineering
- **Automation**: Minimize manual operations, rely on Notion → GitHub sync
- **Performance**: Fast page loads, optimized images and assets
