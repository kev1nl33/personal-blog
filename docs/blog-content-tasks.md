# 计划李博客：内容优化任务清单

> 站点：https://aikevin.dpdns.org/
> 范围：仅「内容」部分（分类、标签、系列、首页精选、摘要、风险与隐私、订阅互动）。UI 与导航另行处理。
> 基于 2026-10-28 对首页和文章列表页的审阅（共 40 篇文章）。

---

## 执行约定（给执行者：Claude Code / Grok PM 通读）

- [x] **先摸清现状**：确认文章元数据现在存在哪里（每个 HTML 的 `<head>`、一个 JSON/JS 索引，还是生成脚本）。下面的字段名按现有结构调整，**不要硬套**。
- [x] 一个任务一个 commit，使用约定式提交：`feat:` 新功能、`refactor:` 重构分类、`fix:` 修标点、`docs:` 文案、`chore:` 杂项。
- [x] 除非任务明确要求，**不修改文章正文**。
- [x] 标注 **【需 Kevin 确认】** 的任务，先给出改动清单，等确认后再动手。
- [x] 每个阶段结束后本地预览一遍，确认列表页、首页、文章页都没有断链。

---

## 阶段 1：分类、字段、标签、首页（约半天）

### 1.1 给每篇文章加元数据字段

- [x] 为所有文章增加以下字段：

```yaml
category: 职业转型      # 见 1.2
series: 人生体验券      # 可空，见 阶段 2
series_order: 4         # 可空
type: essay             # essay | note | cheatsheet
featured: false         # 精选见 1.5
lang: zh                # zh | en
updated: 2026-10-28     # 可空
```

- [x] 验收：40 篇全部有 `category`、`type`、`lang`。

### 1.2 分类重整：旧 5 类 → 新 6 类

目前「个人成长」22/40，是杂物筐。按下表重新归类（文件名均为 `.html`）。

**职业转型（7）**

- [x] `borrowed-uniform`
- [x] `resignation-decision-process`
- [x] `career-transition`
- [x] `freelance-first-year`
- [x] `gcdf-certification-guide`
- [x] `2025_Year_Report`
- [x] `experience-ticket-5-family-farm-and-reality-check`

**AI 与工具（13）**

- [x] `experience-ticket-1-two-weeks-of-magic-and-confusion`
- [x] `experience-ticket-2-from-77-posts-to-banned-account`
- [x] `experience-ticket-3-toutiao-automation-daydream`
- [x] `seventy-posts-dead-silence`
- [x] `ai-tools-without-illusions`
- [x] `chatgpt-vs-claude-communication`
- [x] `vision-pro-office-experience`
- [x] `claude-skills-deep-dive`
- [x] `ai-subscriptions-review`
- [x] `knowledge-management-evolution`
- [x] `breaking-decision-paralysis-with-ai`
- [x] `ai-career-tools`
- [x] `conventional-commits-cheatsheet`（`type: cheatsheet`）

**投资（4）**

- [x] `experience-ticket-6-stock-operator-mental-lab`
- [x] `from-contempt-to-kline`
- [x] `fable-mr-wei-kitchen`
- [x] `tech-stock-analysis`

**自我认知（10）**

- [x] `experience-ticket-4-thirty-days-of-honest-writing`
- [x] `escape-mode-and-shiny-objects`
- [x] `parking-lot-three-minutes`
- [x] `five-iron-rules-naval`
- [x] `npc-principle`
- [x] `living-in-the-moment`
- [x] `energy-like-tokens`（`lang: en`）
- [x] `why-prenatal-app-succeeded`
- [x] `Product-thinking`
- [x] `turning-32-mid-tier-reboot`

**家庭与生活（4）**

- [x] `she-arrived`
- [x] `name-explain`
- [x] `cycling-weight-loss-journey`
- [x] `minimalism-digital-life`

**读书笔记（2）**

- [x] `the-courage-to-be-disliked-reading-notes`
- [x] `overcoming-instincts`

