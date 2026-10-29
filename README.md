<p align="center">
  <img src="assets/readme/cover.svg" alt="计划李：一个普通人的生活实验，记录职业转型、AI 应用与日常里的小发现。" width="100%">
</p>

<p align="center">
  <a href="https://aikevin.dpdns.org/"><img src="https://img.shields.io/badge/在线阅读-aikevin.dpdns.org-ff4d00?style=flat-square&amp;labelColor=0a0a0a" alt="在线阅读"></a>
</p>

<p align="center">
  <a href="#explore">从这里开始</a> · <a href="#screens">界面一览</a> · <a href="#workflow">内容如何维护</a> · <a href="#boundaries">数据边界</a> · <a href="#develop">本地运行</a>
</p>

# 计划李的生活实验

这里是 Kevin 的个人博客。离开体制之后，重新学习工作与生活，把职业转型、AI 工具的实际使用、投资思考，以及咖啡和旅行中的小发现写下来。

如果你也在探索工作与生活的新可能，可以从一篇文章开始。这个仓库直接使用 HTML、CSS 和原生 JavaScript 维护页面与阅读体验。

<a id="explore"></a>

## 从一个问题，或一杯咖啡开始

<table>
<thead><tr><th width="140">阅读入口</th><th>可以在这里做什么</th></tr></thead>
<tbody>
<tr><td><strong><a href="https://aikevin.dpdns.org/blog.html">文章</a></strong></td><td>按职业转型、AI 与工具、投资、自我认知、家庭与生活、读书笔记浏览；组合分类、标签与关键词筛选，并分享带筛选条件的链接。</td></tr>
<tr><td><strong><a href="https://aikevin.dpdns.org/visual-design.html">认知武器</a></strong></td><td>从拖延、选择困难、沟通和职业方向等具体问题查找 108 个思考工具；搜索模型或原文标题，展开第一步练习，再阅读完整专题。</td></tr>
<tr><td><strong><a href="https://aikevin.dpdns.org/coffee.html">咖啡角</a></strong></td><td>在器具、豆子档案、探店记录与冲煮日记之间切换，从最近一杯回看配方与风味记录。</td></tr>
<tr><td><strong><a href="https://aikevin.dpdns.org/travel.html">看世界</a></strong></td><td>浏览目的地与历史旅行计划，沿路线查看按天整理的行程、住宿和景点详情。</td></tr>
<tr><td><strong><a href="https://aikevin.dpdns.org/gallery.html">回忆录</a></strong></td><td>旅途与日常影像的存放入口，支持相册与标签筛选；当前仓库的静态预览展示待整理状态。</td></tr>
</tbody>
</table>

**阅读路径：** 打开首页 → 选择主题 → 筛选文章或浏览专题 → 进入正文与详情。文章页提供目录导航；手机端使用可展开的导航菜单。

<a id="screens"></a>

## 界面一览

奶油白纸面、黑色硬边框、橙色标记与大留白，让文字和记录站在前面。以下截图来自本分支的真实本地运行界面，线上版本可能随发布进度不同。

### 01 / 找到值得继续读的内容

文章列表把分类、标签与搜索放在一起，筛选结果直接体现在页面中。

