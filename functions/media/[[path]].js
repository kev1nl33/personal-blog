// Cloudflare Pages Function: /media/**（可选路径）
// 旅行与回忆录照片的只读入口：GET/HEAD /media/travel/<目录>/<文件> 从 R2 桶
// GALLERY_BUCKET 读取（key = 仓库路径去掉 images/ 前缀），带一年期不可变缓存。
// 只放行 travel/ 前缀的 key，路径为空、含 .. 或越出 travel/ 的一律 404。

const CONTENT_TYPES = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
    svg: 'image/svg+xml',
};

function contentTypeFor(key, httpMetadata) {
    if (httpMetadata?.contentType) return httpMetadata.contentType;
    const extension = key.split('.').pop().toLowerCase();
    return CONTENT_TYPES[extension] || 'application/octet-stream';
}

function notFound() {
    return new Response('Not Found', {
        status: 404,
        headers: { 'Cache-Control': 'public, max-age=60' },
    });
}

async function serve(context, withBody) {
    const { request, env, params } = context;
    const segments = params.path || [];

    // 只接受 travel/<目录>/<文件> 形态：段为空（连续斜杠）、`.`、`..` 都拒绝
    if (segments.length < 2 || segments.some((s) => !s || s === '.' || s === '..' || s.includes('\\'))) {
        return notFound();
    }
    const key = segments.join('/');
    if (!key.startsWith('travel/')) return notFound();

    if (!env.GALLERY_BUCKET) {
        console.error('media: R2 binding GALLERY_BUCKET is missing');
        return new Response('Media storage unavailable', { status: 500 });
    }

    try {
        const object = await env.GALLERY_BUCKET.get(key);
        if (!object) return notFound();

        const headers = new Headers();
        headers.set('Content-Type', contentTypeFor(key, object.httpMetadata));
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        headers.set('ETag', object.httpEtag);
        headers.set('Access-Control-Allow-Origin', '*');

        // 条件请求命中时直接 304，Body 与 Content-Length 均由运行时按需处理
        if (request.headers.get('if-none-match') === object.httpEtag) {
            return new Response(null, { status: 304, headers });
        }
        return new Response(withBody ? object.body : null, { headers });
    } catch (err) {
        console.error('media: R2 read failed for', key, err);
        return new Response('Error loading media', { status: 500 });
    }
}

export async function onRequestGet(context) {
    return serve(context, true);
}

export async function onRequestHead(context) {
    return serve(context, false);
}
