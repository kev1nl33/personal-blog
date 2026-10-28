# 博客上线前收尾：一次性工作说明书（给 Grok bot PM）

> 仓库：`kev1nl33/personal-blog`（站点 https://aikevin.dpdns.org/，Cloudflare Pages 静态站）
> 日期基准：2026-10-28
>
> **读完本文后请直接开工，全程不要向站长提问或等待确认。** 站长只在最后一步（上线前检查）介入。
> 本说明书里每一个模糊点都已经给出默认做法；遇到本文没覆盖的情况，选最保守的做法，并记入复核文档。

---

## 0. 你要交付什么、做到哪里停

**终点**：一个**未合并**的 Pull Request + 一份复核文档 `docs/qa/pre-launch-review-2026-10-28.md`。站长打开它们就能完成上线前检查。

**必须遵守的边界**

- 所有改动在分支 `polish/pre-launch`，从最新 `main` 切出。**不要合并，不要直接推 `main`，不要触发生产部署。**
- 不重命名、不删除任何已发布的 HTML 文件，已发布 URL 保持不变；`_redirects` 不动。
- 不改这些内容：`functions/`、`wrangler.toml`、任何密钥或环境变量、`second-brain` 相关、`gallery/` 数据、`projects/` 页面内容、`templates/`、`data/`、`site_builder.py`、`coffee*.html` 的正文、游记页的分享图。
- 不改文章正文，**以下列出的例外除外**：任务 B1 的文首提示。
- 不引入新依赖，不引入新的 CSS 框架。沿用 Neo-Brutalism 设计变量（`styles/main.css` 的变量）。
- 不重写 git 历史。

**不要等待回复。** 任一任务重试两次仍失败：跳过，在复核文档里标 ❌ 并写明原因，继续下一项。

---

## 1. 开工前（必做）

1. `git fetch`，确认 `main` 包含提交「fix: fill confirmed life scores for experience tickets 1-5」；若 `main` 比这更新，以最新为准。
2. 通读 `AGENTS.md`、`CLAUDE.md`、`README.md`。**其中的约定优先于本文**，尤其是：
   - 文章元数据用 `<meta property="article:*">`，**不加 frontmatter**
   - 分类固定为 6 个：职业转型（career）、AI 与工具（ai）、投资（investment）、自我认知（personal）、家庭与生活（life）、读书笔记（reading）
   - canonical 与 sitemap 用无 `.html` 地址；搜索索引保留实际 `.html` 路径
   - 文章 og:image 用自己的封面，没有则用 `https://aikevin.dpdns.org/assets/readme/cover.png`；游记页的分享图保留
   - 已决定：**不做 RSS**，评论系统暂缓
3. 记下可用命令（来自 AGENTS.md）：

```bash
python3 -m http.server 8000
npm run build          # 仅当新增了 Tailwind 工具类时
npm test
python3 validate_site.py
python3 generate_search_index.py        # 改动页面后重建
python3 generate_search_index.py --check
python3 generate_sitemap.py             # 不要手工删除 sitemap 里的 /projects/ 条目
```

4. 建分支：`git checkout -b polish/pre-launch`。每个任务一个 commit，使用约定式提交（`fix:` `feat:` `docs:` `refactor:` `chore:`）。

---

## 2. 任务清单（按顺序执行）

### 阶段 A：安全与泄露检查（最先做，优先级最高）

**A1. 根目录诊断文件检查**
以下文件在仓库根目录，站点是静态站且根目录就是构建输出，它们**可能被公开访问**：
`api_domain_diagnostic.py`、`api_domain_diagnostic_report.json`、`network_diagnostics.py`、`network_diagnostic_report.json`、`opencode_update_summary.txt`、`test.html`、`article1.html`、`coffee-backup-20260109.html`。

- [ ] 读取每个文件，判断是否含有：API key / token / 密码、内网或私有 IP、账户或域名配置细节、个人隐私。
- [ ] 查看 `.assetsignore`、`_redirects`、`robots.txt`，判断这些文件当前是否会被部署和被搜索引擎收录。
- [ ] 结果写在复核文档**最顶部**。若发现疑似密钥，**只写文件名和类型，不要把密钥内容复制进任何文档或提交信息**，并建议站长轮换该密钥（历史记录里仍存在，你不要改写历史）。

**A2. 清理根目录杂物（仅当 A1 完成后）**