- [x] 同步更新：文章列表页顶部的分类筛选（含计数）、首页「关注」区链接 `?category=` 的取值、各文章页上显示的分类名。
- [x] 验收：6 类合计 40 篇；旧分类名在站内不再出现；`blog.html?category=...` 全部可用。
- 可选未做：「AI 与工具」可加子标签「自媒体实验」，容纳体验券 1/2/3 和 70 篇帖子、被封号两篇。

### 1.3 标签从 60+ 收敛到约 10 个

- [x] 按下表合并，旧标签全部替换，不保留一次性标签。

| 保留标签 | 合并进来的旧标签 |
|---|---|
| AI 工具 | AI、AI应用、AI工具、Claude、Gemini、AI写作反思、AI全自动、Vibe Coding、人机协作 |
| 开发工具 | Git、Conventional Commits、开发工具 |
| 投资 | 投资思考、美股投资、AI投资、K线、交易心理、全职炒股、硬件产业链、瓶颈链式传导 |
| 自媒体 | 小红书、今日头条、封号、流量变现、内容创作、自媒体、真实写作、真实连接 |
| 身份与转型 | 身份认同、身份重建、体制内、辞职、自由职业、职业发展 |
| 自我觉察 | 自我觉察、自我管理、逃跑模式、逃避模式、三分钟热度、情绪管理、精神带宽、斯多葛、去神话 |
| 决策与方法 | 决策系统、产品思维、人生铁律、创造力、认知升级、纳瓦尔、Dan Koe |
| 家庭 | 原生家庭、家族生意 |
| 一人公司 | 一人公司 |
| 商业认知 | 商业认知、商业寓言、养殖场 |

- [x] **移除**（不再当标签）：`人生体验券`（改为系列，见阶段 2）、`32岁`、`中登`、`生活体感`、`生活结构感`、`老魏的后厨`、`个人成长`。
- [x] 每篇文章保留 **1–3 个标签**。
- [x] 文章列表页默认只显示前 8 个标签，其余折叠到「更多」。
- [x] 验收：全站标签数 ≤ 12；没有只出现一次的标签。

### 1.4 首页「最近的思考」只显示 essay

- [x] 首页列表按 `type: essay` 过滤，速查和笔记不再占首页位置。
- [x] 为 `type: cheatsheet / note` 的内容在文章列表页提供筛选，或放在「笔记」入口。
- [x] 验收：首页最近 4 篇中不出现 `conventional-commits-cheatsheet`。

### 1.5 首页新增「从这里开始」精选区

- [x] 置顶 4–5 篇（`featured: true`），在「最近的思考」上方：

1. `borrowed-uniform`：身份与转型，入口最柔和
2. `seventy-posts-dead-silence`：最容易引起共鸣
3. `experience-ticket-1-two-weeks-of-magic-and-confusion`：引向体验券系列页
4. `fable-mr-wei-kitchen`：叙事型，展示写作的另一面
5. （可选）`five-iron-rules-naval`：方法总结

- [x] 每篇附一句 20 字内的「为什么先读这篇」。
- [x] 验收：首页首屏之后第一个内容区是精选，而不是最新文章。

---

## 阶段 2：两个系列页（约半天）

### 2.1 系列：人生体验券

- [x] 新建 `series/experience-tickets.html`（或按站点现有路径习惯）。
- [x] 顶部写 100 字左右的说明：什么是体验券、为什么做、规则是什么。
- [x] 按顺序列出：

| 编号 | 文件 | 日期 |
|---|---|---|
| 1 | `experience-ticket-1-two-weeks-of-magic-and-confusion` | 2026-04-11 |
| 2 | `experience-ticket-2-from-77-posts-to-banned-account` | 2026-04-20 |
| 3 | `experience-ticket-3-toutiao-automation-daydream` | 2026-05-02 |
| 4 | `experience-ticket-4-thirty-days-of-honest-writing` | 2026-05-30 |
| 5 | `experience-ticket-5-family-farm-and-reality-check` | 2026-06-20 |
| 6 | `experience-ticket-6-stock-operator-mental-lab` | 2026-08-22 |

