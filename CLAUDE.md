# 项目开发指南

这是直接维护 HTML、CSS 和原生 JavaScript 的个人博客。根目录 HTML 是页面内容和结构的维护来源，已发布 URL 保持稳定。

## 本地开发

```bash
python3 -m http.server 8000
npm run build
npm test
python3 validate_site.py
python3 generate_search_index.py
python3 generate_sitemap.py
```

默认构建只编译 CSS。直接修改页面后更新相关列表、搜索索引与站点地图，并检查导航、筛选、图片和响应式布局。

styles/ 保存样式，scripts/ 保存浏览器交互。templates/、data/ 和 site_builder.py 保留为既有参考与可选本地渲染工具，不作为当前页面的默认维护流程。不要用旧模板或缓存覆盖手工修改的 HTML。

页面保持语义化结构、完整 SEO 标签、图片 alt 和可访问的键盘交互。设计沿用黑色硬边框、米白背景和橙色重点色。更多规范见 AGENTS.md。
