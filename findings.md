# 咖啡角重新设计 - 发现文档

**创建时间**: 2026-01-09
**项目**: Personal Blog - Coffee Corner Redesign

---

## 现有架构分析

### 页面结构

```
coffee.html (主页)
├── Hero Section (标题 + 描述)
├── 统计卡片区 (4个卡片)
│   ├── 器具收藏 (4)
│   ├── 豆子档案 (0)
│   ├── 探店足迹 (0)
│   └── 冲煮日记 (0)
├── Bento Grid 布局
│   ├── 旗舰器具展示 (KD-310GB)
│   ├── 最近品鉴预览 (豆子) - 空白
│   ├── 冲煮日记预览 - 空白
│   ├── 探店地图预览 - 空白
│   └── 器具速览 (图标卡片)
└── 页脚

子页面:
├── coffee-equipment.html (器具列表)
├── coffee-beans.html (豆子档案)
├── coffee-shops.html (探店笔记)
├── coffee-notes.html (随手记)
└── coffee-equipment-*.html (器具详情页)
```

---

## 设计系统分析

### 颜色系统

```css
/* Brand Colors (全局) */
--brand-black: #0a0a0a
--brand-white: #f4f4f0
--brand-accent: #FF4D00
--brand-blue: #0047AB
--brand-green: #059669
--brand-gray: #8a8a8a

/* Coffee Colors (咖啡角专用) */
--coffee-dark: #3C2415
--coffee-medium: #6F4E37
--coffee-light: #A67B5B
--coffee-cream: #C4A484
--coffee-foam: #F5E6D3
```

### 布局系统

- **Bento Grid**: 3列网格布局
  - `bento-card--large`: 跨2列
  - `bento-card--full`: 跨3列
  - 响应式: 1024px以下2列, 768px以下1列

- **Stats Grid**: 4列等宽
  - 响应式: 768px以下2列

### 卡片样式

