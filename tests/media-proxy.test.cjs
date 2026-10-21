// /media 旅行照片只读入口 —— 单元测试
// 被测模块：functions/media/[[path]].js（onRequestGet/onRequestHead，mock R2 桶直接调用）
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const nodePath = require('node:path');

// [[path]].js 文件名含方括号，须走 pathToFileURL 转成 file:// URL 再 import
const loadMedia = () =>
    import(pathToFileURL(nodePath.join(__dirname, '../functions/media/[[path]].js')).href);

// 模拟 R2 桶：仅持有两个已知 key，其余返回 null
const OBJECTS = new Map([
    ['travel/japan-2023/osaka-248.jpg', {
        body: 'jpeg-bytes',
        size: 10,
        httpEtag: '"abc123"',
        httpMetadata: { contentType: 'image/jpeg' },
    }],
    ['travel/uk-2024/uk-2024-034.webp', {
        body: 'webp-bytes',
        size: 11,
        httpEtag: '"def456"',
        httpMetadata: {},
    }],
]);

const makeEnv = () => ({
    GALLERY_BUCKET: {
        get: async (key) => OBJECTS.get(key) || null,
    },
});

const makeContext = (segments, { method = 'GET', headers = {} } = {}) => ({
    request: new Request(`https://example.com/media/${segments.join('/')}`, { method, headers }),
    env: makeEnv(),
    params: { path: segments },
});

// ---------- 正常读取 ----------

test('GET 已存在的 travel 图片返回 200、Content-Type 与一年不可变缓存', async () => {
    const media = await loadMedia();
    const res = await media.onRequestGet(makeContext(['travel', 'japan-2023', 'osaka-248.jpg']));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Content-Type'), 'image/jpeg');
    assert.equal(res.headers.get('Cache-Control'), 'public, max-age=31536000, immutable');
    assert.equal(res.headers.get('ETag'), '"abc123"');
    assert.equal(await res.text(), 'jpeg-bytes');
});

test('对象缺失 httpMetadata 时按扩展名推断 Content-Type', async () => {
    const media = await loadMedia();
    const res = await media.onRequestGet(makeContext(['travel', 'uk-2024', 'uk-2024-034.webp']));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Content-Type'), 'image/webp');
});

test('HEAD 只回元信息不回 Body', async () => {
    const media = await loadMedia();
    const res = await media.onRequestHead(makeContext(['travel', 'japan-2023', 'osaka-248.jpg'], { method: 'HEAD' }));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Content-Type'), 'image/jpeg');
    assert.equal(res.headers.get('ETag'), '"abc123"');
    assert.equal(await res.text(), '');
});

test('If-None-Match 命中 ETag 时返回 304', async () => {
    const media = await loadMedia();
    const res = await media.onRequestGet(makeContext(['travel', 'japan-2023', 'osaka-248.jpg'], {
        headers: { 'If-None-Match': '"abc123"' },
    }));
    assert.equal(res.status, 304);
});

// ---------- 路径校验（一律 404，不落桶） ----------

test('不存在的 key 返回 404', async () => {
    const media = await loadMedia();
    const res = await media.onRequestGet(makeContext(['travel', 'japan-2023', 'missing.jpg']));
    assert.equal(res.status, 404);
});

test('非 travel/ 前缀（如 photos/、根路径文件）返回 404', async () => {
    const media = await loadMedia();
    for (const segments of [['photos', 'a.jpg'], ['second-brain', 'secret.js'], ['travel.jpg']]) {
        const res = await media.onRequestGet(makeContext(segments));
        assert.equal(res.status, 404, `应拒绝: ${segments.join('/')}`);
    }
});

test('路径穿越段 .. 与 . 返回 404', async () => {
    const media = await loadMedia();
    for (const segments of [
        ['travel', '..', 'secret.jpg'],
        ['..', 'travel', 'a.jpg'],
        ['travel', '.', 'a.jpg'],
        ['travel', 'japan-2023', '..', 'osaka-248.jpg'],
    ]) {
        const res = await media.onRequestGet(makeContext(segments));
        assert.equal(res.status, 404, `应拒绝: ${segments.join('/')}`);
    }
});

test('空段（连续斜杠）、空路径与反斜杠返回 404', async () => {
    const media = await loadMedia();
    for (const segments of [['travel', '', 'a.jpg'], ['', 'travel', 'a.jpg'], ['travel\\secret', 'a.jpg'], []]) {
        const res = await media.onRequestGet(makeContext(segments));
        assert.equal(res.status, 404, `应拒绝: ${JSON.stringify(segments)}`);
    }
});

test('只有目录没有文件的路径返回 404', async () => {
    const media = await loadMedia();
    const res = await media.onRequestGet(makeContext(['travel', 'japan-2023']));
    assert.equal(res.status, 404);
});

// ---------- 绑定缺失 ----------

test('R2 绑定缺失时返回 500 而非崩溃', async () => {
    const media = await loadMedia();
    const context = makeContext(['travel', 'japan-2023', 'osaka-248.jpg']);
    context.env = {};
    const res = await media.onRequestGet(context);
    assert.equal(res.status, 500);
});
