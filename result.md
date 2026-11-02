# 顶栏品牌位审美打磨

- 基线：21c8926；分支 experiment/liquid-glass-home；**未 push / 未开 PR / 未上线**。
- 新 tip：见 `git log -1`（本提交）。

## 改了什么
- **光学对齐**：负外边距抵消画布留白，可见轮廓贴齐容器左缘。几何中线已对齐后，标记右下的实心圆仍让人感到不在一条线上；按老板对比图选 A，标记整体下移 3px（桌面、移动同步），视觉中线以老板目测为准。对比图 `/tmp/lg-shots/compare.png`。
- **橙色方点**：原 `▪` 字形受 flex gap、margin 和字形侧距叠加影响，漂在字标右侧约 12px，且垂直居中而不是落在基线上。首页顶栏改为空 span 绘制的 5px 方块，紧随「n」（约 0.1em），底边落在基线（误差 ≤0.5px）。页脚不变。
- **间距**：标记画布右缘与字标起点重合（不再用负右边距，避免 liquid 画布压住「A」）；可见间隙约 12px（≈0.48em），移动约 9px（≈0.38em）。方点距「n」0.1em。
- **尺寸**：未调整。可见轮廓约 27.5px，大写字高约 19px，约 1.45–1.5×；画布 DPR 逻辑未动。
- 文件：`experiments/liquid-glass-logo/src/nav.css`、重建的 `dist/liquid-logo-nav.css`、`index.html`（顶栏方点改为空 span，资源版本升到 liquid-nav-5）。

## 验证
- 系统 Chrome（headless，DPR 2）测试了 1280 浅色、1280 深色、390 浅色 + reduced-motion 三种情况：无横向溢出，汉堡按钮不被挤压，控制台无报错。
- `npm test`：62 通过，0 失败；`python3 validate_site.py`：52 页，0 错误。
- 复核：启用 SwiftShader 后 headless 也渲染 WebGL 画布，确认画布右缘 = 文字左缘（1280：144/144，390：55/55），「A」无遮挡；截图 `/tmp/lg-shots/fix-1280.png`、`fix-390.png`。
- 截图（仓库外）：`/tmp/lg-shots/final-1280-light.png`、`final-1280-dark.png`、`final-390-light.png`；改前为 `before-*.png`。

## 预览
cd /tmp/blog-liquid-glass-home && python3 -m http.server 8010 --bind 127.0.0.1 → http://127.0.0.1:8010/index.html