- [x] 「番外」区：`seventy-posts-dead-silence`（05-08）、`ai-tools-without-illusions`（05-20）、`five-iron-rules-naval`（06-05）。
- [x] 为 1–6 号文章的元数据设置 `series: 人生体验券` 和 `series_order`。
- [x] 每篇体验券文末加「上一张 / 下一张」导航，首尾篇各去掉一侧。
- [x] 每篇开头加统一信息框：周期、投入、一句话结果、给生活打分 X/10（6 号沿用 8/10，前 5 号按确认写「待补」，待 Kevin 补分）。
- [x] 首页「关注」区或精选区加该系列入口。
- [x] 验收：从系列页可一路点击 1→6，且每篇都能回到系列页。

### 2.2 系列：离开体制

- [x] 新建 `series/leaving-the-system.html`，按时间顺序：
  `resignation-decision-process` → `career-transition` → `freelance-first-year` → `2025_Year_Report` → `borrowed-uniform`
- [x] 同样设置 `series` / `series_order` 并添加文末上一篇/下一篇。
- [x] 验收：同 2.1。

---

## 阶段 3：摘要、标点、过时提示、重叠内容（约 1 天）

### 3.1 重写以「…」结尾的摘要（11 篇）

- [x] 公式：**场景 → 困惑 → 结论**，两句话以内，不留省略号。
- [x] 范例（来自你自己的好摘要）：
  「一辆横在入口的车让我闷气了三分钟。我问自己：用今天的注意力支付一笔零回报的账单，值不值？」
- [x] 涉及文章：
  - [x] `Product-thinking`
  - [x] `npc-principle`
  - [x] `overcoming-instincts`
  - [x] `minimalism-digital-life`
  - [x] `resignation-decision-process`
  - [x] `career-transition`
  - [x] `freelance-first-year`
  - [x] `ai-career-tools`
  - [x] `living-in-the-moment`
  - [x] `tech-stock-analysis`
  - [x] `ai-subscriptions-review`
- [x] 流程：读取正文 → 出草稿  → 写入。
- [x] 验收：全站摘要无「…」「...」结尾。

### 3.2 全角标点修正

- [x] 先列出命中位置，再按本轮授权修正明确的自然语言标点，避免误伤代码块：

```bash
grep -nP '[\x{4e00}-\x{9fff}][,:?!][\x{4e00}-\x{9fff}A-Za-z]' *.html
```

- [x] 已知涉及：`chatgpt-vs-claude-communication`、`vision-pro-office-experience`、`claude-skills-deep-dive`、`breaking-decision-paralysis-with-ai`、`Product-thinking`（标题或摘要里的半角 `, : ?`）。
- [x] 验收：标题和摘要中，汉字后不再跟半角标点；代码块内容不变。

### 3.3 AI 工具类文章加「写于」提示

- [x] 在以下文章文首加一行：「写于 2025-11，工具和功能可能已变化。」
  - [x] `chatgpt-vs-claude-communication`
  - [x] `vision-pro-office-experience`
  - [x] `claude-skills-deep-dive`
  - [x] `ai-subscriptions-review`
  - [x] `knowledge-management-evolution`
  - [x] `breaking-decision-paralysis-with-ai`
  - [x] `ai-career-tools`
- [ ] 【可选，本轮不做】Kevin 有时间时，在文末补一段「2026-10 更新」。

### 3.4 合并重叠内容

- [x] **胎教程序两篇**：保留新版 `why-prenatal-app-succeeded` 为主。在旧版 `Product-thinking` 文首加一句「更完整的版本见《为什么我做胎教程序能做完，其他十个商业项目全停了？》」并链接；
- [x] **体制内三篇**（`resignation-decision-process`、`career-transition`、`2025_Year_Report`）：已通过系列页串联，各自文首加一句角度说明，避免读者觉得重复。

### 3.5 英文文章

- [x] `energy-like-tokens`：文首加两三句中文概述，`lang: en`；已补 Tw93 公开博客链接；未定位对应原帖，交付说明记录此限制。

---

## 阶段 4：首页文案与 meta（约 1 小时）

