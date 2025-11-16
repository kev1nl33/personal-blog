# Notion 集成设置指南

本指南帮助你将 Notion 连接到你的博客，实现在 Notion 写文章，自动同步到网站。

## 📋 前置准备

- ✅ Notion 账号
- ✅ GitHub 账号
- ✅ 已部署的博客网站

## 🔧 设置步骤

### 第一步：在 Notion 创建文章数据库

1. **打开 Notion，创建一个新页面**

2. **在页面中创建一个 Database（Table 视图）**
   - 命名为："博客文章" 或 "Blog Posts"

3. **设置以下字段**（Property）：

   | 字段名 | 类型 | 说明 |
   |--------|------|------|
   | 标题 | Title | 文章标题（默认字段） |
   | 分类 | Select | 选项：职业发展、AI应用、投资思考、个人成长 |
   | 发布日期 | Date | 文章发布日期 |
   | 摘要 | Text | 文章简介，显示在列表页 |
   | 阅读时间 | Number | 预计阅读分钟数 |
   | 已发布 | Checkbox | 勾选后才会同步到网站 |
   | URL | Text | 文章 URL（如：career-transition） |

4. **文章正文**
   - 点击每一行，进入页面内容
   - 在页面里写文章内容
   - 支持：标题、段落、列表、引用、代码等

### 第二步：创建 Notion Integration

1. **访问 Notion Integrations 页面**
   ```
   https://www.notion.so/my-integrations
   ```

2. **点击 "+ New integration"**
   - Name: `Blog Sync`（或任意名字）
   - Associated workspace: 选择你的工作区
   - Type: Internal
   - Capabilities: 
     - ✅ Read content
     - ✅ No user information

3. **点击 Submit**

4. **复制 Integration Token**
   - 格式类似：`secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ 保密这个 Token！

### 第三步：连接 Integration 到数据库

1. **打开你创建的"博客文章"数据库**

2. **点击右上角的 "..." 菜单**

3. **选择 "Add connections"**

4. **搜索并选择你创建的 "Blog Sync"**

### 第四步：获取 Database ID

1. **在浏览器中打开"博客文章"数据库**

2. **复制浏览器地址栏的 URL**
   ```
   https://www.notion.so/xxxxxxxxxxxx/DatabaseID?v=xxxxxxxx
   ```

3. **提取 Database ID**
   - 在 `notion.so/` 和 `?v=` 之间的字符串
   - 32 位字符，格式类似：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
   - 如果 URL 中有短横线，去掉它们

### 第五步：配置 GitHub Secrets

1. **打开你的 GitHub 仓库**
   ```
   https://github.com/你的用户名/personal-blog
   ```

2. **进入 Settings → Secrets and variables → Actions**

3. **点击 "New repository secret"，添加两个 Secret：**

   **Secret 1：**
   - Name: `NOTION_TOKEN`
   - Value: 粘贴你的 Integration Token

   **Secret 2：**
   - Name: `NOTION_DATABASE_ID`
   - Value: 粘贴你的 Database ID

### 第六步：推送代码到 GitHub

1. **将所有文件推送到你的仓库**
   ```bash
   git add .
   git commit -m "Add Notion sync"
   git push
   ```

2. **GitHub Actions 会自动运行**
   - 进入 Actions 标签页查看运行状态

## ✍️ 如何使用

### 发布新文章

1. **在 Notion 数据库中添加新行**
2. **填写必要字段**：
   - 标题：文章标题
   - 分类：选择一个分类
   - 发布日期：今天的日期
   - 摘要：一两句话介绍文章
   - 阅读时间：估计 5-10 分钟
   - URL：英文短链接（如：`my-first-post`）
   - ⚠️ **暂时不要勾选"已发布"**

3. **点击进入页面，写文章正文**
   - 使用 Notion 的所有功能
   - 支持：标题、段落、列表、引用、代码块等

4. **写完后，勾选"已发布"**

5. **等待自动同步**
   - 每天自动同步一次
   - 或者去 GitHub Actions 手动触发

6. **几分钟后访问你的博客**
   - 文章会自动出现！

### 修改文章

1. 在 Notion 中直接修改
2. 保持"已发布"勾选状态
3. 等待下次自动同步

### 删除文章

1. 取消勾选"已发布"
2. 文章会从网站上消失（但仍在 Notion 中）

## 🔄 同步频率

- **自动同步**：每天一次（北京时间早上 8:00）
- **手动同步**：
  1. 进入 GitHub 仓库
  2. 点击 Actions 标签
  3. 选择 "Sync from Notion and Deploy"
  4. 点击 "Run workflow"

## 📝 Notion 写作示例

### 标题层级

```
Heading 1 → 网站的 <h2>
Heading 2 → 网站的 <h3>  
Heading 3 → 网站的 <h4>
```

### 支持的格式

- ✅ 段落
- ✅ 标题（H1、H2、H3）
- ✅ 粗体、斜体
- ✅ 项目列表（无序、有序）
- ✅ 引用
- ✅ 代码块
- ✅ 链接

### 示例文章结构

```
标题：我的第一篇文章

[正文内容]

## 第一部分

这是一个段落...

## 第二部分

- 要点一
- 要点二
- 要点三

## 总结

最后的总结...
```

## ⚠️ 注意事项

1. **URL 字段必须是唯一的**
   - 使用英文和短横线
   - 如：`career-change-2025`

2. **首次同步可能需要几分钟**
   - 后续会更快

3. **图片支持**
   - 目前脚本不支持图片
   - 如需要，可以手动添加

## 🐛 故障排除

### 文章没有出现在网站上？

1. 检查"已发布"是否勾选
2. 检查 GitHub Actions 是否运行成功
3. 检查 URL 字段是否填写

### GitHub Actions 失败？

1. 检查 Secrets 是否正确设置
2. 检查 Integration 是否连接到数据库
3. 查看 Actions 日志了解具体错误

## 📚 下一步

想要更多功能？可以：
- 添加图片支持
- 添加评论系统
- 添加文章搜索
- 优化 SEO

有问题随时问我！