- [ ] 对 A1 列表里的文件，以及 `task_plan.md`、`findings.md`、`progress.md`、`Coffee_redesign.md`，先全仓搜索引用（HTML、`sitemap.xml`、`search-index.json`、`service-worker.js`、`tests/`、`scripts/`、`generate_*.py`、`validate_site.py`、`_redirects`）。
- [ ] **没有任何引用，且不在 sitemap / 站内链接中的**，用 `git mv` 移到 `archived/legacy-root/`。
- [ ] 有引用或在 sitemap 里的（尤其 `article1.html`、`test.html`），**不要移动**，列入复核文档。
- [ ] 确认 `archived/` 不会被部署或收录：按 `.assetsignore` 现有写法加入 `archived/`；若 `archived/` 已有被引用的内容，不要影响它们。
- [ ] 验收：`npm test`、`python3 validate_site.py` 仍通过。

---

### 阶段 B：内容与元数据缺口

**B1. 「写于」提示**
下列 7 篇文章写于 2025-11 前后，先检查文首是否已有「写于 2025-11…」提示：
`chatgpt-vs-claude-communication`、`vision-pro-office-experience`、`claude-skills-deep-dive`、`ai-subscriptions-review`、`knowledge-management-evolution`、`breaking-decision-paralysis-with-ai`、`ai-career-tools`。

- [ ] 缺少的，在 `article-content` 最前面加一行：「写于 2025-11，工具和功能可能已变化。」
- [ ] 样式：先在 `styles/article.css` 里找已有的提示块样式并复用；没有就加一个最小的 `.article-note`（只用 `--reading-*` 与品牌变量，一像素黑边框，无阴影动画）。
- [ ] `ai-career-tools` 写于 2025-02，文案改为「写于 2025-02，…」；`ai-subscriptions-review` 与 `claude-skills-deep-dive` 实际写于 2025-11-05，用 2025-11。以每篇的 `article:published_time` 为准。

**B2. 过短的旧摘要重写**
以下文章的摘要仍然是 1–2 句、偏概括的旧写法。**逐篇读完正文**，按「场景 → 困惑 → 结论」重写，两句话以内，保留第一人称，**不得编造正文里没有的事实**：
`chatgpt-vs-claude-communication`、`vision-pro-office-experience`、`claude-skills-deep-dive`、`cycling-weight-loss-journey`、`knowledge-management-evolution`、`breaking-decision-paralysis-with-ai`、`gcdf-certification-guide`、`the-courage-to-be-disliked-reading-notes`。

- [ ] 同步更新：`<meta name="description">`、`og:description`、`.article-deck`、`blog.html` 里对应卡片的 `blog-card-excerpt`；然后重建搜索索引。
- [ ] 每篇的「旧 → 新」写入复核文档，供站长抽查。单独一个 commit，方便整体回退。

**B3. 引号与标点统一**

- [ ] 标题和摘要里的 ASCII 直引号 `"…"`（如 `living-in-the-moment` 的标题「从"目标驱动"到"活在当下"」）改为 `「…」`，与站内其他标题一致。涉及 `<title>`、`og:title`、`<h1>`、`blog.html` 卡片、搜索索引。
- [ ] 运行下面命令，只替换标题/摘要里**汉字后的半角** `, : ? !`，代码块、URL、英文句子不动：

```bash
grep -nP '[\x{4e00}-\x{9fff}][,:?!][\x{4e00}-\x{9fff}A-Za-z]' *.html
```

**B4. 全量元数据审计（40 篇）**
写一个**临时**审计脚本放在 `/tmp`（不提交），逐篇检查并把异常写进复核文档：

- 有 `article:section`、`article:type`、`article:lang`、`article:featured`、`article:tag`（1–3 个，且都属于 `blog.html` 里那 10 个标签）
- 无 `meta keywords`；`description` 与 `og:description` 一致且等于摘要
- `og:image` 不是新加坡照片（游记页除外）
- `canonical` 与 `og:url` 为无 `.html` 地址，且与文件名一致
- 文末有回信入口；「投资」分类 4 篇有投资声明
- `blog.html` 卡片的 `data-category`、`data-tags`、`data-type` 与文章自身元数据一致
- 体验券 1–6 号有统一信息框，无分数的写「待补」
- 系列成员有 `article:series` / `article:series_order`，有上一篇/下一篇，首尾无缺

能自动修的直接修；需要判断内容的，记录不修。

---

### 阶段 C：搜索与分享缺口

**C1. 非文章页的 meta**

