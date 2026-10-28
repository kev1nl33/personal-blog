# 上线前复核（2026-10-28）

## 0. 一句话结论 + PR 链接

仅执行 A1、A2：A1 已完成全文类型检查，未检出疑似密钥，但存在私有/本地 IP 与域名配置类型信息；A2 已按运行引用口径复核，将九个无运行引用的非 HTML 文件成组归档，并仅排除 archived/legacy-root/；三个 HTML 保留。未推送、未创建 PR、未获取预览地址。

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

## 2. 任务完成表

| 编号 | 任务 | 状态（✅/⚠️部分/❌） | 对应 commit | 备注 |
| --- | --- | --- | --- | --- |
| A1 | 八个诊断文件及部署、收录规则检查 | ✅ | e6dbb74 | 只记录文件名和类型 |
| A2 | 引用判断及根目录清理 | ✅ | b5dd46a（九个移动）；本次 fix 提交（排除规则与复核记录，以 Git 历史为准） | 6a0db15 为先前审计；本次修正引用口径并落实归档，HTML 全部保留 |

B–E 不在本次授权范围内，未执行。

## 3. 我替你做的决定（每项写：做了什么 / 为什么 / 如何回退）

- 只新增本复核记录，不修改八个诊断文件内容：避免泄露值或突破 HTML、保护目录边界；回退 A1 提交即可移除记录。
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

- 三个有运行引用的 HTML 保留，公开范围由站长后续评估；九个非 HTML 的归档及精确排除已落实，无需等待确认。
- `name-explain` 的名字与 AGENTS.md 的公开邮箱属于说明书已列提示，本次未审计或修改。

## 5. 内容改动对照（B2 的旧 → 新摘要，B1 加了提示的文章清单）

不适用：B1、B2 未执行，无页面内容改动。

## 6. 验证结果

A1、A2 两次阶段末均实测：`npm test` 退出码 0（Python 40 项、Node 52 项，A2 Node 失败数 0）；`python3 validate_site.py` 退出码 0；`python3 generate_search_index.py --check` 退出码 0，索引已是最新，共 53 页。未重建或修改索引。上述结果来自 A2 修正前，不能视为归档后验证结果。本次修正按协调要求不运行测试，主线程修改 B 阶段后统一验证；仅检查暂存文件范围及移动内容是否一致。原有未跟踪说明书不纳入提交。

全站 HTTP 链接检查与视觉验证：未做，本次仅执行 A1、A2，不据此声称站点可上线。

## 7. 我没能验证的事

- 线上实际部署产物、历史泄露与搜索引擎实际收录情况未验证。
- 无法从类型扫描保证没有未知格式、编码或无标签凭据；未将任何原始内容输出到日志或文档。
- 已执行 git fetch；远程 main 包含说明书要求的体验券评分提交，当前保持用户指定的 polish/pre-launch 分支，不重建分支、不改写历史。
- 本地检查脚本首次细化查询遇到语法错误，已修正并成功完成；错误未包含文件内容。

## 8. 上线步骤（给站长）

本次没有上线操作。先完成并复核后续阶段，再创建 PR、获取真实预览地址，检查首页、文章列表、体验券、系列页和 404，以及手机布局；获准后按项目上线流程部署，并抽查线上 URL。当前审计不能替代上线验收。
