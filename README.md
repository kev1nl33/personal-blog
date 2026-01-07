# 计划李的个人博客

一个现代化、响应式的个人博客网站，使用纯HTML/CSS/JavaScript构建，支持Notion自动同步，可直接部署到Cloudflare Pages。

## ✨ 特性

- 🎨 **Neo-Brutalism 设计** - 硬朗边框，高对比度，Bento Grid 布局
- ☕ **咖啡角 (Coffee Corner)** - 独立的咖啡生活记录模块（器具、豆子、探店、日记）
- 📱 **完全响应式** - 适配手机、平板、桌面设备
- ⚡ **高性能** - 纯静态网站，SVG 占位图，加载速度极快
- 🔍 **文章搜索** - 实时搜索和分类筛选功能
- 📚 **认知武器** - 独立的知识体系与思维模型展示
- 🔄 **Notion 同步** - 自动从 Notion 数据库同步文章和咖啡数据
- 🎯 **SEO 友好** - 语义化 HTML，利于搜索引擎收录

## 📁 项目结构

```
personal-blog/
├── index.html                    # 主页
├── blog.html                     # 文章列表页
├── about.html                    # 关于页面
├── visual-design.html            # 认知武器/设计页
├── [文章].html                   # 自动生成的文章页
│
├── coffee.html                   # 咖啡角主页 (Dashboard)
├── coffee-equipment.html         # 咖啡器具页
├── coffee-equipment-*.html       # 器具详情页 (KD310GB, Brikka, Scale, Heater)
├── coffee-beans.html             # 豆子档案页
├── coffee-shops.html             # 探店笔记页
├── coffee-notes.html             # 冲煮日记页
│
├── styles/
│   ├── main.css                  # 主样式文件
│   ├── neo-brutalism.css         # 新丑主义设计系统
│   ├── coffee.css                # 咖啡模块专属样式
│   └── article.css               # 文章页样式
│
├── scripts/
│   ├── main.js                   # 主脚本
│   └── search.js                 # 搜索功能
│
├── images/
│   └── coffee/                   # 咖啡模块图片资源
│
├── sync_notion.py                # Notion 全量同步脚本
└── requirements.txt              # Python 依赖
```

## 📝 文章分类

当前支持的分类：
- 职业发展 (`career`)
- AI应用 (`ai`)
- 投资思考 (`investment`)
- 个人成长 (`personal`)
- 读书笔记 (`reading`)

## 🔄 Notion 同步系统

项目通过 `sync_notion.py` 脚本实现全自动化内容管理：

1. **博客文章**：从 Notion Database 读取 Markdown 内容并渲染为 HTML。
2. **咖啡数据**：
   - 自动同步咖啡豆档案、探店记录、冲煮日记。
   - 自动解析 HTML 统计器具数量。
   - 自动更新咖啡角主页 (`coffee.html`) 的统计数据和预览卡片。

```bash
# 配置环境变量
export NOTION_TOKEN="your_token"
export NOTION_DATABASE_ID="your_db_id"

# 运行同步
python sync_notion.py
```

## 🚀 部署

推荐使用 **Cloudflare Pages** 进行部署：
1. 连接 GitHub 仓库。
2. 设置构建命令为空。
3. 设置输出目录为 `/`。
4. (可选) 配置定时任务运行同步脚本。

## 🎨 设计理念

本项目采用 **Neo-Brutalism (新野兽派)** 设计风格：
- **高对比度**：黑白主色调，配合克莱因蓝、亮橙等强调色。
- **硬边框**：所有卡片和按钮采用粗黑边框，无圆角或小圆角。
- **信息优先**：Bento Grid 仪表盘布局，强调信息密度和层级。
- **真实感**：使用真实的阴影偏移，模拟纸张堆叠效果。

## 📄 许可证

MIT License

## 📮 联系方式

- 知乎：[@计划李](https://www.zhihu.com/people/ji-hua-li)
- GitHub：[@kev1nl33](https://github.com/kev1nl33)
