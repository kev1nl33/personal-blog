# 上线前复核（2026-10-28）

## 0. 一句话结论 + PR 链接

A→E 已执行，16 项任务中 15 项完成、1 项部分完成；92 项单元测试及受管页面校验通过，当前根页面与系列页的 254 个静态地址全部返回 200，可进入站长上线前复核；受保护旧页面、历史资料、线上动态资源仍有验证边界，尚未上线。

PR：[草稿 PR #31](https://github.com/kev1nl33/personal-blog/pull/31)。预览：未获取预览地址；已观察到 Cloudflare Pages 分支检查正在执行，仅有控制台链接，不将其当作可访问预览。分支 `polish/pre-launch`，基线 `origin/main=e307604`，未合并 main、未推 main、未执行部署。

### 站长需要看的 5 件事

1. 九个诊断和历史文件已归档并精确排除部署，未检出疑似密钥；已发布版本及 Git 历史中的公开情况仍需关注。
2. 打开首页、文章列表、一篇体验券、系列页、404，并在手机宽度检查导航、整卡点击及年份筛选。
3. 八篇新摘要见第 5 节；七篇文首提示按发布时间校正，正文其余内容保持不变。
4. `name-explain` 保留原样、公开邮箱及三个保留的旧 HTML 是否继续公开，共 3 项拍板事项见第 4 节。
5. 仅在满意后按项目上线流程合并；D1、D2、D3 可分别回退。已有旧资料异常与动态资源未验证范围见第 6、7 节。

## 1. 最高优先级：安全检查结果（任务 A1）


使用本地 Python 脚本完整读取八个文件，所有匹配值、原始行和内容片段均不输出；Python/JSON 诊断文件另做全文结构解析。以下只记录文件名与类型，不保存任何疑似敏感值。类型检测不能证明文件绝对不存在秘密，未运行诊断脚本或访问其外部服务。

| 文件名 | 检出类型 |
| --- | --- |
| api_domain_diagnostic.py | 未检出所查敏感类型 |
| api_domain_diagnostic_report.json | 私有/本地 IP |
| network_diagnostics.py | 私有/本地 IP；域名/网络服务配置 |
| network_diagnostic_report.json | 未检出所查敏感类型 |
| opencode_update_summary.txt | 未检出所查敏感类型 |
| test.html | 域名/网络服务配置 |
| article1.html | 域名/网络服务配置 |
| coffee-backup-20260109.html | 域名/网络服务配置 |

部署判断（A1 原始状态）：当时 `.assetsignore` 只排除本地环境与状态文件，未排除这八个文件；根目录为静态构建输出，它们可能随部署公开。A2 修正后，五个非 HTML 诊断文件已移入精确排除的 `archived/legacy-root/`；三个 HTML 仍保留原位，可能公开。`_redirects` 没有针对它们的规则；未修改该文件。

收录判断：`robots.txt` 允许根目录抓取，仅限制脚本目录及 JSON URL。两个 JSON 报告受到抓取限制，但 robots 不是访问控制，也不能保证 URL 不被索引。其他六个文件没有对应禁止规则。三个 HTML 均无 noindex，且未出现在当前 sitemap 或搜索索引；未收录不等于不可公开访问。

未检出疑似密钥值，因此没有已确认需要轮换的凭据；若后续人工发现疑似密钥，应轮换相应密钥，历史记录仍然存在，不改写 Git 历史。


归档后：含网络信息的两个诊断脚本及其报告现位于 `archived/legacy-root/`，该目录加入 `.assetsignore`。已有线上部署和 Git 历史不会因本分支归档而消失。三个 HTML 按边界保留，不改变公开规则。

## 2. 任务完成表

| 编号 | 任务 | 状态（✅/⚠️部分/❌） | 对应 commit | 备注 |
| --- | --- | --- | --- | --- |
| A1 | 八个诊断文件与部署、收录规则 | ✅ | e6dbb74 | 未检出疑似密钥，存在私有/本地 IP 与网络配置类型 |
| A2 | 引用检查与根目录归档 | ✅ | 6a0db15、b5dd46a、434b6fe | 九个非 HTML 归档；三个 HTML 保留；仅排除新归档目录 |
| B1 | 文首「写于」提示 | ✅ | b5dd46a | 七篇原有提示统一样式；两篇月份校正 |
| B2 | 八篇摘要改写 | ✅ | 24c0bf2 | description、OG、deck、列表、索引同步 |
| B3 | 标题摘要标点 | ✅ | 46b7f56、113e4a9 | living-in-the-moment 引号修正；其余标题摘要未发现指定标点问题 |
| B4 | 四十篇元数据审计 | ✅ | 2263ae2 | 删除两篇 keywords，修正一篇 URL；系列及体验券已有测试核对 |
| C1 | 非文章页 meta | ✅ | 50b19cf | 共享页品牌图、列表六类描述、系列 keywords |
| C2 | 页脚与系列导航 | ✅ | c5130b9 | 非 now 页脚清除错误状态；离开体制五篇顺序和首尾通过测试 |
| C3 | 索引和地图 | ✅ | 6cfdeeb、e4b380d、113e4a9 | 53 个索引条目、166 个地图条目，保留 108 个 projects 条目 |
| D1 | 主导航 8→6 | ⚠️部分 | d2cd272、e4b380d | 53 个页面同步，name-explain、coffee 与 projects 按边界保留，独立导航不改 |
| D2 | 卡片单链接与箭头 | ✅ | 463a3ba | 首页及列表只保留标题链接；可见键盘焦点、整卡点击实测通过 |
| D3 | 按年份分组 | ✅ | 8e21c27 | 2026/2025；筛选、搜索后自动隐藏无结果年份 |
| E1 | README 分类描述 | ✅ | e9a4306 | 仅阅读入口一处改为六类 |
| E2 | AGENTS 过期示例 | ✅ | 7363844 | 无 Notion 发布管线；删除外部 API 示例；图片脚本实际存在故保留；更新日期与导航规则 |
| QA | 最终全站检查与修复 | ✅ | e4b380d、113e4a9 | 404 canonical、首页 logo 状态、标题引号和 sitemap 日期 |
| 交付 | 复核、摘要、推送与草稿 PR | ✅ | f8b66d6 及交付链接提交 | 分支已推送，草稿 PR #31 已创建，base=main，未合并 |

完成数量按 A1 到 E2 的 14 项业务任务加 QA、交付，共 16 项；15 项完成、1 项部分完成、0 项失败，部分项不等于全站一致。

## 3. 我替你做的决定（每项写：做了什么 / 为什么 / 如何回退）

- D1：文章、认知武器、咖啡角、看世界、第二大脑、关于六项；先在 travel 加回忆录入口，gallery 高亮看世界，系列高亮文章。首页用 logo 标记当前页。原因是去掉重复入口，让主导航留给主要阅读目标。回退：`git revert d2cd272`，并按需恢复 e4b380d 的首页 logo 标记；保留 404 canonical。咖啡页虽部分使用 site-menu，但「不改正文/独立导航」与保守边界优先，整类保持不变；projects 不改内容；name-explain 全文件不改。now 的当前页仍在页脚；404 没有对应导航项，不捏造 aria-current。
- D2：卡片保留标题锚点，以伪元素扩大点击区域，底部改为隐藏于辅助技术的装饰文字；站内箭头改 →、外链保留 ↗。原因是减少键盘重复停靠，并让箭头与链接去向一致。回退：`git revert 463a3ba`。没有脚本依赖底部链接，既有测试不需修改；真实浏览器补验焦点和卡片空白处点击。
- D3：保持现有卡片顺序，在年份变化处插入跨列标题，筛选后按可见卡片决定标题显隐。原因是长列表需要时间定位；不另建列表或改变筛选 URL。回退：`git revert 8e21c27`。
- B2：依据逐篇全文，把旧摘要改为最多两句的第一人称场景、困惑与结论，同步四处界面和索引。回退：`git revert 24c0bf2` 后重建搜索索引。
- B1：七篇已有提示，未重复添加；都使用最小 article-note，月份以 published_time 为准，其中 breaking-decision-paralysis-with-ai 为 2025-10、ai-career-tools 为 2025-02。原因是说明书列举月份与页面实际发布时间不一致，采用明确的日期来源。回退时只恢复七篇提示和 styles/article.css，并重建索引，不整体回退混合提交 b5dd46a。
- 最终检查补充 404 canonical；保留 noindex、不加入 sitemap。未使用新 Tailwind 工具类，所以不运行无关 CSS 构建，不引入依赖。

- 新目录结构约定（先于目录创建及移动）：`archived/legacy-root/` 仅保存本轮确认无运行引用的根目录非 HTML 历史文件，保留原文件名；诊断脚本及对应输出同目录成组存放，不修改内容。该目录精确排除出静态部署，不放新页面或生产资源；后续仅在重新检查运行引用后归档，删除或恢复须另行明确授权，不自动清理。既有 `archived/html/`、`archived/scripts/`、`archived/styles/` 保持原规则。

A2 引用判断（修正）：说明书和审计文档中的任务提及不构成运行引用。按指定范围扫描全部 HTML、sitemap.xml、search-index.json、service-worker.js、tests/、scripts/、根目录 generate_*.py、validate_site.py、_redirects；使用完整文件名边界匹配，仅输出引用文件名，不输出原始行。诊断脚本与输出之间的引用按成组归档处理；历史计划文件之间的文档提及不作为运行依赖。

| 候选文件 | 运行引用来源 | 处置 |
| --- | --- | --- |
| api_domain_diagnostic.py | 无 | 与输出成组 git mv 至 archived/legacy-root/ |
| api_domain_diagnostic_report.json | 指定运行范围无引用；诊断脚本有输出文件名引用 | 与脚本同目录归档 |
| network_diagnostics.py | 无 | 与输出成组 git mv 至 archived/legacy-root/ |
| network_diagnostic_report.json | 指定运行范围无引用；诊断脚本有输出文件名引用 | 与脚本同目录归档 |
| opencode_update_summary.txt | 无 | git mv 至 archived/legacy-root/ |
| test.html | generate_search_index.py、generate_sitemap.py、tests/test_theme.py | 有运行引用且 HTML 硬边界，保留 |
| article1.html | generate_search_index.py、generate_sitemap.py、tests/test_theme.py | 有运行引用且 HTML 硬边界，保留 |
| coffee-backup-20260109.html | tests/test_theme.py | 有运行引用且 HTML 硬边界，保留 |
| task_plan.md | 无 | git mv 至 archived/legacy-root/ |
| findings.md | 无 | git mv 至 archived/legacy-root/ |
| progress.md | 无 | git mv 至 archived/legacy-root/ |
| Coffee_redesign.md | 无 | git mv 至 archived/legacy-root/ |

三个 HTML 均不在当前 sitemap 和搜索索引；这不改变禁止移动任何 HTML 的硬边界。此前将任务文档提及算作运行引用、以既有归档互链阻止精确排除的判断已在本次修正。

归档排除判断：仅在 `.assetsignore` 加入 `archived/legacy-root/`，保留既有 `archived/html/` 及其链接目标的部署规则。新目录九个文件保留内容和文件名，诊断脚本及输出位于同一目录；不运行历史诊断脚本。排除部署不等于清除历史泄露或撤回既有线上内容。

做了什么：使用 git mv 归档九个无运行引用的非 HTML 文件并精确排除新目录。为什么：移除根目录历史杂物及诊断公开风险，同时保护现有资源路径。提交归属：共享暂存区发生并发提交，九个移动实际进入主线程的 b5dd46a，本次 fix 只提交排除规则、结构约定及复核记录，不重写历史或重复移动。如何回退：须分别恢复九个原路径并撤销本次精确排除规则；不要整体回退 b5dd46a，因为它同时包含主线程 B1 改动。本 A2 操作没有改动任何 HTML、保护目录或 `_redirects`。



## 4. 需要你拍板的事

共 3 项，均不阻塞本次草稿 PR 交付：

1. `name-explain.html` 中女儿名字：遵照已有决定保留原样，本次不修改标题、摘要、URL 或导航，由站长自行决定未来公开范围。
2. AGENTS.md 的明文邮箱：站点 mailto 本来公开，本次保留，只提醒公开范围。
3. `test.html`、`article1.html`、`coffee-backup-20260109.html`：有运行/测试引用，且禁止移动已发布 HTML，本次原路径保留；是否以后单独处理其公开访问与历史结构问题，由站长决定。

RSS 不做、评论暂缓、不新增精选页均按已有决定执行，不重复请求决策。

## 5. 内容改动对照（B2 的旧 → 新摘要，B1 加了提示的文章清单）

七篇均已有提示，本次没有重复添加：chatgpt-vs-claude-communication（2025-11）、vision-pro-office-experience（2025-11）、claude-skills-deep-dive（2025-11）、ai-subscriptions-review（2025-11）、knowledge-management-evolution（2025-11）、breaking-decision-paralysis-with-ai（2025-10，原为 2025-11）、ai-career-tools（2025-02，原为 2025-11）。七篇统一 article-note 样式。

### chatgpt-vs-claude-communication.html

- 旧：实际使用中发现ChatGPT过于礼貌冗长，而Claude更简洁直接。分享如何优化AI助手的沟通风格。
- 新：同时使用 ChatGPT 和 Claude 后，我发现客套话会淹没答案，也开始琢磨怎样让 AI 更直接地沟通。我尝试自定义指令，并按任务选择工具，让沟通风格服务于自己的工作习惯。

### vision-pro-office-experience.html

- 旧：租用Vision Pro一个月的真实体验。硬件完美但软件生态不足，虚拟键盘显示等问题待解决。
- 新：为了试试多块虚拟大屏能否改善自由职业的办公体验，我租用了一个月 Vision Pro，却被键盘显示、佩戴疲劳和应用不足打断工作。我觉得它适合阅读和多窗口研究，但还不能替代传统电脑，先租后买更稳妥。

### claude-skills-deep-dive.html

- 旧：探索Claude Skills功能，将专业知识打包成可复用的技能包，提升AI协作效率。
- 新：做职业咨询时，我总要向 AI 重复解释方法、背景和流程，于是把 GCDF 方法论与咨询步骤整理成一个 Skill。我发现把专业框架、示例和边界交代清楚，比每次从头说明更省力，也更容易复用。

### cycling-weight-loss-journey.html

- 旧：通过坚持骑行，我在几个月内减重近20磅。这不仅是身体的改变，更是意志力和习惯养成的过程。
- 新：久坐影响健康后，我选择从轻松骑行开始，想看看怎样才能把运动坚持下来。五个月配合饮食和作息调整，我减重近 20 磅，也发现固定时间、循序渐进比硬靠意志力更管用。

### knowledge-management-evolution.html

- 旧：曾经沉迷于复杂的Notion系统，最终发现简单的Flomo更适合日常记录。工具不在于功能强大，而在于是否真正使用。
- 新：我曾花大量时间搭建 Notion 知识系统，却因分类纠结和维护负担很少使用。换用 Flomo 随手记录、再用 Notion 整理后，我发现降低记录门槛比追求系统完美更重要。

### breaking-decision-paralysis-with-ai.html

- 旧：拥有多个方向和想法，却难以开始行动？分享用AI工具快速原型化想法，打破行动障碍。
- 新：离开体制后，我想做咨询、开发工具和写作，却总被选择太多与完美主义卡住。借助 AI 列选题、搭原型后，我开始从可交付的小成果出发，用反馈决定下一步，而不是等计划完美再行动。

### gcdf-certification-guide.html

- 旧：获得GCDF证书后，我为6-7位前同事提供了职业转型咨询。这段经历让我理解了专业职业规划的价值和方法论。
- 新：为了系统学习职业规划，我考取 GCDF，并在获证后为前同事提供转型、简历和面试咨询。实践让我看清，证书只是起点，把 GROW 模型、优势识别和自己的经验结合起来，才能形成真正能用的咨询方法。

### the-courage-to-be-disliked-reading-notes.html

- 旧：这本书帮助我理解了课题分离、个人价值与幸福的真谛。分享我在辞职、生活决策中的实践与思考。
- 新：辞职前后，我反复读《被讨厌的勇气》，试着分清自己的选择与亲友的评价由谁负责。我从课题分离和帮助他人的实践中理解了勇气：自己承担结果，也自己决定价值。

## 6. 验证结果

- A 阶段原始两轮、B、C、D、E 及最终验证都运行 npm test、validate_site、索引 --check。A2 归档修正后的验证由主线程随 B 和后续阶段统一完成。最终 npm test：Python 40 项、Node 52 项，全部通过；validate_site：52 个受管页面、0 错误；索引：53 页，--check 退出码 0。
- 四十篇临时审计：必需属性、标签、摘要一致性、品牌图、canonical/og:url、回信、投资声明、列表元数据、体验券框与系列入口无异常。既有系列测试验证 11 篇成员顺序、prev/next 首尾及六张体验券分数。与基线逐篇比较 article-content，排除七篇 B1 提示后无任何差异。
- sitemap：166 项，108 个 projects 项及其元数据保留；最后在 HTML 提交后重建以匹配 Git 日期，now 保留约定的 .html 例外，404 不收录。
- 当前根目录与 series：66 个 HTML，254 个静态 HTML/资源/链接地址全部 HTTP 200。9 项历史结构异常：四个 coffee 器具页缺 description；coffee-backup 缺 canonical；article1 与 test 各缺 canonical、description。按 HTML 保留及 coffee 边界不修改。
- 全仓扩展检查：191 个 HTML（包括 archived、templates、projects），421 个地址，低并发重跑后 132 个失败地址；主要属于模板相对链接和旧归档资源，完整列表在仓库外 verify/site-check.json。全仓 151 个结构异常，未将受保护/历史文件伪称为通过；无重复 meta keywords。
- 共享主导航 53 页六项顺序一致，当前标记语义按页面校验。例外：name-explain 与五个 coffee 共享导航仍为旧八项；index 当前在 logo，now 当前在页脚，404 没有可标为当前的主导航项；独立导航及 projects 不动。临时机械检查仅统计 menu 内标记，会把上述首页/now/404 也列出，人工按语义复核保留。
- 视觉验证：已做，390px、1280px，index、blog、一篇体验券、experience-tickets 系列、now、404 共 12 张完整截图；目视核对列表两宽度首屏，未见横向溢出。浏览器实测分类/标签/类型组合、空状态、年份标题显隐、搜索参数恢复、浏览器后退、移动端菜单、卡片空白点击及键盘焦点边框通过。
- 截图目录：`/Users/liran/cc-tasks/blog-polish/screenshots/`；验证日志：`/Users/liran/cc-tasks/blog-polish/verify/`。临时脚本 `/tmp/blog-polish-audit.py`、`/tmp/blog-polish-site-check.py`、`/tmp/blog-polish-published-check.py`、`/tmp/blog-polish-browser.cjs` 不提交，无新依赖。
- 独立只读代码复核已完成，指出标题引号、地图日期与旧复核文档；前两项已由 113e4a9 修复，文档已整份更新。git diff --check 通过。未触碰保护目录、_redirects、coffee 正文、name-explain、游记分享图；没有删除/重命名 HTML。

## 7. 我没能验证的事

- 未获取预览地址；Cloudflare Pages 真实产物和生产部署未操作，也未验证生产线上变化。
- 453 个动态路径由 /media、/api、/second-brain 服务提供，python 静态服务器不能代表它们的线上行为。未调用受保护接口，未验证 R2 原图/WebP 是否全部可用。
- 全仓模板、归档、受保护旧页面未达全站零异常，详见第 6 节；没有为追求检查全绿突破边界。
- 安全类型检查无法排除未知编码或无标签凭据；没有访问外部诊断服务，没有审查 Git 全历史泄露或搜索引擎实际索引。
- 缓存浏览器可用，首次按默认驱动版本启动失败后改用已有可执行文件，不安装依赖。浏览器脚本曾因选择器过宽、错误预期搜索数量、程序化焦点与未滚入视口发生失败，均修正测试脚本后实际通过，未据失败日志宣称产品通过。
- 每任务独立提交有一处偏离：A2 的九个移动被并行共享暂存区带进 B1 的 b5dd46a；已停止并行 Git 操作，不重写历史。复核记录明确回退范围。D 阶段仍各自独立 ui 提交。

## 8. 上线步骤（给站长）

1. 打开 PR 与预览地址（当前未获取），看首页、文章列表、一篇体验券、系列页、404；没有预览时可先本地查看截图与页面。
2. 在手机宽度下看导航和文章列表，并核对第 4 节三个公开范围事项。
3. 对不满意的项按第 3 节回退对应提交，重新生成索引并验证。
4. 按 docs/RELEASE.md 由站长完成书面复核和上线审批，再合并 PR，等待 Cloudflare Pages 部署；本任务不会代为合并或生产部署。
5. 线上抽查首页、blog、series/experience-tickets、now、任意一篇文章，含分享预览。
