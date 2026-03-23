# 画廊模块 - Cloudflare 配置

## 需求

为画廊模块配置 Cloudflare 基础设施：
1. KV Namespace - 存储图片元数据
2. R2 Bucket - 存储图片文件
3. 更新 wrangler.toml 配置

## 当前状态

### wrangler.toml 配置
```toml
[[kv_namespaces]]
binding = "GALLERY_META"
id = "YOUR_GALLERY_KV_NAMESPACE_ID"  # 待配置

[[r2_buckets]]
binding = "GALLERY_BUCKET"
bucket_name = "blog-gallery"
```

## 需要配置的资源

### 1. KV Namespace（GALLERY_META）
- 用于存储：
  - 图片元数据（`photo:{id}`）
  - 索引（`index:all`, `index:album:{name}`, `index:tag:{name}`）
  - 相册列表（`index:albums`）
  - 标签列表（`index:tags`）

### 2. R2 Bucket（blog-gallery）
- 用于存储：
  - 上传的图片文件
  - 路径：`photos/{id}.{ext}`

### 3. 环境变量
- `GALLERY_API_KEY` - 管理接口鉴权密钥

## Cloudflare 配置步骤

### 步骤 1: 创建 KV Namespace
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages
3. 点击 "KV" → "Create a namespace"
4. 名称：`GALLERY_META`
5. 创建后复制 Namespace ID

### 步骤 2: 创建 R2 Bucket
1. 在 Cloudflare Dashboard
2. 进入 R2 Object Storage
3. 点击 "Create bucket"
4. 名称：`blog-gallery`
5. 创建后无需额外配置（绑定后自动可用）

### 步骤 3: 绑定到 Pages 项目
1. 进入 Pages 项目设置
2. Settings → Functions → Bindings
3. 添加 KV Namespace 绑定：
   - Variable name: `GALLERY_META`
   - KV namespace: 选择刚创建的 namespace
4. 添加 R2 Bucket 绑定：
   - Variable name: `GALLERY_BUCKET`
   - R2 bucket: `blog-gallery`

### 步骤 4: 配置 API Key
1. 在 Workers & Pages 项目的 Settings → Variables
2. 添加 `GALLERY_API_KEY` 环境变量
3. 设置一个强密码作为 API 密钥

### 步骤 5: 更新 wrangler.toml
```toml
[[kv_namespaces]]
binding = "GALLERY_META"
id = "YOUR_ACTUAL_NAMESPACE_ID"  # 填入真实的 ID

[[r2_buckets]]
binding = "GALLERY_BUCKET"
bucket_name = "blog-gallery"
```

### 步骤 6: 提交并部署
```bash
git add wrangler.toml
git commit -m "config(gallery): add Cloudflare KV and R2 bindings"
git push
```

## 注意事项

- KV Namespace ID 需要手动获取并填入
- R2 bucket 名称需与代码中一致（`blog-gallery`）
- API Key 应该足够复杂，避免泄露
- 部署后需要测试上传功能
