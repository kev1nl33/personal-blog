# W45 预览小补丁：手机「回到顶部」遮挡正文

## 1. 根因

右下角固定按钮 `.back-to-top` 由 `styles/main.css` 定义：`position:fixed; bottom:24px; right:24px; width:44px; height:44px`；手机断点（`max-width:540px`）里改为 `right:16px; bottom:16px`。`scripts/main.js` 在 `scrollY >= 500` 时显示该按钮。390px 宽手机上正文列宽 350px，按钮固定在视口右下角，滚动阅读时必然盖住正文末行右侧约 44px。

## 2. 改动文件

- `styles/main.css`（4 行新增，1 个媒体查询）
- `result.md`（本报告，单独的 docs 提交）

未改动任何 HTML、正文、图片路径、caption 或脚本。

## 3. 采用的方案

小屏隐藏浮动按钮，桌面行为完全不变：

```css
/* 手机阅读：固定「回到顶部」会盖住正文末行，小屏隐藏；桌面保持原样。 */
@media (max-width:540px){
  .back-to-top{display:none}
}
```

选择隐藏而非挪位/缩小：按钮是视口固定元素，正文在 390px 下几乎占满宽度，任何固定悬浮位置都会在滚动途中盖住某一行；缩小到可用尺寸以下又会损害点击目标。手机端本身有系统级回到顶部手势，且不改动全站布局体系，符合最小补丁目标。

## 4. 札记列表点击验证

- 本地 `python3 -m http.server` 启动站点，390×844（mobile/touch 仿真）与 1280×800 下均由 `weekly.html` 普通点击 W45 列表项，页面正常导航至 `weekly-2026-w45.html`，标题、正文、三张插图与 caption 均正常。
- 未发现覆盖层或不可点击问题；列表项是普通 `<a href="weekly-2026-w45.html">`，与目标页均返回 HTTP 200。
- 因此**未对列表/导航做任何修改**。此前自动化点击超时未能复现为真实缺陷，判断为自动化等待时机问题（首访时 `scripts/motion.js` 会短暂注入全屏 `.opening-curtain`，且页面为平滑滚动），不足以认定 bug。

## 5. commit

- `a286cde` — fix(styles): hide mobile back-to-top so it stops covering article text
- 本报告另有独立 docs 提交（见 `git log -1 --oneline`）
- 基线 tip：`9f56ebe`（开工时 HEAD 与预期一致）

## 6. 自测摘要

**390×844（mobile/touch）**
- 滚到正文中段：`.back-to-top` 计算样式 `display:none`、尺寸 0×0，正文末行完整可见，无遮挡；截图确认文字、插图、caption 清晰。
- 滚到页面底部：按钮仍隐藏，页脚与相关阅读完整可读。
- `documentElement.scrollWidth === innerWidth`（无横向溢出），正文列宽 350px。

**1280×800（桌面）**
- 滚到 1200px：按钮 `display:block`，44×44，位于右下（x=1212, y=732），行为与改动前一致。
- 真实点击按钮后 `scrollY` 回到 0，回到顶部功能可用。

**校验**
- `npm test`：Python 48 项 + Node.js 62 项全部通过（exit 0）。
- `python3 validate_site.py`：52 个管理页面，0 错误。
- `git diff --check`：无问题；工作区最终干净。

## 7. 边界确认

- 未 push、未 merge main、未 rebase、未 force-push、未部署、未开 PR。
- 未改 Obsidian、私密内容、notify 配置；未删图；未改 W45 正文措辞。
