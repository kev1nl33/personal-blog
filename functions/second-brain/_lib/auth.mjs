// 第二大脑门卫 —— 共享逻辑层
// 被 functions/second-brain/ 下的路由文件（login.js、[[path]].js）引用。
// 目录以 _ 开头 + .mjs 扩展名，Pages Functions 路由器不会把它暴露成端点。
// 单元测试：tests/second-brain-gate.test.cjs（node --test 直接 import 本文件，
// 不依赖 workerd，Node >= 18 自带 WebCrypto）。
//
// 环境变量（在 Cloudflare Pages 控制台或本地 .dev.vars 中配置）：
//   SB_PASSWORD_HASH   密码加盐哈希，格式 pbkdf2:<迭代次数>:<盐hex>:<哈希hex>
//                      由 scripts/generate-sb-password-hash.js 生成，盐内嵌其中
//   SB_COOKIE_SECRET   会话 cookie 的 HMAC-SHA256 签名密钥（随机长字符串）

export const COOKIE_NAME = 'sb_auth';
export const USERNAME = 'kevin';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 天

const encoder = new TextEncoder();

// ---------- 基础工具 ----------

function bytesToHex(bytes) {
    return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
    if (!/^[0-9a-f]*$/i.test(hex) || hex.length % 2 !== 0) return null;
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}

// 常数时间比较：无论差异在哪一字节，耗时一致，避免时序侧信道
function timingSafeEqual(a, b) {
    const max = Math.max(a.length, b.length);
    let diff = a.length === b.length ? 0 : 1;
    for (let i = 0; i < max; i++) {
        const x = i < a.length ? a[i] : 0;
        const y = i < b.length ? b[i] : 0;
        diff |= x ^ y;
    }
    return diff === 0;
}

async function hmacHex(secret, message) {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return bytesToHex(new Uint8Array(sig));
}

// ---------- 会话 cookie：HMAC 签名 + 过期时间 ----------

// cookie 值 = "<过期毫秒时间戳>.<HMAC-SHA256(secret, v1:用户名:过期时间戳)>"
export async function signSessionValue(secret, expiresAtMs) {
    return `${expiresAtMs}.${await hmacHex(secret, `v1:${USERNAME}:${expiresAtMs}`)}`;
}

// 验证规则：格式合法、未过期、签名一致。篡改或过期一律视为未登录（fail closed）。
export async function verifySessionValue(secret, value, now = Date.now()) {
    if (typeof secret !== 'string' || secret === '' || typeof value !== 'string') return false;
    const dot = value.indexOf('.');
    if (dot <= 0) return false;
    const expStr = value.slice(0, dot);
    const sig = value.slice(dot + 1);
    if (!/^\d{1,16}$/.test(expStr) || !/^[0-9a-f]{64}$/i.test(sig)) return false;
    const expiresAt = Number(expStr);
    if (!(expiresAt > now)) return false;
    const expected = await hmacHex(secret, `v1:${USERNAME}:${expiresAt}`);
    return timingSafeEqual(hexToBytes(sig.toLowerCase()), hexToBytes(expected));
}

// 从 "a=1; sb_auth=xxx; b=2" 形式的 Cookie 头中取出指定 cookie
export function parseCookieHeader(header, name) {
    if (typeof header !== 'string') return null;
    for (const part of header.split(';')) {
        const eq = part.indexOf('=');
        if (eq < 0) continue;
        if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
    }
    return null;
}

export async function isLoggedIn(secret, cookieHeader, now = Date.now()) {
    const value = parseCookieHeader(cookieHeader, COOKIE_NAME);
    if (!value) return false;
    return verifySessionValue(secret, value, now);
}

export function buildSetCookie(value) {
    const expires = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toUTCString();
    return (
        `${COOKIE_NAME}=${value}; Path=/second-brain` +
        `; Max-Age=${SESSION_MAX_AGE_SECONDS}; Expires=${expires}` +
        '; HttpOnly; Secure; SameSite=Lax'
    );
}

// ---------- 密码校验：PBKDF2-HMAC-SHA256 ----------

// 解析 "pbkdf2:<迭代次数>:<盐hex>:<哈希hex>"；盐就存放在这个字符串里，
// 与哈希一起放在环境变量 SB_PASSWORD_HASH 中，无需单独的盐存储。
export function parsePasswordHash(stored) {
    if (typeof stored !== 'string') return null;
    const parts = stored.split(':');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') return null;
    const iterations = Number(parts[1]);
    const salt = hexToBytes(parts[2]);
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > 5_000_000) return null;
    if (!salt || salt.length < 8) return null;
    if (!/^[0-9a-f]{64}$/i.test(parts[3])) return null;
    return { iterations, salt, expectedHex: parts[3].toLowerCase() };
}

