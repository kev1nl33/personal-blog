// Cloudflare Pages Function: /second-brain/logout
// POST 清除签名会话 cookie 并 303 返回登录页；
// GET  返回极简确认表单，避免浏览器预取或外链图片触发误登出。
import { buildClearCookie } from './_lib/auth.mjs';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function onRequest(context) {
    const { request } = context;

    if (request.method === 'POST') {
        return new Response(null, {
            status: 303,
            headers: {
                Location: '/second-brain/login',
                'Set-Cookie': buildClearCookie(),
                ...NO_STORE,
            },
        });
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
        const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>退出登录 - 第二大脑</title>
<style>
  body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #f4f4f0; color: #0a0a0a; font-family: -apple-system, 'PingFang SC', sans-serif; padding: 24px; }
  .card { background: #fff; border: 2px solid #0a0a0a; box-shadow: 6px 6px 0 #0a0a0a; padding: 32px; max-width: 360px; width: 100%; }
  h1 { margin: 0 0 12px; font-size: 22px; }
  p { margin: 0 0 20px; color: #555; font-size: 14px; line-height: 1.6; }
  button { width: 100%; padding: 12px; background: #0a0a0a; color: #fff; border: 2px solid #0a0a0a; font-weight: 700; cursor: pointer; }
  button:hover { background: #ff4d00; border-color: #ff4d00; }
  a { display: inline-block; margin-top: 16px; color: #0a0a0a; font-size: 13px; }
</style>
</head>
<body>
  <main class="card">
    <h1>退出第二大脑</h1>
    <p>确认清除当前浏览器中的登录会话？</p>
    <form method="post" action="/second-brain/logout">
      <button type="submit">确认退出</button>
    </form>
    <a href="/second-brain/">← 返回第二大脑</a>
  </main>
</body>
</html>`;
        return new Response(request.method === 'HEAD' ? null : html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Robots-Tag': 'noindex',
                ...NO_STORE,
            },
        });
    }

    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD, POST', ...NO_STORE } });
}
