const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {scoreEntry, searchEntries, snippetFor, normalize} = require('../scripts/search.js');

const entries = JSON.parse(fs.readFileSync(path.join(__dirname, '../search-index.json'), 'utf8'));
const urls = query => searchEntries(entries, query, 20).map(entry => entry.url);

test('中文子串直接命中，不依赖空格分词', () => {
    assert.ok(urls('旅行').length > 0);
    assert.ok(urls('旅行').includes('travel-japan-2023.html'));
    assert.ok(urls('旅行').includes('travel.html'));
    assert.equal(urls('32岁')[0], 'turning-32-mid-tier-reboot.html');
    assert.equal(urls('中登')[0], 'turning-32-mid-tier-reboot.html');
    assert.ok(urls('辞职').includes('borrowed-uniform.html'));
});

test('短英文查询按大小写不敏感匹配', () => {
    assert.deepEqual(urls('ai'), urls('AI'));
    assert.deepEqual(urls('Naval'), urls('naval'));
    assert.equal(urls('naval')[0], 'five-iron-rules-naval.html');
});

test('标题命中排在只有正文命中的页面之前', () => {
    const ranked = urls('32岁');
    assert.equal(ranked[0], 'turning-32-mid-tier-reboot.html');
    const titleOnly = {url: 'a.html', title: '旅行笔记', description: '', keywords: '', content: ''};
    const bodyOnly = {url: 'b.html', title: '随笔', description: '', keywords: '', content: '旅行笔记'.repeat(50)};
    assert.ok(scoreEntry(titleOnly, '旅行') > scoreEntry(bodyOnly, '旅行'));
    assert.equal(searchEntries([bodyOnly, titleOnly], '旅行')[0].url, 'a.html');
});

test('多个关键词必须同时出现', () => {
    const entry = {url: 'c.html', title: '澳大利亚旅行', description: '', keywords: '', content: ''};
    assert.ok(scoreEntry(entry, '旅行 澳大利亚') > 0);
    assert.equal(scoreEntry(entry, '旅行 咖啡'), 0);
});

test('全角字符与不规范空格会被归一化', () => {
    assert.equal(normalize('　ＡＩ　写作 '), 'ai 写作');
    assert.deepEqual(urls(' ａｉ '), urls('AI'));
});

test('无匹配时返回空数组，不做模糊兜底', () => {
    assert.deepEqual(urls('xyzabc987'), []);
    assert.deepEqual(urls('<script>alert(1)</script>'), []);
    assert.deepEqual(urls('   '), []);
});

test('搜索结果附带可读摘要', () => {
    const entry = entries.find(item => item.url === 'travel-australia-2026.html');
    const snippet = snippetFor(entry, '旅行');
    assert.ok(snippet.includes('旅行'));
    assert.ok(snippet.length <= 122);
});

test('索引覆盖核心页面且不含咖啡页', () => {
    const indexed = new Set(entries.map(entry => entry.url));
    for (const page of ['index.html', 'blog.html', 'travel.html', 'turning-32-mid-tier-reboot.html', 'travel-australia-2026.html']) {
        assert.ok(indexed.has(page), `${page} 应该出现在搜索索引中`);
    }
    assert.equal(entries.filter(entry => entry.url.startsWith('coffee')).length, 0);
});
