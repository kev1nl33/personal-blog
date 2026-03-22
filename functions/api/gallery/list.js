// GET /api/gallery/list
// 列出画廊图片，支持按相册和标签筛选

function cors(response) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}

export async function onRequestOptions() {
    return cors(new Response(null, { status: 204 }));
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const album = url.searchParams.get('album');
    const tag = url.searchParams.get('tag');

    try {
        let ids;

        if (album) {
            ids = await env.GALLERY_META.get(`index:album:${album}`, { type: 'json' }) || [];
        } else if (tag) {
            ids = await env.GALLERY_META.get(`index:tag:${tag}`, { type: 'json' }) || [];
        } else {
            ids = await env.GALLERY_META.get('index:all', { type: 'json' }) || [];
        }

        // 批量获取元数据
        const photos = [];
        for (const id of ids) {
            const meta = await env.GALLERY_META.get(`photo:${id}`, { type: 'json' });
            if (meta) {
                // 生成图片 URL（通过 R2 公开访问或自定义域名）
                meta.url = `/api/gallery/image/${meta.r2Key}`;
                photos.push(meta);
            }
        }

        // 获取所有相册和标签
        const albums = await env.GALLERY_META.get('index:albums', { type: 'json' }) || [];
        const tags = await env.GALLERY_META.get('index:tags', { type: 'json' }) || [];

        return cors(new Response(JSON.stringify({ photos, albums, tags }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60',
            },
        }));
    } catch (err) {
        return cors(new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        }));
    }
}
