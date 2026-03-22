// POST /api/gallery/upload
// 上传图片到 R2，元数据存入 KV

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function cors(response) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Gallery-Key');
    return response;
}

export async function onRequestOptions() {
    return cors(new Response(null, { status: 204 }));
}

export async function onRequestPost(context) {
    const { request, env } = context;

    // 简单 API Key 鉴权
    const apiKey = request.headers.get('X-Gallery-Key');
    if (!apiKey || apiKey !== env.GALLERY_API_KEY) {
        return cors(new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        }));
    }

    try {
        const formData = await request.formData();
        const results = [];

        // 遍历所有上传的文件
        for (const [key, value] of formData.entries()) {
            if (key === 'files' && value instanceof File) {
                const file = value;

                // 校验文件类型
                if (!ALLOWED_TYPES.includes(file.type)) {
                    results.push({ name: file.name, error: '不支持的文件类型' });
                    continue;
                }

                // 校验文件大小
                if (file.size > MAX_SIZE) {
                    results.push({ name: file.name, error: '文件超过 10MB' });
                    continue;
                }

                // 生成唯一文件名
                const ext = file.name.split('.').pop().toLowerCase();
                const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                const r2Key = `photos/${id}.${ext}`;

                // 上传到 R2
                await env.GALLERY_BUCKET.put(r2Key, file.stream(), {
                    httpMetadata: { contentType: file.type },
                    customMetadata: { originalName: file.name },
                });

                // 读取元数据字段
                const album = formData.get('album') || '未分类';
                const tags = formData.get('tags') || '';
                const caption = formData.get('caption') || '';

                // 存储元数据到 KV
                const meta = {
                    id,
                    r2Key,
                    originalName: file.name,
                    contentType: file.type,
                    size: file.size,
                    album,
                    tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                    caption,
                    uploadedAt: new Date().toISOString(),
                };

                await env.GALLERY_META.put(`photo:${id}`, JSON.stringify(meta));

                // 更新索引（相册列表、全部 ID 列表）
                await updateIndex(env.GALLERY_META, id, album, meta.tags);

                results.push({ name: file.name, id, r2Key, success: true });
            }
        }

        return cors(new Response(JSON.stringify({ results }), {
            headers: { 'Content-Type': 'application/json' },
        }));
    } catch (err) {
        return cors(new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        }));
    }
}

async function updateIndex(kv, id, album, tags) {
    // 更新全部图片 ID 列表
    let allIds = await kv.get('index:all', { type: 'json' }) || [];
    allIds.unshift(id);
    await kv.put('index:all', JSON.stringify(allIds));

    // 更新相册索引
    let albumIds = await kv.get(`index:album:${album}`, { type: 'json' }) || [];
    albumIds.unshift(id);
    await kv.put(`index:album:${album}`, JSON.stringify(albumIds));

    // 更新相册列表
    let albums = await kv.get('index:albums', { type: 'json' }) || [];
    if (!albums.includes(album)) {
        albums.push(album);
        await kv.put('index:albums', JSON.stringify(albums));
    }

    // 更新标签索引
    for (const tag of tags) {
        let tagIds = await kv.get(`index:tag:${tag}`, { type: 'json' }) || [];
        tagIds.unshift(id);
        await kv.put(`index:tag:${tag}`, JSON.stringify(tagIds));
    }

    // 更新标签列表
    let allTags = await kv.get('index:tags', { type: 'json' }) || [];
    let changed = false;
    for (const tag of tags) {
        if (!allTags.includes(tag)) {
            allTags.push(tag);
            changed = true;
        }
    }
    if (changed) {
        await kv.put('index:tags', JSON.stringify(allTags));
    }
}