- [ ] `blog.html`：`description` 与 `og:description` 里仍写着旧分类「职业发展、AI应用、投资思考、个人成长、读书笔记」，改为：「按主题与关键词浏览计划李的文章：职业转型、AI 与工具、投资、自我认知、家庭与生活、读书笔记。」
- [ ] `blog.html`、`series/experience-tickets.html`、`series/leaving-the-system.html`：`og:image` 当前是新加坡旅行照片，改为 `https://aikevin.dpdns.org/assets/readme/cover.png`。
- [ ] 全站扫描非游记页是否还有同样的新加坡 `og:image`（`index.html`、`about.html`、`now.html`、`visual-design.html`、`travel.html` 等）：游记页（`travel-*.html`）保留；**`coffee*.html` 元数据独立维护，不动**；其余统一改为品牌图。
- [ ] 两个系列页移除 `meta keywords`（"人生体验券，计划李，系列" 属于通用关键词）。

**C2. 导航状态错误**

- [ ] 系列页页脚的「最近在做」链接带了 `aria-current="page"`，但当前页是系列页。全站 grep `aria-current` 在页脚里的使用，**只有 `now.html` 自己的页脚链接可以带**，其余去掉。
- [ ] `series/leaving-the-system.html` 未核对过，做同样检查（页面结构、上一篇/下一篇、成员顺序：`resignation-decision-process` → `career-transition` → `freelance-first-year` → `2025_Year_Report` → `borrowed-uniform`）。

**C3. 重建与校验**

- [ ] `python3 generate_search_index.py`，然后 `--check` 确认退出码为 0。
- [ ] `python3 generate_sitemap.py`（遵守 AGENTS.md 里关于 `/projects/` 条目和 `lastmod` 的规则）。
- [ ] `npm test`、`python3 validate_site.py` 全部通过。

---

### 阶段 D：导航与列表界面（做成独立 commit，便于站长整体回退）

> 这一阶段含设计判断。**直接按下面的默认方案做**，每一项单独 commit，commit 信息以 `ui:` 开头，并在复核文档里写明「如何回退」。

**D1. 主导航 8 项 → 6 项**
现有：首页、文章、认知武器、咖啡角、看世界、回忆录、第二大脑、关于。

- [ ] 去掉「首页」项（左上角 logo 已链到首页，且已有 `aria-label`）。
- [ ] 去掉「回忆录」项，**先**在 `travel.html` 加一个明显的入口链接到 `gallery.html`（回忆录目前以待整理状态展示，不应占主导航）。`gallery.html` 页面里，导航高亮「看世界」。
- [ ] 最终顺序：文章、认知武器、咖啡角、看世界、第二大脑、关于。
- [ ] 用脚本批量替换所有包含 `id="site-menu"` 的页面（根目录、`series/`、`projects/` 中使用共享导航的页面、`404.html`）。**`templates/` 不改。** 替换后逐页确认 `aria-current` 仍然正确；移动端菜单（`nav-toggle`）行为不变。
- [ ] 若某类页面（如 `coffee*.html`、`projects/`）有自己独立的导航写法，保持原样，在复核文档里列出。

**D2. 卡片只留一个链接，箭头语义统一**
`blog.html`、`index.html` 的文章卡片目前既有标题链接，又有「阅读全文 ↗」链接，指向同一页，且站内链接用了外链箭头。

- [ ] 标题链接保留；用 CSS 的「拉伸链接」方式（伪元素覆盖整张卡片）让整张卡片可点。
- [ ] 卡片底部的「阅读全文 ↗」改为不可聚焦的装饰文字 `<span aria-hidden="true">阅读全文 →</span>`，不再是第二个链接；同步删除多余的 `aria-label`。
- [ ] 全站 grep `↗`：站内链接改为 `→`，外链（`target="_blank"` 或绝对外部地址）保留 `↗`。
- [ ] 检查 `scripts/blog.js` 及其他脚本是否依赖原来的锚点结构；`tests/` 里相关测试要同步更新并通过。键盘焦点样式（`:focus-visible`）必须仍然可见。

**D3. 文章列表按年份分组（尽力而为）**

- [ ] 在 `blog.html` 列表中增加年份分隔标题（2026 / 2025），由 `blog.js` 在应用筛选/搜索后控制：某年没有可见卡片时，隐藏该年份标题；无结果空状态沿用现有 `#searchEmpty`。
- [ ] 若实现会破坏现有筛选、搜索、`tests/` 测试，或在窄屏下影响布局：**回退这一项**，在复核文档里写明原因即可，不要卡住后续任务。

---

### 阶段 E：文档与仓库整洁

