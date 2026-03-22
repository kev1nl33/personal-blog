// DELETE /api/gallery/delete
// 删除图片（R2 文件 + KV 元数据 + 索引）

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

    // 鉴权
    const apiKey = request.headers.get('X-Gallery-Key');
    if (!apiKey || apiKey !== env.GALLERY_API_KEY) {
        return cors(new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        }));
    }

    try {
        const { id } = await request.json();
        if (!id) {
            return cors(new Response(JSON.stringify({ error: '缺少 id' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }));
        }

        // 获取元数据
        const meta = await env.GALLERY_META.get(`photo:${id}`, { type: 'json' });
        if (!meta) {
            return cors(new Response(JSON.stringify({ error: '图片不存在' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            }));
        }

        // 删除 R2 文件
        await env.GALLERY_BUCKET.delete(meta.r2Key);

        // 从索引中移除
        await removeFromIndex(env.GALLERY_META, id, meta.album, meta.tags);

        // 删除 KV 元数据
        await env.GALLERY_META.delete(`photo:${id}`);

        return cors(new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        }));
    } catch (err) {
        return cors(new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        }));
    }
}

async function removeFromIndex(kv, id, album, tags) {
    // 从全部列表移除
    let allIds = await kv.get('index:all', { type: 'json' }) || [];
    allIds = allIds.filter(i => i !== id);
    await kv.put('index:all', JSON.stringify(allIds));

    // 从相册索引移除
    if (album) {
        let albumIds = await kv.get(`index:album:${album}`, { type: 'json' }) || [];
        albumIds = albumIds.filter(i => i !== id);
        if (albumIds.length === 0) {
            await kv.delete(`index:album:${album}`);
            let albums = await kv.get('index:albums', { type: 'json' }) || [];
            albums = albums.filter(a => a !== album);
            await kv.put('index:albums', JSON.stringify(albums));
        } else {
            await kv.put(`index:album:${album}`, JSON.stringify(albumIds));
        }
    }

    // 从标签索引移除
    for (const tag of (tags || [])) {
        let tagIds = await kv.get(`index:tag:${tag}`, { type: 'json' }) || [];
        tagIds = tagIds.filter(i => i !== id);
        if (tagIds.length === 0) {
            await kv.delete(`index:tag:${tag}`);
            let allTags = await kv.get('index:tags', { type: 'json' }) || [];
            allTags = allTags.filter(t => t !== tag);
            await kv.put('index:tags', JSON.stringify(allTags));
        } else {
            await kv.put(`index:tag:${tag}`, JSON.stringify(tagIds));
        }
    }
}
