# Liquid Glass Logo 本地试跑结果

## 分支与提交

- 分支：experiment/liquid-glass-logo
- 实现 tip SHA：d988447（完整实验及静态构建产物）。
- 本 result.md 随后作为第 2 个文档提交；最终分支 tip 用 `git rev-parse --short HEAD` 查询，交付回复另行回报。避免文档自引用自身提交 SHA。
- 未 push、未合并 main、未部署、未操作 Cloudflare。正式页面和根 package 文件无改动。

## 修改路径

- experiments/CLAUDE.md：实验目录规则。
- experiments/liquid-glass-logo/CLAUDE.md：本实验结构、边界与实施计划。
- experiments/liquid-glass-logo/index.html：静态预览页和 #liquid-logo 入口。
- experiments/liquid-glass-logo/logo.svg：站内 favicon 的透明底变体。
- experiments/liquid-glass-logo/src/main.jsx：React 挂载、重播、实时减少动态效果降级。
- experiments/liquid-glass-logo/src/page.css：实验独立样式。
- experiments/liquid-glass-logo/vendor/reactdrops/：组件 TSX、renderer、shaders、CSS、完整 LICENSE.txt。
- experiments/liquid-glass-logo/THIRD-PARTY-NOTICES.txt：React、ReactDOM、Scheduler 的完整 MIT 许可。
- experiments/liquid-glass-logo/package.json、package-lock.json、vite.config.js、.gitignore：独立构建依赖与配置。
- experiments/liquid-glass-logo/dist/liquid-logo.js、dist/liquid-logo.css：已提交的静态 bundle。
- experiments/liquid-glass-logo/README.md：来源、适配说明、预览与维护步骤。
- result.md：交付结果。

## 本地预览

构建产物已提交，无需 npm install。终端 cwd 为仓库根目录：

```bash
cd /tmp/blog-liquid-glass-logo
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 http://127.0.0.1:8000/experiments/liquid-glass-logo/ 。本次已启动此服务器，并用 open 打开该 URL。

若修改源码，在仓库根目录执行：

```bash
npm --prefix experiments/liquid-glass-logo ci
npm --prefix experiments/liquid-glass-logo run build
```

## 验证结果

- 实验 Vite 构建通过，独立依赖 npm audit：0 漏洞。
- npm test：47 项 Python + 62 项 Node 测试通过。
- python3 validate_site.py：52 个受管页面，0 错误。
- 根 npm run build：安装既有锁文件依赖后通过；生成的公共 utilities.css 已还原，未纳入本实验提交。
- 浏览器正常模式：data-liquid-glass-ready=true；重播后 WebGL drawArrays 从 194 增至 260；控制台无 error / warn。
- 390px 移动端：Canvas 正常挂载，无横向溢出。
- 减少动态效果：首次加载与运行中切换均为 0 Canvas、静态图片成功加载、重播禁用。
- 模拟 WebGL2 不可用：静态 fallback 图片成功加载、无横向溢出、控制台无 error / warn。
- 独立代码审查发现的 dist 忽略规则及依赖完整许可遗漏均已修正；提交清单已确认包含两份 dist 产物和许可文件。

## 已知限制

- Canvas 使用 WebGL2 片元着色器，低端设备可能掉帧；maxDpr=1.5，默认播放一次，不持续循环。
- JS 382.82 kB（gzip 94.21 kB），CSS 7.12 kB（gzip 3.12 kB）。React 仅随本实验页加载，不影响正式页面。
- 上游按 alpha 轮廓处理素材：原 favicon 的实心底色会变成方块，因此只移除了底色。当前动画的最终轮廓统一为黑色；静态图片保留橙色圆点。
- 需通过 HTTP 服务预览，不支持直接双击 HTML。现代浏览器可播放，缺少 WebGL2 时降级为静态图。
- ReactDrops Component License 1.0 限制组件、模板、源码包再分发；本次只保留在本地实验分支。
- 根项目原有开发依赖 npm audit 有 1 项 moderate：postcss-selector-parser <6.1.5；未改根依赖。Browserslist 另提示既有数据过期，不影响构建完成。

# 第二轮：接首页顶栏与品牌文案（experiment/liquid-glass-home）

## 分支与提交

- 分支：experiment/liquid-glass-home（基线 fff40a2）。
- 实现 tip SHA：df58eb1（实验 nav 产物与文档）、b80e6aa（首页接入与文案）。
- 本节文档随后作为第 3 个提交；最终分支 tip 用 `git rev-parse --short HEAD` 查询。避免文档自引用自身提交 SHA。
- 未 push、未合并 main、未部署、未操作 Cloudflare。其他页面未改动。

## 修改路径

- experiments/liquid-glass-logo/src/nav.jsx、src/nav.css：首页顶栏品牌位的第二入口，跟随站点 data-theme 与 prefers-reduced-motion。
- experiments/liquid-glass-logo/logo-dark.svg：深色主题描边变体（#ecebe4 描边 + 橙点）。
- experiments/liquid-glass-logo/vite.nav.config.js、package.json：追加构建 dist/liquid-logo-nav.js（382.67 kB，gzip 94.01 kB）与 .css（5.88 kB，gzip 2.55 kB）；nav 构建 emptyOutDir=false 保留主产物。
- experiments/liquid-glass-logo/CLAUDE.md、README.md、experiments/CLAUDE.md：结构、清理与例外说明。
- index.html：顶栏品牌位挂 #nav-liquid-logo（无 JS 时显示静态 logo.svg）并加载 nav bundle；文案按最终口径——品牌壳（nav-logo、footer-brand、© 行站名）用 AIKev1n，title/author/og:title、eyebrow「Kev1n的生活实验」、hero「认识 Kev1n」、about-strip「也叫 Kev1n」、hero-location「KEV1N'S FIELD NOTES」、© 行人名用 Kev1n；about-strip 保留「我是 Kevin」一处。无 计划李/AIKevin 残留。
- search-index.json：首页条目标题随 title 更新（2 行差异）。

## 本地预览

```bash
cd /tmp/blog-liquid-glass-home
python3 -m http.server 8010 --bind 127.0.0.1
```

打开 http://127.0.0.1:8010/index.html 。

## 验证结果

- 实验构建两套 bundle 通过；liquid-logo.js 重建后与已提交版本字节一致。
- npm test：47 项 Python + 62 项 Node 全部通过；validate_site.py：52 个受管页面，0 错误；根 npm run build 通过，utilities.css 构建噪音已还原。
- 桌面 1280px：顶栏 liquid 标记 34px，canvas data-liquid-glass-ready=true，导航/页脚文案符合口径，无溢出。
- 深色模式：切换后玻璃底色 #121210 与导航背景一致，标记为浅色 #ecebe4；themechange 实时生效。
- prefers-reduced-motion：首次加载与运行中切换均为 0 Canvas，静态图按主题选 logo.svg / logo-dark.svg。
- 390px 移动端：动画正常挂载，标记 28px，scrollWidth 恰为 390，无横向溢出。
- 全程控制台无 error / warn。

## 已知限制

- 无 JavaScript 时顶栏显示静态 logo.svg（黑色描边版）：无 JS 即无 data-theme，页面恒为浅色，因此可见；该路径未在浏览器逐项复测，依据为标记位 HTML 结构与 theme-init 同为 JS 的前提。
- WebGL2 不可用走组件内置静态图降级（素材即 logo svg），沿用第一轮已验证的组件行为，本轮未重复模拟。
- 首页为唯一接入页；其他页面导航仍是旧文案，待后续轮次统一。动画仅播放一次，顶栏不提供重播。