**E1. README**

- [ ] 「阅读入口」表里文章入口的分类描述改为新 6 类：职业转型、AI 与工具、投资、自我认知、家庭与生活、读书笔记。
- [ ] 其余内容不动。

**E2. AGENTS.md**

- [ ] 删除与当前流程冲突的旧内容：Python 规范里基于 `requests.post` / 外部 API 错误处理的示例（Notion 流水线时期遗留）。**先**确认 README 所说「仓库里没有 Notion 或其他内容发布管线」属实，再删。
- [ ] 「常见问题」里引用 `node scripts/image-optimizer.js`：先确认该文件是否存在，不存在则删除这条或改写为实际存在的脚本。
- [ ] 把末尾的「最后更新」改为 2026-10-28。
- [ ] 加一条规则：新增导航项或改动主导航须同步更新所有共享导航页（引用 D1 的做法）。
- [ ] 其余已有规则一字不改。

---

## 3. 站长已有决定（不要改动）

- **`name-explain` 一文**保留原样（标题与摘要里有女儿的名字，这是起名记录本身的内容，URL 不可改）。只在复核文档里列为「站长自行决定」。
- **不做 RSS**；评论系统暂缓。
- **不要新增独立的「精选」页面**；首页精选区已经存在。

---

## 4. 全程验证（每个阶段结束后跑一次，最后再完整跑一次）

```bash
npm test
python3 validate_site.py
python3 generate_search_index.py --check
```

另外用临时脚本（放 `/tmp`，不提交）做一次全站检查，结果写进复核文档：

- 本地起 `python3 -m http.server 8000`，抓取所有 HTML，检查站内链接和本地资源（CSS/JS/图片）全部返回 200
- 每页有且只有一个 `<h1>`、有 `canonical`、有 `description`
- 无新增的重复 `meta keywords`
- 导航项在所有共享导航页里一致，且当前页有且只有一个 `aria-current`

如果环境里有无头浏览器（如 Playwright），在 390px 和 1280px 两个宽度对 `index`、`blog`、一篇文章、一个系列页、`now`、`404` 截图，保存到**仓库之外**的目录（AGENTS.md 约定验收截图不进仓库），并在复核文档里写明路径。没有浏览器就写「未做视觉验证」。

---

## 5. 收尾：提交、PR、复核文档

1. 推送分支 `polish/pre-launch`，开一个**草稿 PR**（base: `main`），标题：`chore: pre-launch polish (meta, nav, cards, docs)`。PR 描述粘贴复核文档的「结论」和「站长需要看的 5 件事」。
2. 若 Cloudflare Pages 为该分支生成了预览地址，写进复核文档；**不要猜地址**，拿不到就写「未获取预览地址」。
3. 写 `docs/qa/pre-launch-review-2026-10-28.md`，结构固定如下：

```
# 上线前复核（2026-10-28）

## 0. 一句话结论 + PR 链接

## 1. 最高优先级：安全检查结果（任务 A1）

## 2. 任务完成表
| 编号 | 任务 | 状态（✅/⚠️部分/❌） | 对应 commit | 备注 |

## 3. 我替你做的决定（每项写：做了什么 / 为什么 / 如何回退）
- 导航 8→6、卡片单链接、年份分组、B2 摘要改写 等

## 4. 需要你拍板的事
- name-explain 里的名字
- AGENTS.md 中明文邮箱（站点 mailto 本来公开，仅作提示）
- 任何被我标记为「有引用，没移动」的文件
- 其他我无法判断的内容

## 5. 内容改动对照（B2 的旧 → 新摘要，B1 加了提示的文章清单）

## 6. 验证结果
- npm test / validate_site / search-index --check 的结果
- 全站链接检查结果
- 视觉验证：做了 / 未做

## 7. 我没能验证的事

## 8. 上线步骤（给站长）
1. 打开 PR 与预览地址，看这 5 个页面：首页、文章列表、一篇体验券、系列页、404
2. 在手机宽度下看导航和文章列表
3. 对不满意的项，让我按「如何回退」那一栏回退对应 commit
4. 合并 PR，等待 Cloudflare Pages 部署
5. 线上抽查 5 个 URL：首页、blog、series/experience-tickets、now、任意一篇文章（含分享预览）
```

4. **最终回复（发给站长）不超过 12 行**：PR 链接、复核文档路径、完成/未完成数量、最高优先级发现（A1 结果）、需要站长拍板的事项数量。如实报告，没做完的不写成做完，没验证的不写成已验证。
