// GET /api/gallery/image/photos/:id
// 从 R2 读取图片并返回

export async function onRequestGet(context) {
    const { env, params } = context;

    // 从 URL 路径重建 R2 key
    const pathSegments = params.path || [];
    const r2Key = `photos/${pathSegments.join('/')}`;

    try {
        const object = await env.GALLERY_BUCKET.get(r2Key);

        if (!object) {
            return new Response('Not Found', { status: 404 });
        }

        const headers = new Headers();
        headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        headers.set('Access-Control-Allow-Origin', '*');

        return new Response(object.body, { headers });
    } catch (err) {
        return new Response('Error loading image', { status: 500 });
    }
}
