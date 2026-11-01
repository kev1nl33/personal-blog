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
