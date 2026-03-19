// Cloudflare Pages Function: GET /api/counter
// 访客计数器 API — 使用 KV 存储持久化计数

export async function onRequestGet(context) {
    const { env } = context;

    try {
        // 从 KV 读取当前计数
        let count = await env.VISITOR_COUNTER.get('total_visits');
        count = count ? parseInt(count, 10) : 0;

        // 计数 +1
        count += 1;

        // 写回 KV
        await env.VISITOR_COUNTER.put('total_visits', count.toString());

        return new Response(JSON.stringify({ count }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Counter unavailable' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}