[![文章列表的真实界面：分类、标签与关键词筛选](assets/readme/articles.jpg)](https://aikevin.dpdns.org/blog.html)

### 02 / 把日常积累成档案

咖啡角从最近的冲煮记录展开，把器具和风味放回日常使用的语境。

[![咖啡角的真实界面：器具、豆子、探店与最近冲煮记录](assets/readme/coffee.jpg)](https://aikevin.dpdns.org/coffee.html)

<details>
<summary>再看一眼首页</summary>

[![计划李首页：探索未来，认真过好每一天](assets/readme/home.jpg)](https://aikevin.dpdns.org/)

截图来源、拍摄环境与素材说明见 [README 素材记录](assets/readme/README.md)。

</details>

<a id="workflow"></a>

## 内容如何维护

直接编辑对应的 HTML 页面，以及 styles/ 和 scripts/ 中的样式与交互代码。仓库里没有 Notion 或其他内容发布管线。本地预览并校验后，更新搜索索引和站点地图，再按 [上线流程](docs/RELEASE.md) 发布。

<a id="boundaries"></a>

## 内容公开到哪里

- **公开内容：** HTML、本地数据和搜索索引都是公开站点资料，正文和摘要应按公开资料维护；发布后的文章 URL 保持稳定。
- **搜索范围：** 导航栏的「搜索」入口（快捷键 `/`）在全站范围内搜索 `search-index.json` 收录的页面，按标题、关键词、摘要与正文片段排序，全部在浏览器内完成，不请求外部服务；索引未收录咖啡页面。文章列表页另有独立的标题、摘要与标签筛选。没有在线 AI 问答。
- **图片来源：** 咖啡器具图和旅行目的地图按页面说明使用产品或目的地资料图，不代表作者实拍。回忆录会过滤静态数据中的 `demo-` 示例条目，不将它们作为已发布照片展示。
- **服务边界：** 普通静态服务器可浏览文章与专题。回忆录 API 依赖 Cloudflare Pages Functions、KV 和 R2；API 不可用时回退到静态 JSON，隐藏管理工具。上传、删除还需要服务端 `GALLERY_API_KEY`，站点并非多用户内容管理系统。
- **配置与授权：** 服务端密钥使用环境变量，不写入前端。仓库目前没有项目级 `LICENSE` 文件；文章、照片与第三方素材的使用权限需分别确认。

<a id="develop"></a>

## 本地运行与开发

**只想看页面？** 在仓库根目录执行以下命令，然后打开 [localhost:8000](http://localhost:8000)。仓库已包含可直接浏览的 HTML 页面。

```bash
git clone https://github.com/kev1nl33/personal-blog.git
cd personal-blog
python3 -m http.server 8000
```

<details>
<summary><strong>修改页面、构建与验证</strong></summary>

需要 Python 3.10+、Node.js 与 npm。在仓库根目录执行；虚拟环境放在项目外，避免被静态服务器暴露。

```bash
python3 -m venv ../personal-blog-venv
source ../personal-blog-venv/bin/activate
python -m pip install -r requirements.txt
npm ci

# 编译 Tailwind 工具类（保留手工维护的 HTML）
npm run build

# 运行现有单元测试与页面校验
npm test
python validate_site.py

# 文章列表、首页精选或两个系列目录变化后，局部同步首页最近与系列导航
python update_reading_links.py
python update_reading_links.py --check

# 内容变化后更新检索与 SEO 产物
python generate_search_index.py
python generate_sitemap.py
```

直接修改 HTML、`styles/` 或 `scripts/`；新增工具类后运行 `npm run build`。在浏览器核对文章筛选、导航、图片和移动端布局；`validate_site.py` 检查页面结构、必要 meta 标签与本地资源链接。

`update_reading_links.py` 以 `blog.html` 的 essay 顺序生成首页最近四篇，排除首页精选；以两张系列目录的正篇列表生成文末上一篇、下一篇与返回入口，只同步这些区块。近况页的规范地址为 `/now`；`now.html` 保留为源文件。普通 Python 静态服务器不解析无扩展名地址，本地预览近况时可访问 `/now.html`。

全站搜索的索引由 `generate_search_index.py` 从根目录 HTML 重建（自动排除 `coffee*.html`、`404.html`、`test.html` 与备份文件），结果写入 `search-index.json`，匹配逻辑在 `scripts/search.js`，测试为 `tests/search.test.cjs`（随 `npm test` 运行）。改动正文或新增页面后重建索引；`python3 generate_search_index.py --check` 可校验索引是否已过期（退出码 1 表示需要重建）。

各页面来源见 [页面来源清单](docs/qa/page-sources.md)，生活板块的内容边界见 [验收记录](docs/qa/lifestyle-implementation-2026-10-03.md)。

</details>


<details>
<summary><strong>项目结构与部署说明</strong></summary>

```text
personal-blog/
├── templates/              既有页面模板参考
├── data/                   本地文章资料、认知专题数据
├── styles/                 共享设计系统与各板块样式
├── scripts/                搜索筛选、目录、专题交互与动效
├── projects/               独立认知专题页面
├── functions/api/          访客计数与回忆录接口
├── functions/media/        旅行照片的 R2 只读代理
├── functions/second-brain/ 登录后读取私有笔记
├── gallery/                回忆录静态回退数据
├── assets/readme/          本 README 的封面、截图与素材说明
├── docs/qa/                页面来源与验收记录
├── tests/                  本地工具测试
├── site_builder.py         可选本地模板渲染工具
├── validate_site.py        受管页面静态校验
├── generate_search_index.py
├── generate_sitemap.py
└── *.html                  直接维护的网页
```

线上是 Cloudflare Pages 上的静态站，正式地址 [https://aikevin.dpdns.org](https://aikevin.dpdns.org)。构建输出就是仓库根目录：只改 HTML 时构建命令留空；改了 Tailwind 工具类再运行 `npm run build`。`404.html` 是自定义 404 页，`_redirects` 只做已下线旅行页的 301，两者都没有根级兜底。

照片不进 Pages 产物。旅行与回忆录图片放在 R2 桶 `GALLERY_BUCKET`（桶名 `blog-gallery`），页面通过 `functions/media` 读取，只放行 `travel/` 前缀。`functions/` 其余三处：

- `functions/api/counter`：用 `VISITOR_COUNTER` KV 记一次访问并返回总数。
- `functions/api/gallery`：用 `GALLERY_META` KV 和同一个 R2 桶列出、上传、删除回忆录照片；上传和删除需要服务端 `GALLERY_API_KEY`。
- `functions/second-brain`：校验登录后，从私有存储绑定读取 `/second-brain/` 下的文件。

绑定名称见 [wrangler.toml](wrangler.toml)。密钥只放在 Pages 环境变量或本地 `.dev.vars`，不写入仓库。自建一份时，KV、R2 和密钥都换成自己的。

README 与站点元数据（canonical、og:url、og:image、sitemap、robots.txt，以及 `site_builder.py`、`generate_sitemap.py` 的基址）统一使用当前在线地址 `https://aikevin.dpdns.org/`，不再含 `/personal-blog` 路径前缀。

</details>

---

[认识 Kevin](https://aikevin.dpdns.org/about.html) · [GitHub](https://github.com/kev1nl33) · [回到网站](https://aikevin.dpdns.org/)

[![持续观察，认真生活。Kevin’s Field Notes](assets/readme/footer.svg)](https://aikevin.dpdns.org/)
