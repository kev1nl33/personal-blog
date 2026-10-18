// Cloudflare Pages Function: /second-brain/**（其余所有路径）
// 登录门卫：先验签名 cookie ——
//   未登录：页面请求（导航到目录或 .html）302 跳登录页，其他请求 401，绝不返回桶内数据
//   已登录：按 URL 路径从 R2 桶 SECOND_BRAIN_BUCKET 取文件，返回正确的 Content-Type
import { isLoggedIn, r2KeyFromPathname, contentTypeFor } from './_lib/auth.mjs';

const NO_STORE = { 'Cache-Control': 'no-store' };

function jsonResponse(status, body) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...NO_STORE },
    });
}

// “页面请求”判定：浏览器导航（Accept 含 text/html），或路径本身是页面
// （目录尾部斜杠 / .html 结尾）。数据文件（.js/.json 等）一律 401。
function isPageRequest(request) {
    if ((request.headers.get('Accept') || '').includes('text/html')) return true;
    const lastSegment = new URL(request.url).pathname.split('/').pop() || '';
    return lastSegment === '' || /\.x?html?$/i.test(lastSegment);
}

export async function onRequest(context) {
    const { request, env } = context;

    const authed = await isLoggedIn(env.SB_COOKIE_SECRET, request.headers.get('Cookie'));
    if (!authed) {
        if (isPageRequest(request)) {
            return new Response(null, {
                status: 302,
                headers: { Location: '/second-brain/login', ...NO_STORE },
            });
        }
        return jsonResponse(401, { error: 'unauthorized' });
    }

    if (!env.SECOND_BRAIN_BUCKET) {
        console.error('second-brain: R2 binding SECOND_BRAIN_BUCKET is missing');
        return jsonResponse(500, { error: 'r2_binding_missing' });
    }

    const key = r2KeyFromPathname(new URL(request.url).pathname);
    if (!key) return jsonResponse(400, { error: 'bad_path' });

    try {
        const object = await env.SECOND_BRAIN_BUCKET.get(key);
        if (!object) return jsonResponse(404, { error: 'not_found' });

        const headers = new Headers({
            // 私有内容：优先用对象自带的 httpMetadata，否则按扩展名推断
            'Content-Type': object.httpMetadata?.contentType || contentTypeFor(key),
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
        });
        if (object.etag) headers.set('ETag', object.etag);
        return new Response(object.body, { headers });
    } catch (err) {
        console.error('second-brain: R2 read failed', err);
        return jsonResponse(500, { error: 'storage_error' });
    }
}
