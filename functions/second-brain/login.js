// Cloudflare Pages Function: /second-brain/login
// GET  返回登录页（已登录则 303 跳回 /second-brain/）
// POST 校验账号密码：成功下发签名 HttpOnly cookie 并 303 跳转；
//      失败返回 401；同一来源连续错 5 次锁 15 分钟（429 + Retry-After）
import {
    USERNAME,
    SESSION_MAX_AGE_SECONDS,
    signSessionValue,
    buildSetCookie,
    isLoggedIn,
    verifyPassword,
    createLoginLimiter,
} from './_lib/auth.mjs';

// 同一 isolate 内共享的失败计数器（取舍见 _lib/auth.mjs 注释）
const limiter = createLoginLimiter();

const NO_STORE = { 'Cache-Control': 'no-store' };

function clientKey(request) {
    return request.headers.get('CF-Connecting-IP') || '__unknown__';
}

function jsonResponse(status, body, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...NO_STORE,
            ...extraHeaders,
        },
    });
}

export async function onRequest(context) {
    const { request, env } = context;
    if (request.method === 'GET' || request.method === 'HEAD') return handleLoginPage(request, env);
    if (request.method === 'POST') return handleLoginSubmit(request, env);
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD, POST', ...NO_STORE } });
}

async function handleLoginPage(request, env) {
    const authed = await isLoggedIn(env.SB_COOKIE_SECRET, request.headers.get('Cookie'));
    if (authed) {
        return new Response(null, { status: 303, headers: { Location: '/second-brain/', ...NO_STORE } });
    }
    return new Response(renderLoginPage(), {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex',
            ...NO_STORE,
        },
    });
}

async function handleLoginSubmit(request, env) {
    const key = clientKey(request);

    if (limiter.isLocked(key)) {
        const retryAfter = limiter.retryAfterSeconds(key);
        return jsonResponse(
            429,
            { error: 'locked', retry_after: retryAfter, message: '尝试次数过多，已锁定 15 分钟' },
            { 'Retry-After': String(retryAfter) },
        );
    }

    if (!env.SB_PASSWORD_HASH || !env.SB_COOKIE_SECRET) {
        console.error('second-brain: missing SB_PASSWORD_HASH or SB_COOKIE_SECRET');
        return jsonResponse(500, { error: 'server_not_configured' });
    }

    const form = await request.formData().catch(() => null);
    const username = String(form?.get('username') ?? '');
    const password = String(form?.get('password') ?? '');

    // 用户名或密码错误返回同一种 401，不区分哪个错了
    const ok = username === USERNAME && (await verifyPassword(env.SB_PASSWORD_HASH, password));
    if (!ok) {
        const lockedFor = limiter.registerFailure(key);
        if (lockedFor) {
            return jsonResponse(
                429,
                { error: 'locked', retry_after: lockedFor, message: '尝试次数过多，已锁定 15 分钟' },
                { 'Retry-After': String(lockedFor) },
            );
        }
        return jsonResponse(401, { error: 'invalid_credentials' });
    }

    limiter.reset(key);
    const value = await signSessionValue(env.SB_COOKIE_SECRET, Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    return new Response(null, {
        status: 303,
        headers: {
            Location: '/second-brain/',
            'Set-Cookie': buildSetCookie(value),
            ...NO_STORE,
        },
    });
}

// ---------- 登录页（内联样式，沿用博客 Neo-Brutalism 设计系统） ----------

function renderLoginPage() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>登录 - 第二大脑</title>
<style>
    :root {
        --brand-black: #0a0a0a;
        --brand-white: #f4f4f0;
        --brand-accent: #FF4D00;
        --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        --font-sans: 'Noto Sans SC', -apple-system, 'PingFang SC', sans-serif;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--brand-white);
        background-image:
            linear-gradient(#e5e5e5 1px, transparent 1px),
            linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
        background-size: 40px 40px;
        font-family: var(--font-sans);
        color: var(--brand-black);
        padding: 24px;
    }
    .card {
        background: #fff;
        border: 2px solid var(--brand-black);
        box-shadow: 8px 8px 0 var(--brand-black);
        padding: 40px 36px;
        width: 100%;
        max-width: 400px;
    }
    .label {
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--brand-accent);
        margin-bottom: 8px;
    }
    h1 {
        font-size: 28px;
        font-weight: 900;
        letter-spacing: -0.02em;
        line-height: 1.1;
        margin-bottom: 6px;
    }
    .sub {
        font-family: var(--font-mono);
        font-size: 13px;
        color: #8a8a8a;
        margin-bottom: 28px;
    }
    fieldset { border: 0; }
    .field { margin-bottom: 18px; }
    .field label {
        display: block;
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 6px;
    }
    input {
        width: 100%;
        border: 1px solid var(--brand-black);
        background: #fff;
        padding: 12px 14px;
        font-size: 16px;
        font-family: var(--font-mono);
        outline: none;
        border-radius: 0;
    }
    input:focus {
        border-color: var(--brand-accent);
        box-shadow: 4px 4px 0 var(--brand-accent);
    }
    button {
        width: 100%;
        margin-top: 6px;
        padding: 14px;
        background: var(--brand-black);
        color: #fff;
        border: 2px solid var(--brand-black);
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 0;
        transition: background 0.3s ease, border-color 0.3s ease;
    }
    button:hover { background: var(--brand-accent); border-color: var(--brand-accent); }
    .msg {
        display: none;
        margin-top: 16px;
        padding: 10px 12px;
        border: 1px solid var(--brand-accent);
        background: rgba(255, 77, 0, 0.08);
        font-size: 14px;
    }
    .msg.show { display: block; }
    footer {
        margin-top: 24px;
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #8a8a8a;
        text-align: center;
    }
</style>
</head>
<body>
    <main class="card">
        <div class="label">● Second Brain</div>
        <h1>第二大脑</h1>
        <p class="sub">私人区域 · 凭账号登录后访问</p>
        <form id="login-form" method="post" action="/second-brain/login">
            <fieldset>
                <div class="field">
                    <label for="username">账号</label>
                    <input id="username" name="username" type="text" autocomplete="username" required>
                </div>
                <div class="field">
                    <label for="password">密码</label>
                    <input id="password" name="password" type="password" autocomplete="current-password" required>
                </div>
                <button type="submit">进入 →</button>
            </fieldset>
        </form>
        <p class="msg" id="msg" role="alert"></p>
        <footer>Kevin's Private Space</footer>
    </main>
    <script>
        // 渐进增强：有 JS 时就地展示错误信息，不打断输入；无 JS 时表单照常提交
        document.getElementById('login-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            var msg = document.getElementById('msg');
            msg.classList.remove('show');
            try {
                var res = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    redirect: 'manual'
                });
                if (res.status === 401) {
                    msg.textContent = '账号或密码错误';
                    msg.classList.add('show');
                } else if (res.status === 429) {
                    msg.textContent = '错误次数过多，已锁定，请 15 分钟后再试';
                    msg.classList.add('show');
                } else {
                    window.location.href = '/second-brain/';
                }
            } catch (err) {
                msg.textContent = '网络异常，请重试';
                msg.classList.add('show');
            }
        });
    </script>
</body>
</html>`;
}