export async function verifyPassword(storedHash, password) {
    const parsed = parsePasswordHash(storedHash);
    if (!parsed || typeof password !== 'string' || password === '') return false;
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
        'deriveBits',
    ]);
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt: parsed.salt, iterations: parsed.iterations },
        key,
        256,
    );
    return timingSafeEqual(new Uint8Array(bits), hexToBytes(parsed.expectedHex));
}

// ---------- 登录失败限次（内存近似实现） ----------
//
// 取舍：KV 做不到强一致（写入后最长约 60 秒才全球可见，攻击者可在这窗口继续尝试），
// 且需要新增 KV 绑定；内存版零配置、即时生效，但按 isolate 独立——边缘不同节点
// 各自计数、部署或重启后清零。对单一账号（kevin）的个人站点，内存版把爆破成本
// 从"无限尝试"提高到"每个节点每 15 分钟 5 次"，性价比足够。

export function createLoginLimiter({
    maxFailures = 5,
    lockMs = 15 * 60 * 1000,
    now = Date.now,
} = {}) {
    const attempts = new Map(); // 来源 key -> { count, lockedUntil }

    function isLocked(key) {
        const rec = attempts.get(key);
        if (!rec) return false;
        if (rec.lockedUntil > now()) return true;
        if (rec.lockedUntil) attempts.delete(key); // 锁已过期，清除记录
        return false;
    }

    // 剩余锁定秒数（未锁定返回 0），供 429 响应的 Retry-After 使用
    function retryAfterSeconds(key) {
        const rec = attempts.get(key);
        if (!rec || rec.lockedUntil <= now()) return 0;
        return Math.ceil((rec.lockedUntil - now()) / 1000);
    }

    // 记录一次失败。返回 null 表示未触发锁定；返回锁定秒数表示本次恰好触发锁定。
    function registerFailure(key) {
        const t = now();
        const rec = attempts.get(key) || { count: 0, lockedUntil: 0 };
        if (rec.lockedUntil && rec.lockedUntil <= t) {
            rec.count = 0; // 上一轮锁已过期，重新计数
            rec.lockedUntil = 0;
        }
        rec.count += 1;
        let lockedFor = null;
        if (rec.count >= maxFailures) {
            rec.lockedUntil = t + lockMs;
            rec.count = 0;
            lockedFor = Math.ceil(lockMs / 1000);
        }
        attempts.set(key, rec);
        if (attempts.size > 5000) pruneOld(t);
        return lockedFor;
    }

    function pruneOld(t) {
        for (const [k, rec] of attempts) {
            if (rec.lockedUntil <= t) attempts.delete(k);
        }
    }

    function reset(key) {
        attempts.delete(key);
    }

    return { isLocked, retryAfterSeconds, registerFailure, reset };
}

// ---------- R2 路径映射与 Content-Type ----------

// 把 /second-brain/<rest> 映射为 R2 key：<rest>；目录（尾部斜杠或空）补 index.html。
// 拒绝路径穿越（.. 与其编码形式）和非法百分号编码，返回 null。
export function r2KeyFromPathname(pathname) {
    if (typeof pathname !== 'string' || pathname.includes('\0')) return null;
    const trailingSlash = /\/$/.test(pathname);
    const rest = pathname.replace(/^\/second-brain/, '').replace(/^\//, '');
    if (rest === '') return 'index.html';

    const segments = [];
    for (const raw of rest.split('/')) {
        let seg;
        try {
            seg = decodeURIComponent(raw);
        } catch {
            return null;
        }
        if (seg === '' || seg === '.') continue;
        if (seg === '..' || seg.startsWith('\\')) return null;
        segments.push(seg);
    }
    if (segments.length === 0) return 'index.html';
    const key = segments.join('/');
    return trailingSlash ? `${key}/index.html` : key;
}

const MIME_BY_EXT = {
    html: 'text/html; charset=utf-8',
    htm: 'text/html; charset=utf-8',
    js: 'text/javascript; charset=utf-8',
    mjs: 'text/javascript; charset=utf-8',
    css: 'text/css; charset=utf-8',
    json: 'application/json; charset=utf-8',
    txt: 'text/plain; charset=utf-8',
    md: 'text/plain; charset=utf-8',
    csv: 'text/csv; charset=utf-8',
    xml: 'application/xml; charset=utf-8',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    ico: 'image/x-icon',
    pdf: 'application/pdf',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    webm: 'video/webm',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    otf: 'font/otf',
    zip: 'application/zip',
    wasm: 'application/wasm',
};

export function contentTypeFor(key) {
    const match = /\.([a-z0-9]+)$/i.exec(key);
    const ext = match ? match[1].toLowerCase() : '';
    return MIME_BY_EXT[ext] || 'application/octet-stream';
}
