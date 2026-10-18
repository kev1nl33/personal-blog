# 第二大脑登录门卫（/second-brain/）

用 Cloudflare Pages Functions 在服务器端守住 `/second-brain/` 下的所有内容：未登录的页面请求跳登录页，数据请求一律 401；登录后从私有 R2 桶（`SECOND_BRAIN_BUCKET`，桶名 `second-brain-private`）按路径取文件返回。

## 文件

| 文件 | 作用 |
| --- | --- |
| `login.js` | `GET /second-brain/login` 登录页；`POST` 校验账号密码、下发签名 cookie、失败 401 / 锁定 429 |
| `[[path]].js` | 其余所有 `/second-brain/**` 请求的门卫：验 cookie → 从 R2 取文件 |
| `_lib/auth.mjs` | 共享逻辑：cookie 签名与验证、PBKDF2 密码校验、失败限次、R2 路径映射、MIME 推断。下划线目录 + `.mjs`，不会被路由器暴露成端点 |
| `../../scripts/generate-sb-password-hash.js` | 密码哈希生成脚本（交互式输入） |
| `../../tests/second-brain-gate.test.cjs` | 纯逻辑层单元测试（`npm test` 自动运行） |

## 环境变量（2 个，都不进代码库）

| 变量 | 用途 | 生成方式 |
| --- | --- | --- |
| `SB_PASSWORD_HASH` | 密码加盐哈希，格式 `pbkdf2:<迭代次数>:<盐hex>:<哈希hex>`（PBKDF2-HMAC-SHA256，256 位输出；盐 16 字节随机、内嵌在同一字符串里，不单独存放） | `node scripts/generate-sb-password-hash.js`，输出整行粘贴到 Pages 控制台环境变量；本地放 `.dev.vars`（已 gitignore） |
| `SB_COOKIE_SECRET` | 会话 cookie 的 HMAC-SHA256 签名密钥 | 任意随机长字符串，如 `openssl rand -hex 32` 的输出 |

配置缺失时一律 fail closed：登录返回 500，访问返回未登录语义。

## 安全设计

- cookie：`sb_auth=<过期时间戳>.<HMAC 签名>`，HttpOnly + Secure + SameSite=Lax + Path=/second-brain，有效期 7 天；篡改或过期视为未登录。
- 密码校验：PBKDF2 重算后常数时间比对；账号或密码错误返回同一个 401，不区分。
- 私有内容响应带 `Cache-Control: private, no-store` + `X-Content-Type-Options: nosniff`，防止中间缓存。
- R2 key 由 URL 路径映射，拒绝 `..` 及其编码形式和非法百分号编码。

## 登录失败限次的取舍（内存版）

同一来源（`CF-Connecting-IP`）连续错 5 次锁 15 分钟，实现在 isolate 内存里：

- **选内存的原因**：KV 写入后最长约 60 秒才全球可见（最终一致），锁定窗口内有豁口，且需要新增 KV 绑定（本次约束只允许增加 R2 绑定）；内存版零配置、即时生效。
- **内存版的代价**：按边缘节点各自计数、部署或重启后清零。对单一账号（`kevin`）的个人站点，把在线爆破成本抬到"每节点每 15 分钟 5 次"，足够；将来要全局计数再换成 KV / Durable Objects 即可。

## 本地验证

```bash
# 1. 生成本地测试用的密钥与密码哈希（写入 .dev.vars，不提交）
node scripts/generate-sb-password-hash.js
printf 'SB_COOKIE_SECRET=%s\n' "$(openssl rand -hex 32)" >> .dev.vars

# 2. 往本地模拟 R2 桶放测试文件（只存在于 .wrangler/ 本地状态）
mkdir -p /tmp/sb-seed && echo 'second brain local test' > /tmp/sb-seed/index.html
npx wrangler r2 object put second-brain-private/index.html --file /tmp/sb-seed/index.html --local

# 3. 启动本地 Pages（自动读取 wrangler.toml 绑定与 .dev.vars）
npx wrangler pages dev . --port 8788

# 4. 验收（另开终端）
curl -i http://localhost:8788/second-brain                                   # 301 → /second-brain/（URL 规范化）
curl -i http://localhost:8788/second-brain/                                  # 302 → /second-brain/login
curl -i http://localhost:8788/second-brain/index.html                        # 302 → /second-brain/login
curl -i http://localhost:8788/second-brain/private-data/demo.js              # 401
curl -i -X POST http://localhost:8788/second-brain/login -d 'username=kevin&password=错误密码'   # 401，连错 5 次后 429
curl -i -X POST http://localhost:8788/second-brain/login -d 'username=kevin&password=正确密码'   # 303 + Set-Cookie
curl -i -H "Cookie: sb_auth=<上一步 Set-Cookie 里的值>" http://localhost:8788/second-brain/      # 200 + 文件内容
```

> 注意：本地 `http://` 下 curl 的 cookie jar 不会回传带 `Secure` 标记的 cookie，验证时直接用 `-H "Cookie: ..."` 注入；浏览器访问 `localhost` 不受影响（现代浏览器把 localhost 视为安全上下文）。

### 本地密钥的两个注意点

- `wrangler pages dev` 的静态服务会把 `.dev.vars` 当普通文件 serve（`http://localhost:PORT/.dev.vars` 可读）。它只绑定 localhost、且仅在 dev server 运行期间可访问；生产部署产物中不存在此文件（未提交 + `.assetsignore` 双保险）。介意的话，把密钥放在仓库外并用 `--env-file` 注入：
  ```bash
  npx wrangler pages dev . --port 8788 --env-file ~/.sb-dev.vars
  ```
- 用完的测试密钥记得删掉 `.dev.vars`（`rm .dev.vars`），长期不用不要留在仓库根目录。
