# Liquid Glass Logo 本地实验

独立 React 小岛，用 Canvas / WebGL2 播放 ReactDrops 的液态玻璃 Logo。正式首页、文章页、根依赖与部署流程均不接入本实验。

## 打开预览

构建产物已经提交，无需安装依赖。在仓库根目录执行：

```bash
cd /tmp/blog-liquid-glass-logo
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 http://127.0.0.1:8000/experiments/liquid-glass-logo/ 。需要 HTTP 服务，不能直接双击 HTML。

重新构建时，在仓库根目录执行：

```bash
npm --prefix experiments/liquid-glass-logo ci
npm --prefix experiments/liquid-glass-logo run build
```

预览始终使用上述仓库根目录静态服务器。Vite 只负责将 src/main.jsx 及依赖编译到 dist/；页面不需要 Node 或 Next 运行时。

## 来源与改动

- 组件页：https://reactdrops.dev/components/text-reveal/liquid-glass-logo
- 实际导出：https://reactdrops.dev/r/liquid-glass-logo.json
- 许可：https://reactdrops.dev/license.txt
- 获取日期：2026-11-01
- 完整 ReactDrops Component License 1.0 保存在 vendor/reactdrops/LICENSE.txt，各组件文件保留许可头。该许可不是 MIT：允许集成为成品网站，限制作为可复用组件、模板、源码包再次分发。
- React、ReactDOM、Scheduler 的完整 MIT 许可与版权声明保存在 THIRD-PARTY-NOTICES.txt，构建 JS 另外保留上游 legal comments。
- 上游仅两处适配：移除 TSX 的 `use client`（本实验纯浏览器运行）；移除 renderer 默认的演示商标图，改用博客 favicon。
- logo.svg 源自站内 assets/favicon.svg，仅移除米白底矩形，保留原有方框和圆点。组件按 alpha 轮廓制作玻璃纹理，直接用不透明 favicon 会形成实心方块。未使用第三方演示商标。

## 动态效果与限制

- 默认只播放一次，按钮可重播；maxDpr=1.5 限制高分屏的像素开销。
- 首次加载和运行中切换 `prefers-reduced-motion: reduce` 都直接显示静态 img，不保留 Canvas。
- WebGL2 不可用时使用上游组件的静态图片降级；禁用 JavaScript 时 HTML 仍显示原 favicon。
- 组件会将图案轮廓统一染色，当前动画最终为黑色方框与圆点，静态降级仍保留橙色。
- 需要支持 ES modules、WebGL2 的现代浏览器；低端设备运行片元着色器可能掉帧。
- JS 约 383 kB，gzip 约 94 kB；CSS 约 7 kB，gzip 约 3 kB。仅本页加载。

## 已执行验证

- 实验构建通过；独立依赖 npm audit 为 0 漏洞。
- 根项目 npm run build 通过；构建生成的公共 CSS 已还原，正式路径无改动。原锁文件 npm audit 另有 1 项 moderate（postcss-selector-parser），属于既有根开发依赖，本实验未改动。
- 站点测试：47 项 Python、62 项 Node 全部通过；validate_site.py：52 个受管页面，0 错误。
- 浏览器：Canvas ready=true，重播后 WebGL drawArrays 从 222 增至 274，再增至 440，确认持续绘制。
- 390px 移动端动画和静态模式均无横向溢出；减少动态效果首次加载与实时切换均为 0 Canvas。
- 模拟 WebGL2 不可用时 fallback img 加载成功，控制台无 error / warn。

删除本目录即可移除实验；experiments/CLAUDE.md 可随最后一个实验一并删除。node_modules 不提交、可随时清理。
