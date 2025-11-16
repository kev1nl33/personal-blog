# 计划李的个人博客

一个现代化、响应式的个人博客网站，使用纯HTML/CSS/JavaScript构建，可直接部署到Cloudflare Pages。

## ✨ 特性

- 🎨 **现代化设计** - 深色主题，渐变效果，流畅动画
- 📱 **完全响应式** - 适配手机、平板、桌面设备
- ⚡ **高性能** - 纯静态网站，加载速度极快
- 🔍 **文章搜索** - 实时搜索和分类筛选功能
- 💼 **专业内容** - 职业发展、AI应用、投资思考
- 🎯 **SEO友好** - 语义化HTML，利于搜索引擎收录

## 📁 项目结构

```
personal-blog/
├── index.html              # 主页
├── blog.html              # 文章列表页
├── about.html             # 关于页面
├── article1.html          # 示例文章页
├── styles/
│   ├── main.css          # 主样式文件
│   ├── blog.css          # 博客页样式
│   ├── about.css         # 关于页样式
│   └── article.css       # 文章页样式
└── scripts/
    ├── main.js           # 主脚本
    └── blog.js           # 博客页脚本
```

## 🚀 部署到Cloudflare Pages

### 方法一：通过 GitHub（推荐）

1. **创建GitHub仓库**
   ```bash
   cd personal-blog
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. **连接Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 **Pages** 页面
   - 点击 **Create a project**
   - 选择 **Connect to Git**
   - 授权并选择你的GitHub仓库
   - 配置构建设置：
     - **Build command**: 留空（纯静态网站）
     - **Build output directory**: `/`
   - 点击 **Save and Deploy**

3. **配置自定义域名**
   - 部署完成后，进入项目设置
   - 点击 **Custom domains**
   - 添加你的域名
   - 在Cloudflare DNS中添加CNAME记录指向分配的pages.dev域名

### 方法二：直接上传

1. **登录Cloudflare Pages**
   - 进入 Pages 页面
   - 点击 **Create a project**
   - 选择 **Direct upload**

2. **上传文件**
   - 将整个项目文件夹压缩成zip
   - 或者直接拖拽文件夹到上传区域
   - 等待上传完成

3. **配置域名**
   - 同上面方法一的第3步

## 🎨 自定义配置

### 修改个人信息

编辑以下文件中的个人信息：

1. **index.html** - 更新首页的个人简介
2. **about.html** - 更新详细的个人介绍
3. **所有HTML文件** - 更新页脚的社交媒体链接

### 修改配色方案

在 `styles/main.css` 中修改CSS变量：

```css
:root {
    --bg-primary: #0a0a0a;      /* 主背景色 */
    --bg-secondary: #1a1a1a;    /* 次要背景色 */
    --accent: #00d4ff;          /* 强调色 */
    /* ... 其他颜色变量 */
}
```

### 添加新文章

1. 复制 `article1.html` 创建新文章页
2. 修改文章内容
3. 在 `blog.html` 中添加文章卡片
4. 更新文章的分类标签

## 📝 内容管理

### 文章分类

当前支持的分类：
- 职业发展 (`career`)
- AI应用 (`ai`)
- 投资思考 (`investment`)
- 个人成长 (`personal`)

在 `blog.html` 中添加新分类：
```html
<button class="category-btn" data-category="新分类英文名">新分类中文名</button>
```

### SEO优化建议

1. 为每个页面添加适当的 meta 标签
2. 使用描述性的标题
3. 添加 Open Graph 标签用于社交媒体分享
4. 创建 sitemap.xml
5. 添加 robots.txt

## 🔧 高级功能

### 添加评论系统

可以集成以下评论系统：
- **Giscus** - 基于GitHub Discussions
- **Utterances** - 基于GitHub Issues
- **Disqus** - 第三方评论服务

### 添加分析工具

- **Google Analytics**
- **Cloudflare Web Analytics**（推荐，隐私友好）
- **Plausible Analytics**

### 添加RSS订阅

创建 `feed.xml` 文件，提供RSS订阅功能。

## 📊 性能优化

- ✅ 使用语义化HTML
- ✅ CSS和JS文件已优化
- ✅ 图片使用WebP格式（建议）
- ✅ 启用Cloudflare的CDN加速
- ✅ 启用浏览器缓存

## 🌐 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 📄 许可证

MIT License - 可自由使用和修改

## 🤝 贡献

欢迎提出建议和改进！

## 📮 联系方式

- 知乎：[@计划李](https://www.zhihu.com/people/ji-hua-li)
- 邮箱：your-email@example.com

---

**享受你的博客之旅！** 🚀
