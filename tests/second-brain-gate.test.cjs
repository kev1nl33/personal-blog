// 第二大脑登录门卫 —— 纯逻辑层单元测试
// 被测模块：functions/second-brain/_lib/auth.mjs
// 说明：所有密码、盐、密钥均在运行时随机生成，仓库中不存在任何真实凭据。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const nodeCrypto = require('node:crypto');

const loadAuth = () => import('../functions/second-brain/_lib/auth.mjs');

// 用独立实现生成 PBKDF2 哈希（与被测代码约定同一格式：pbkdf2:<iter>:<盐hex>:<哈希hex>）
function buildHash(password, iterations = 1000, salt = nodeCrypto.randomBytes(16)) {
    const hash = nodeCrypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    return `pbkdf2:${iterations}:${salt.toString('hex')}:${hash.toString('hex')}`;
}

const randomPassword = () => nodeCrypto.randomBytes(12).toString('base64url');
const randomSecret = () => nodeCrypto.randomBytes(24).toString('hex');

// ---------- 会话 cookie 签名与验证 ----------

test('有效签名且未过期的 cookie 验证通过', async () => {
    const auth = await loadAuth();
    const secret = randomSecret();
    const now = Date.now();
    const value = await auth.signSessionValue(secret, now + 60_000);
    assert.equal(await auth.verifySessionValue(secret, value, now), true);
});

test('用另一个密钥验证则失败（签名不匹配）', async () => {
    const auth = await loadAuth();
    const now = Date.now();
    const value = await auth.signSessionValue(randomSecret(), now + 60_000);
    assert.equal(await auth.verifySessionValue(randomSecret(), value, now), false);
});

test('篡改过期时间字段后验证失败', async () => {
    const auth = await loadAuth();
    const secret = randomSecret();
    const now = Date.now();
    const value = await auth.signSessionValue(secret, now + 60_000);
    const [ , sig] = value.split('.');
    const tampered = `${now + 3600_000}.${sig}`;
    assert.equal(await auth.verifySessionValue(secret, tampered, now), false);
});

test('篡改签名后验证失败', async () => {
    const auth = await loadAuth();
    const secret = randomSecret();
    const now = Date.now();
    const value = await auth.signSessionValue(secret, now + 60_000);
    const tampered = `${value.slice(0, -1)}${value.endsWith('0') ? '1' : '0'}`;
    assert.equal(await auth.verifySessionValue(secret, tampered, now), false);
});

test('已过期的 cookie 视为未登录', async () => {
    const auth = await loadAuth();
    const secret = randomSecret();
    const now = Date.now();
    const value = await auth.signSessionValue(secret, now - 1_000);
    assert.equal(await auth.verifySessionValue(secret, value, now), false);
});

test('格式非法的 cookie 值一律拒绝（fail closed）', async () => {
    const auth = await loadAuth();
    const secret = randomSecret();
    const now = Date.now();
    for (const bad of ['', 'abc', '123', 'abc.def', `${now}.zz`, `${now}.${'a'.repeat(64)}`, `${'x'.repeat(20)}.abcd`]) {
        assert.equal(await auth.verifySessionValue(secret, bad, now), false, `应拒绝: ${bad}`);
    }
});

test('从 Cookie 请求头中提取指定 cookie，多 cookie 与缺失场景', async () => {
    const auth = await loadAuth();
    const secret = randomSecret();
    const value = await auth.signSessionValue(secret, Date.now() + 60_000);
    assert.equal(
        await auth.isLoggedIn(secret, `theme=dark; ${auth.COOKIE_NAME}=${value}; other=1`),
        true,
    );
    assert.equal(await auth.isLoggedIn(secret, 'theme=dark'), false);
    assert.equal(await auth.isLoggedIn(secret, null), false);
});

test('Set-Cookie 字符串包含 HttpOnly / Secure / SameSite=Lax / 7 天有效期', async () => {
    const auth = await loadAuth();
    const value = await auth.signSessionValue(randomSecret(), Date.now() + 60_000);
    const header = auth.buildSetCookie(value);
    assert.match(header, /HttpOnly/);
    assert.match(header, /Secure/);
    assert.match(header, /SameSite=Lax/);
    assert.match(header, new RegExp(`Max-Age=${7 * 24 * 3600}`));
    assert.match(header, /Path=\/second-brain/);
    assert.ok(header.startsWith(`${auth.COOKIE_NAME}=${value}`));
});

// ---------- 密码哈希校验（PBKDF2-HMAC-SHA256，盐内嵌在哈希串中） ----------

test('正确密码校验通过，错误密码失败', async () => {
    const auth = await loadAuth();
    const password = randomPassword();
    const stored = buildHash(password);
    assert.equal(await auth.verifyPassword(stored, password), true);
    assert.equal(await auth.verifyPassword(stored, randomPassword()), false);
});

