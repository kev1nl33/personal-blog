// Cloudflare Pages Function: /media/**（可选路径）
// 旅行与回忆录照片的只读入口：GET/HEAD /media/travel/<目录>/<文件> 从 R2 桶
// GALLERY_BUCKET 读取（key = 仓库路径去掉 images/ 前缀），带一年期不可变缓存。
// 只放行 travel/ 前缀的栅格图片，路径为空、含 ..、非图片或越出 travel/ 的一律 404。

const CONTENT_TYPES = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
};

function extensionOf(key) {
    const dot = key.lastIndexOf('.');
    return dot > 0 ? key.slice(dot + 1).toLowerCase() : '';
}

function contentTypeFor(key, httpMetadata) {
    if (httpMetadata?.contentType && httpMetadata.contentType !== 'image/svg+xml') {
        return httpMetadata.contentType;
    }
    return CONTENT_TYPES[extensionOf(key)] || 'application/octet-stream';
}

function notFound() {
    return new Response('Not Found', {
        status: 404,
        headers: {
            'Cache-Control': 'public, max-age=60',
            'X-Content-Type-Options': 'nosniff',
        },
    });
}

async function serve(context, withBody) {
    const { request, env, params } = context;
    const segments = params.path || [];

    // 只接受 travel/<目录>/<文件> 形态：段为空（连续斜杠）、`.`、`..` 或反斜杠都拒绝
    if (segments.length < 2 || segments.some((s) => !s || s === '.' || s === '..' || s.includes('\\'))) {
        return notFound();
    }
    const key = segments.join('/');
    if (!key.startsWith('travel/')) return notFound();
    // 拒绝 SVG 等可执行脚本格式，避免同源 XSS 风险
    if (!Object.prototype.hasOwnProperty.call(CONTENT_TYPES, extensionOf(key))) {
        return notFound();
    }

    if (!env.GALLERY_BUCKET) {
        console.error('media: R2 binding GALLERY_BUCKET is missing');
        return new Response('Media storage unavailable', { status: 500 });
    }

    try {
        const useHead = !withBody && typeof env.GALLERY_BUCKET.head === 'function';
        const object = useHead
            ? await env.GALLERY_BUCKET.head(key)
            : await env.GALLERY_BUCKET.get(key);
        if (!object) return notFound();

        const headers = new Headers();
        headers.set('Content-Type', contentTypeFor(key, object.httpMetadata));
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        headers.set('ETag', object.httpEtag);
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.set('Access-Control-Allow-Origin', '*');

        // 条件请求命中时直接 304，及时释放未消费流
        if (request.headers.get('if-none-match') === object.httpEtag) {
            await object.body?.cancel?.();
            return new Response(null, { status: 304, headers });
        }
        if (!withBody) {
            await object.body?.cancel?.();
            return new Response(null, { headers });
        }
        return new Response(object.body, { headers });
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
