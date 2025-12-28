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

## Design System - Neo-Brutalism 新野兽派

### Core Visual Principles

**Design Philosophy: Directness, Sharpness, Clarity**
- Anti-decorative minimalism
- Extreme contrast and geometric precision
- Information-first hierarchy
- No unnecessary ornamentation

### Color Palette

```css
--brand-black: #0a0a0a      /* Primary text & borders */
--brand-white: #f4f4f0      /* Background */
--brand-accent: #FF4D00     /* Warning orange - CTAs & highlights */
--brand-blue: #0047AB       /* Klein blue - sections */
--brand-green: #059669      /* Growth green - positive states */
--brand-gray: #8a8a8a       /* Secondary text */
```

**Usage Rules:**
- Background: Always `#f4f4f0` (off-white)
- Text: Always `#0a0a0a` (pure black)
- Accent: Use `#FF4D00` sparingly for CTAs and important highlights
- Never use gradients in primary UI (exception: hero sections)

### Typography System

**Font Stack:**
```css
/* Labels, code, metadata */
font-mono: 'JetBrains Mono', monospace

/* Quotes, subtitles, body emphasis */
font-serif: 'Noto Serif SC', serif

/* Headings, body text */
font-sans: 'Noto Sans SC', 'Inter', sans-serif
```

**Size Hierarchy:**
- Display (h1): `text-5xl ~ text-7xl` (48-72px) - Ultra bold, tight line-height
- Heading (h2): `text-3xl ~ text-4xl` (30-36px) - Bold
- Subheading (h3): `text-xl ~ text-2xl` (20-24px) - Semibold
- Body: `text-base ~ text-lg` (16-18px) - Regular
- Small/Mono: `text-sm ~ text-xs` (12-14px) - For labels & metadata

**Typography Rules:**
- Display text: `letter-spacing: -0.02em`, `line-height: 1.1`
- Mono text: Always uppercase for labels (e.g., "TOOLKIT", "OS")
- Serif: Use for quotes and emphasis blocks only
- Never use font weights between regular/bold (only 400, 600, 700, 900)

### Layout System

**Grid Background:**
```css
background-image: linear-gradient(#e5e5e5 1px, transparent 1px),
                  linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
background-size: 40px 40px;
```

**Bento Box Cards:**
```css
.bento-card {
    background: white;
    border: 1px solid #0a0a0a;
    /* No border-radius - keep sharp corners */
}

.bento-card:hover {
    transform: translateY(-4px);
    box-shadow: 8px 8px 0px #0a0a0a; /* Hard shadow, no blur */
}
```

**Grid System:**
- Use 12-column responsive grid (`grid-cols-1 md:grid-cols-12`)
- Card spans: Flexible (4, 5, 7, 8, 12 columns)
- Gap: `gap-6` (24px)

### Border & Shadow System

**Hard Borders:**
- Default: `border: 1px solid #0a0a0a`
- Emphasis: `border: 2px solid #0a0a0a`
- Never use rounded corners (no `border-radius`) except for small elements (buttons, badges)

**Hard Shadows (No Blur):**
```css
/* Default hover */
box-shadow: 8px 8px 0px #0a0a0a;

/* Floating elements */
box-shadow: 4px 4px 0px #0a0a0a;

/* Never use blurred shadows like: box-shadow: 0 4px 6px rgba(...) */
```

### Interactive Elements

**Buttons:**
```html
<!-- Primary Button -->
<button class="bg-brand-black text-white px-6 py-3 border-2 border-brand-black
               font-bold uppercase tracking-wide
               hover:bg-brand-accent hover:border-brand-accent
               transition-all duration-300">
  Button Text
</button>
```

**Links:**
- Underline on hover only
- Use accent color `#FF4D00` for active states

**Marker Highlight Effect:**
```css
.marker-highlight {
    background: linear-gradient(120deg, rgba(255, 77, 0, 0.15) 0%, rgba(255, 77, 0, 0.15) 100%);
    background-repeat: no-repeat;
    background-size: 100% 40%;
    background-position: 0 88%;
}
.marker-highlight:hover {
    background-size: 100% 88%;
}
```

### Animation System

**Scroll Reveal:**
```css
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease-out;
}
.reveal.active {
    opacity: 1;
    transform: translateY(0);
}
```

**Transition Speed:**
- Fast: `0.3s` - Buttons, hovers
- Medium: `0.4s` - Cards, modals
- Slow: `0.8s` - Scroll reveals

**Easing:**
- Default: `ease-out`
- Cards: `cubic-bezier(0.25, 0.8, 0.25, 1)`

### Component Patterns

**Icon Usage:**
- Use RemixIcon (`remixicon.css`)
- Size: `text-xl ~ text-4xl`
- Color: Match parent text color or use accent

**Progress Bars:**
```css
/* Container */
.h-1 .w-full .bg-gray-800 .rounded

/* Fill (no animation, instant) */
.h-1 .bg-brand-accent
```

**Dividers:**
```html
<!-- Horizontal line with center text -->
<div class="flex items-center gap-4">
    <div class="flex-1 h-px bg-brand-black opacity-20"></div>
    <h2 class="font-mono text-sm tracking-widest uppercase">
        <span class="text-brand-accent">●</span> Title <span class="text-brand-accent">●</span>
    </h2>
    <div class="flex-1 h-px bg-brand-black opacity-20"></div>
</div>
```

### Responsive Behavior

**Breakpoints:**
- Mobile: `< 768px` - Single column, stack cards
- Tablet: `768px ~ 1024px` - 2-3 columns
- Desktop: `> 1024px` - Full 12-column grid

**Mobile Rules:**
- Reduce text sizes by 1-2 steps (e.g., `text-7xl` → `text-5xl`)
- Maintain border thickness (don't thin out)
- Keep hard shadows (reduce to `4px 4px 0px`)

### Accessibility

**Scrollbar Styling:**
```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f4f4f0; }
::-webkit-scrollbar-thumb { background: #0a0a0a; }
```

**Contrast Ratios:**
- Text on white: `#0a0a0a` on `#f4f4f0` = 18.3:1 (AAA)
- Accent on white: `#FF4D00` on `#f4f4f0` = 6.2:1 (AA)

### Implementation Checklist

When creating new pages/components:
- [ ] Use `bg-grid` background pattern
- [ ] Apply `.bento-card` class to content blocks
- [ ] Use only approved color palette (no custom colors)
- [ ] Implement hard shadows on hover (no blur)
- [ ] Add `.reveal` animation to sections
- [ ] Use mono font for all labels/metadata
- [ ] Ensure 1-2px black borders on all cards
- [ ] Test mobile responsiveness (stack cards vertically)

### Anti-Patterns (Never Do This)

❌ Soft shadows: `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`
❌ Rounded corners on cards: `border-radius: 1rem`
❌ Gradient backgrounds everywhere
❌ Thin borders: `border: 0.5px solid ...`
❌ Medium font weights: `font-weight: 500`
❌ Pastel colors or low contrast
❌ Animations longer than 1s
❌ Skeuomorphic effects

## Design Principles

- **Simplicity first**: Keep static site simple, no complex frameworks
- **Content-driven**: Technology serves content, avoid over-engineering
- **Automation**: Minimize manual operations, rely on Notion → GitHub sync
- **Performance**: Fast page loads, optimized images and assets

