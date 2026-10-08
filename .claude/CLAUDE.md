# 项目开发指南

这是直接维护 HTML、CSS 和原生 JavaScript 的个人博客。根目录 HTML 是页面内容和结构的维护来源，已发布 URL 保持稳定。

## 本地开发

```bash
python3 -m http.server 8000
npm run build
npm test
python3 validate_site.py
python3 generate_search_index.py
python3 generate_sitemap.py
```

默认构建只编译 CSS。直接修改页面后更新相关列表、搜索索引与站点地图，并检查导航、筛选、图片和响应式布局。

styles/ 保存样式，scripts/ 保存浏览器交互。templates/、data/ 和 site_builder.py 保留为既有参考与可选本地渲染工具，不作为当前页面的默认维护流程。不要用旧模板或缓存覆盖手工修改的 HTML。

页面保持语义化结构、完整 SEO 标签、图片 alt 和可访问的键盘交互。设计沿用黑色硬边框、米白背景和橙色重点色。更多规范见 AGENTS.md。

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