test('损坏或缺失的哈希配置一律校验失败（fail closed）', async () => {
    const auth = await loadAuth();
    const password = randomPassword();
    for (const bad of [null, undefined, '', 'plaintext', 'pbkdf2:abc::', 'sha256:1000:ab:cd', `md5:1000:${'ab'.repeat(16)}:${'cd'.repeat(32)}`]) {
        assert.equal(await auth.verifyPassword(bad, password), false, `应拒绝: ${String(bad)}`);
    }
    assert.equal(await auth.verifyPassword(null, null), false);
});

// ---------- 登录失败限次锁定（同一来源连续错 5 次锁 15 分钟） ----------

test('连续错 4 次不锁，第 5 次触发 15 分钟锁定', async () => {
    const auth = await loadAuth();
    let clock = 1_000_000;
    const limiter = auth.createLoginLimiter({ now: () => clock });
    for (let i = 1; i <= 4; i++) {
        assert.equal(limiter.registerFailure('ip-a'), null, `第 ${i} 次不应锁定`);
        assert.equal(limiter.isLocked('ip-a'), false);
    }
    assert.equal(limiter.registerFailure('ip-a'), 15 * 60, '第 5 次应返回锁定秒数');
    assert.equal(limiter.isLocked('ip-a'), true);
    // 锁定期间即使等待片刻仍然锁着
    clock += 60_000;
    assert.equal(limiter.isLocked('ip-a'), true);
});

test('锁定到期后自动解锁，且计数从头开始', async () => {
    const auth = await loadAuth();
    let clock = 1_000_000;
    const limiter = auth.createLoginLimiter({ now: () => clock });
    for (let i = 0; i < 5; i++) limiter.registerFailure('ip-a');
    assert.equal(limiter.isLocked('ip-a'), true);
    clock += 15 * 60 * 1000 + 1;
    assert.equal(limiter.isLocked('ip-a'), false, '到期应解锁');
    assert.equal(limiter.registerFailure('ip-a'), null, '解锁后计数应重新开始');
});

test('登录成功会清空失败计数', async () => {
    const auth = await loadAuth();
    const limiter = auth.createLoginLimiter();
    for (let i = 0; i < 4; i++) limiter.registerFailure('ip-a');
    limiter.reset('ip-a');
    assert.equal(limiter.registerFailure('ip-a'), null, '清零后第 1 次失败不应触发锁定');
});

test('不同来源互不影响', async () => {
    const auth = await loadAuth();
    const limiter = auth.createLoginLimiter();
    for (let i = 0; i < 5; i++) limiter.registerFailure('ip-a');
    assert.equal(limiter.isLocked('ip-a'), true);
    assert.equal(limiter.isLocked('ip-b'), false);
});

// ---------- R2 路径映射与 Content-Type ----------

test('URL 路径映射为 R2 key（含目录默认页）', async () => {
    const auth = await loadAuth();
    assert.equal(auth.r2KeyFromPathname('/second-brain/'), 'index.html');
    assert.equal(auth.r2KeyFromPathname('/second-brain'), 'index.html');
    assert.equal(auth.r2KeyFromPathname('/second-brain/index.html'), 'index.html');
    assert.equal(auth.r2KeyFromPathname('/second-brain/private-data/demo.js'), 'private-data/demo.js');
    assert.equal(auth.r2KeyFromPathname('/second-brain/private-data/'), 'private-data/index.html');
    assert.equal(auth.r2KeyFromPathname('/second-brain/a%20b/c%2Bd.txt'), 'a b/c+d.txt');
});

test('包含路径穿越或非法编码的路径被拒绝', async () => {
    const auth = await loadAuth();
    assert.equal(auth.r2KeyFromPathname('/second-brain/../secret'), null);
    assert.equal(auth.r2KeyFromPathname('/second-brain/a/../../secret'), null);
    assert.equal(auth.r2KeyFromPathname('/second-brain/%2e%2e/secret'), null);
    assert.equal(auth.r2KeyFromPathname('/second-brain/%zz'), null);
    assert.equal(auth.r2KeyFromPathname(null), null);
});

test('按扩展名返回正确的 Content-Type，未知扩展名回退 octet-stream', async () => {
    const auth = await loadAuth();
    assert.match(auth.contentTypeFor('a/index.html'), /^text\/html/);
    assert.match(auth.contentTypeFor('x.js'), /javascript/);
    assert.match(auth.contentTypeFor('x.css'), /^text\/css/);
    assert.match(auth.contentTypeFor('x.json'), /^application\/json/);
    assert.match(auth.contentTypeFor('x.svg'), /^image\/svg/);
    assert.match(auth.contentTypeFor('x.png'), /^image\/png/);
    assert.equal(auth.contentTypeFor('x.unknownext'), 'application/octet-stream');
});