所有卡片使用 Neo-Brutalism 风格：
- 2px 黑色实线边框
- 无圆角
- 硬阴影 (8px 8px 0px #0a0a0a)
- 悬停效果: translateY(-4px)

---

## 关键问题

### 1. 数据硬编码 ⚠️ 严重

**问题描述**:
- 所有内容直接写在 HTML 中
- 豆子、探店、笔记数据都是静态 HTML
- 统计数字是硬编码的

**影响**:
- 添加新内容需要手动编辑 HTML
- 无法动态更新统计
- 维护成本高

---

### 2. 预览卡空白 ⚠️ 中等

**问题描述**:
- 主页的"最近品鉴"、"冲煮日记"、"探店地图"预览区显示"暂无记录"
- 数据存在但未加载到主页

**影响**:
- 用户体验差
- 页面显得空洞
- Bento Grid 布局未充分利用

---

### 3. 缺乏筛选功能 ⚠️ 中等

**问题描述**:
- coffee-beans.html 有筛选按钮但无功能
- coffee-shops.html 有城市筛选但无功能
- coffee-notes.html 有分类筛选但无功能

**影响**:
- 用户无法按需浏览
- 内容多时查找困难

---

### 4. 与博客系统架构不一致 ⚠️ 严重

**问题描述**:
- 博客文章使用 Notion → sync_notion.py → HTML 流程
- 咖啡角内容完全手动管理

**影响**:
- 维护两套内容管理系统
- 无法复用现有同步机制
- 不符合项目"自动化"理念

---

## 现有 Notion 数据库

### 已集成数据库

根据 `sync_notion.py`，项目已有：

1. **Blog Posts** (NOTION_DATABASE_ID)
   - 字段: 标题、分类、标签、发布日期、摘要、阅读时间、已发布、URL

2. **Reading List** (NOTION_READING_LIST_DB_ID)
   - 字段: 书名、作者、状态、评分、类型、推荐理由、阅读笔记、已发布、笔记链接、封面图、豆瓣链接、完成日期

### 需要创建的数据库

1. **Coffee Beans** (咖啡豆档案)
   - 建议字段:
     - 豆子名称 (Title)
     - 产地/国家 (Select)
     - 处理法 (Select: 日晒/水洗/蜜处理)
     - 烘焙度 (Select: 浅烘/中烘/深烘)
     - 烘焙商/购买渠道 (Text)
     - 风味描述 (Text/Multi-select)
     - 冲煮参数 (Blocks/Text)
     - 品鉴笔记 (Text)
     - 评分 (Select: ⭐-⭐⭐⭐⭐⭐)
     - 购买日期 (Date)
     - 已发布 (Checkbox)

2. **Cafe Visits** (探店笔记)
   - 建议字段:
     - 咖啡馆名称 (Title)
     - 城市 (Select: 深圳/广州/其他)
     - 具体位置 (Text)
     - 评分 (Select)
     - 推荐单品 (Text)
     - 环境描述 (Text)
     - 标签 (Multi-select: 安静/适合工作/自烘豆/等)
     - 探店日期 (Date)
     - 已发布 (Checkbox)

3. **Brewing Notes** (冲煮日记)
   - 建议字段:
     - 标题 (Title)
     - 分类 (Select: 冲煮记录/实验/心情/学习)
     - 咖啡豆 (Text - 关联豆子名称)
     - 冲煮方式 (Select: V60/手冲壶/摩卡壶/意式)
     - 冲煮参数 (Text)
     - 内容 (Blocks)
     - 日期 (Date)
     - 已发布 (Checkbox)

4. **Equipment** (器具收藏)
   - 建议字段:
     - 器具名称 (Title)
     - 品牌 (Text)
     - 类型 (Select: 咖啡机/磨豆机/手冲壶/滤杯/电子秤/其他)
     - 型号 (Text)
     - 评分 (Select)
     - 使用心得 (Text)
     - 购买日期 (Date)
     - 已发布 (Checkbox)

---

## 设计模式参考

### 优秀模式

1. **主页 Bento Grid** ✅
   - 布局灵活，信息密度高
   - 旗舰器具展示效果好
   - 符合 Neo-Brutalism 风格

2. **器具详情页** ✅
   - coffee-equipment-kd310gb.html 等设计精美
   - 参数展示清晰
   - 视觉冲击力强

3. **统计卡片** ✅
   - 信息一目了然
   - 图标 + 数字效果良好

### 需改进模式

1. **预览卡** ❌
   - 当前空白，需要实现动态加载
   - 建议: 使用 JavaScript 加载 JSON 数据

2. **筛选按钮** ❌
   - 当前无功能，需要实现
   - 建议: 使用 JavaScript 实现客户端筛选

3. **时间线设计** ⚠️
   - coffee-notes.html 有基础时间线
   - 可以优化为更丰富的交互体验

---

## 技术栈建议

### 后端

- **Python**: 保持与现有 sync_notion.py 一致
- **Notion API**: 使用现有的 API 版本 (2022-06-28)
- **JSON 输出**: 生成静态数据文件供前端使用

### 前端

- **Vanilla JavaScript**: 无框架，保持轻量
- **Fetch API**: 加载 JSON 数据
- **Intersection Observer**: 实现滚动动画（已有）

### 数据流

```
Notion 数据库
  ↓ (GitHub Actions 定时触发)
sync_coffee_data.py (Python)
  ↓ (生成 JSON)
coffee_data/ 目录
  ├── beans.json
  ├── cafes.json
  ├── notes.json
  └── equipment.json
  ↓ (JavaScript 加载)
前端页面动态渲染
```

---

## 性能考虑

### 优化建议

1. **图片优化**:
   - 当前使用外部图片链接
   - 建议: 添加懒加载
   - 考虑: 使用 Cloudflare Images CDN

2. **数据缓存**:
   - JSON 文件可以被 CDN 缓存
   - 浏览器缓存策略

3. **首屏加载**:
   - 统计数据和预览卡异步加载
   - 先显示骨架屏

---

## 参考资源

### 项目内参考

- `sync_notion.py`: 博客同步逻辑
- `scripts/search.js`: 搜索功能实现
- `visual-design.html`: 设计系统展示

### 外部参考

- Notion API 文档
- Neo-Brutalism 设计趋势
- 咖啡类网站设计参考

---

## 前端重构方案 (Phase 2)

### 核心问题

**当前导航路径**:
```
用户想看 KD-310GB 咖啡机详情
↓
coffee.html (主页)
↓ 点击"我的器具"或卡片区
coffee-equipment.html (器具列表)
↓ 点击 KD-310GB 卡片
coffee-equipment-kd310gb.html (详情页)
━━━━━━━━━━━━━━━━━━━━
需要 3 次点击
```

### 设计方案对比

#### 方案 A: Tab 标签页单页设计 ⭐ 推荐

**结构**:
```html
<!-- coffee.html -->
<header>
  <h1>咖啡角</h1>
  <div class="stats">4 器具 · 2 豆子 · 1 探店 · 3 日记</div>
</header>

<nav class="coffee-tabs">
  <button class="tab-btn active" data-tab="equipment">器具</button>
  <button class="tab-btn" data-tab="beans">豆子</button>
  <button class="tab-btn" data-tab="cafes">探店</button>
  <button class="tab-btn" data-tab="notes">日记</button>
</nav>

<main>
  <section id="equipment" class="tab-content active">
    <!-- 所有器具卡片，点击可展开详情 -->
    <div class="equipment-card" data-expandable>
      <img src="kd310gb.jpg">
      <h3>KD-310GB</h3>
      <p>...</p>
      <div class="details" hidden>
        <!-- 展开后显示的详情 -->
      </div>
    </div>
  </section>

  <section id="beans" class="tab-content" hidden>
    <!-- 豆子网格 -->
  </section>

  <section id="cafes" class="tab-content" hidden>
    <!-- 探店网格 -->
  </section>

  <section id="notes" class="tab-content" hidden>
    <!-- 日记时间线 -->
  </section>
</main>
```

**交互流程**:
```
用户想看 KD-310GB 咖啡机详情
↓
coffee.html 已加载
↓ 点击 [器具] 标签
器具区域显示
↓ 点击 KD-310GB 卡片
卡片展开显示详情（无需跳转）
━━━━━━━━━━━━━━━━━━━━
需要 0-2 次点击
```

**优点**:
- ✅ 最少点击次数
- ✅ 单页面，无刷新
- ✅ SEO 友好（内容都在 HTML 中）
- ✅ 实现简单（~50 行 JavaScript）

**缺点**:
- ⚠️ 首屏内容较多
- ⚠️ 需要合并现有 HTML 内容

---

#### 方案 B: 手风琴折叠设计

**结构**:
```html
<!-- coffee.html -->
<section class="accordion-section">
  <button class="accordion-header">
    <h2>器具收藏</h2>
    <span class="icon">▼</span>
  </button>
  <div class="accordion-content">
    <!-- 器具卡片 -->
  </div>
</section>

<section class="accordion-section">
  <button class="accordion-header">
    <h2>豆子档案</h2>
    <span class="icon">▼</span>
  </button>
  <div class="accordion-content">
    <!-- 豆子卡片 -->
  </div>
</section>
<!-- ... 更多折叠区块 -->
```

**优点**:
- ✅ 渐进式信息展示
- ✅ 移动端友好
- ✅ 视觉层次清晰

**缺点**:
- ⚠️ 需要滚动查找内容
- ⚠️ 折叠/展开动画可能影响性能

---

### 技术实现建议

#### JavaScript 实现方案 A（Tab 切换）

```javascript
// 简单的 Tab 切换逻辑
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // 隐藏所有内容
    document.querySelectorAll('.tab-content').forEach(el => {
      el.hidden = true;
      el.classList.remove('active');
    });

    // 显示目标内容
    const targetId = btn.dataset.tab;
    document.getElementById(targetId).hidden = false;
    document.getElementById(targetId).classList.add('active');

    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
    });
    btn.classList.add('active');
  });
});

// 详情展开/收起
document.querySelectorAll('[data-expandable]').forEach(card => {
  card.addEventListener('click', () => {
    const details = card.querySelector('.details');
    details.hidden = !details.hidden;
  });
});
```

#### 内容合并策略

**选项 1: 完全合并**
- 删除 equipment/beans/cafes/notes 独立页面
- 所有内容合并到 coffee.html
- 简化维护

**选项 2: 保留原页面**
- 保留独立页面作为备用
- coffee.html 包含所有内容
- 可以链接到独立页面

---

### 推荐实施路径

**阶段 1: 原型验证** (1-2 小时)
1. 复制 coffee.html 为 coffee-v2.html
2. 实现基础 Tab 切换
3. 合并一个模块内容（如器具）
4. 本地测试

**阶段 2: 全面实现** (2-3 小时)
1. 合并所有模块内容
2. 实现详情展开功能
3. 优化样式和动画
4. 响应式适配

**阶段 3: 测试优化** (1 小时)
1. 跨浏览器测试
2. 移动端测试
3. 性能优化
4. 用户体验调整

---

## 下一步研究

1. [x] 深入研究 sync_notion.py 的实现细节 ✅
2. [x] 确认 Notion 集成已完善 ✅
3. [ ] 确定最终设计方案（方案 A 或 B）
4. [ ] 绘制详细线框图
5. [ ] 开始实现原型
