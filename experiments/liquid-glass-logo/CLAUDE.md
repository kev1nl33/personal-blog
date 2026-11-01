# Liquid Glass Logo 实验约定

## 设计与边界

用独立 Vite 包把 React、ReactDOM 与 ReactDrops 组件编译为浏览器静态资源。index.html 是本地预览入口，只加载 dist 中的产物。页面使用站内 favicon 的透明底变体 logo.svg（仅移除底色以适配 alpha 轮廓渲染），保留米白背景、黑色硬边框和橙色；玻璃效果仅限实验 Canvas，作为本目录的视觉规范例外。

## 结构

- src/main.jsx：React 小岛、动态偏好监听、静态降级及重播按钮。
- src/page.css：只用于本实验的页面样式。
- src/nav.jsx：首页顶栏品牌位的第二个小岛；跟随站点 `data-theme` 与 `prefers-reduced-motion`，深色主题换用 logo-dark.svg。
- src/nav.css：顶栏品牌位布局（桌面 34px / ≤540px 28px），随 nav 入口编译进 dist/liquid-logo-nav.css。
- logo-dark.svg：深色主题描边变体，取 styles/main.css 深色 --paper/--ink 值；logo.svg 保持浅色版。
- vendor/reactdrops/：站点 registry 导出的原始组件文件与 LICENSE.txt；不混入自写代码。保留原始英文注释和许可。
- dist/：可静态服务的构建产物，提交进 Git；不要手工修改。liquid-logo.js / .css 供本预览页，liquid-logo-nav.js / .css 供首页顶栏。
- package.json / package-lock.json / vite.config.js / vite.nav.config.js：独立安装及构建；build 依次产出两套 bundle，nav 配置 emptyOutDir=false 以保留主产物。
- README.md：源码出处、预览与维护步骤。
- node_modules/：不提交，可随时删除；重建用 npm ci。

## 实现和验收计划

1. 保存 https://reactdrops.dev/r/liquid-glass-logo.json 的四个组件文件，保留许可；使用 ../../assets/favicon.svg，不使用演示商标。
2. 构建相对路径 ESM bundle，页面挂载 #liquid-logo；默认播放，可重播，maxDpr 限为 1.5。
3. prefers-reduced-motion 首次加载和运行中变化都切换为静态 img；无 WebGL2 使用组件原有静态回退；无 JavaScript 保留 HTML 图片。
4. npm run build；运行站点已有测试和验证；浏览器验证 Canvas 就绪、重播、移动尺寸、减少动态效果和无 WebGL2 降级。
5. 提交实现，再写根目录 result.md 记录该实现提交 SHA、路径、预览、体积与限制，并提交文档。最终 tip 由 git rev-parse 回报；文档不自引用其自身提交 SHA。

## 清理

首页（根目录 index.html）顶栏引用了 dist/liquid-logo-nav.js / .css 与 logo.svg、logo-dark.svg。删除本实验前，先移除首页里的 link/script、#nav-liquid-logo 标记位与相关文案提交；其余正式页面和根依赖不受影响。不运行旧模板，不生成站点索引。