- [ ] 首页大标题最小改动：「探索未来认真过好每一天。」→「探索未来，认真过好每一天。」
- [ ] 备选（**【需 Kevin 选择】**）：
  - 「离开体制之后，我在重新学习怎么生活。」
  - 「一个前部委青年的生活实验。」
- [ ] 首页 `meta description` 改为：
  「离开部委后的第二年：做过十个项目，只做完一个。这里记录职业转型、AI 实验、炒股复盘，和女儿出生后的日常。」
- [ ] 每篇文章的 `meta description` 使用该文摘要，不再全站一致。
- [ ] 移除全站相同的 `meta keywords`。
- [ ] 每篇文章配自己的 `og:image`（没有封面时用统一的品牌图，不再全站都用新加坡照片）。
- [ ] 验收：随机抽 5 篇，检查分享预览的标题、描述、图片互不相同。

---

## 阶段 5：风险与隐私（约 1 小时，含确认）

### 5.1 投资声明

- [ ] 「投资」分类的 4 篇文章页脚统一加：
  「本文为个人记录与思考，不构成投资建议。市场有风险，决策请自行负责。」

### 5.2 隐私线 **【需 Kevin 确认后再改】**

- [ ] **女儿**：站内统一使用「小满」，列出所有出现学名的位置（`name-explain` 标题与摘要、其他文章正文），Kevin 决定是否去掉。【不需要去掉】
- [ ] **家族与地域**：检查 `experience-ticket-5-family-farm-and-reality-check`、`fable-mr-wei-kitchen` 正文是否出现具体酒店、养殖场名称或所在旗县，必要时模糊化。【模糊】
- [ ] **账户盈亏**：确定是只写「亏损」还是保留具体金额。【亏损】
- [ ] 流程：执行者先输出「命中位置清单」，Kevin 逐项选择保留或修改。

---

## 阶段 6：订阅与互动（零碎时间）

- [ ] **RSS**：用脚本从文章元数据生成 `feed.xml`（标题、摘要、日期、链接），在 `<head>` 加 `<link rel="alternate" type="application/rss+xml">`，页脚加入口。
- [ ] **给我写信**：在关于页和文章页尾加邮箱入口，文案：「读完如果有共鸣，欢迎回信，告诉我你的版本。」**【需 Kevin 提供邮箱】**【kevinlee19951002@gmail.com】
- [ ] **「最近在做」**：页面改成固定三行结构 **在做 / 在读 / 在想**，页首标注更新日期，并在首页加一个小入口。
- [ ] 评论系统暂缓。读者稳定后再选 Twikoo 或 Waline（对中文读者门槛比 Giscus 低）。
- [ ] 验收：`feed.xml` 能被阅读器订阅；每篇文章末尾都有回信入口。

---

## 最终验收清单

- [x] 40 篇文章都有 `category`、`type`、`lang`，分类共 6 个。
- [x] 全站标签数 ≤ 12。
- [x] 首页：精选区 → 最近的思考（仅 essay）→ 关注 → 作者。
- [ ] 两个系列页上线，首尾可串联。
- [x] 无省略号摘要；标题和摘要无半角标点混用。
- [ ] 投资文章页脚有声明；隐私清单已由 Kevin 确认。
- [ ] RSS 可用；回信入口上线。
- [ ] 站内无死链（本地用链接检查脚本或手动抽查）。

---

## 进度记录

| 阶段 | 状态 | 完成日期 | 备注 |
|---|---|---|---|
| 1 分类、字段、标签、首页 | 完成 | 2026-10-28 | 40 篇、6 类、10 标签；可选子标签未做 |
| 2 系列页 | 完成（本地） | 2026-10-28 | 两系列、11篇导航、体验券信息框；1–5号评分待 Kevin 补；未部署 |
| 3 摘要、标点、提示、合并 | 完成（本地） | 2026-10-28 | 11 篇摘要、标点、7 篇时效提示、阅读角度及英文概述；Tw93 原帖未定位，已链接作者博客并在交付说明注明；未部署 |
| 4 首页文案与 meta | ☐ | | |
| 5 风险与隐私 | ☐ | | |
| 6 订阅与互动 | ☐ | | |
