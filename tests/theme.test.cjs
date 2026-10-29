const assert = require('node:assert/strict');
const {test} = require('node:test');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '../scripts/theme-init.js'), 'utf8');

function boot({saved = null, dark = false, blocked = false, legacy = false} = {}) {
  let listener;
  const events = [];
  const root = {dataset: {}};
  const scheme = {matches: dark};
  scheme[legacy ? 'addListener' : 'addEventListener'] = (...args) => { listener = args.at(-1); };
  const storage = {theme: saved};
  const window = {
    matchMedia: () => scheme,
    dispatchEvent: event => events.push(event),
  };
  vm.runInNewContext(source, {
    window, document: {documentElement: root},
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    localStorage: {
      getItem() { if (blocked) throw Error('Storage blocked'); return storage.theme; },
      setItem(key, value) { if (blocked) throw Error('Storage blocked'); storage[key] = value; },
    },
  });
  return {window, root, storage, events, change(dark) { scheme.matches = dark; listener({matches: dark}); }};
}

for (const dark of [false, true]) {
  test(`首屏无偏好时跟随系统 ${dark}`, () => {
    const app = boot({dark});
    assert.equal(app.root.dataset.theme, dark ? 'dark' : 'light');
    assert.equal(app.storage.theme, null);
  });
  test(`首屏存储受限时仍跟随系统 ${dark}`, () => {
    assert.equal(boot({dark, blocked: true}).root.dataset.theme, dark ? 'dark' : 'light');
  });
}
for (const saved of ['light', 'dark']) {
  test(`已存手动偏好 ${saved} 不受系统变化影响`, () => {
    const app = boot({saved, dark: saved === 'light'});
    app.change(false);
    app.change(true);
    assert.equal(app.root.dataset.theme, saved);
  });
}
test('无偏好时连续跟随系统变化并通知界面，不写入手动偏好', () => {
  const app = boot();
  app.change(true);
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(app.events.at(-1).type, 'themechange');
  assert.equal(app.events.at(-1).detail, 'dark');
  app.change(false);
  assert.equal(app.root.dataset.theme, 'light');
  assert.equal(app.storage.theme, null);
});
for (const blocked of [false, true]) {
  test(`手动切换后锁定当前会话，存储受限=${blocked}`, () => {
    const app = boot({blocked});
    app.window.siteTheme.set('dark');
    app.change(false);
    assert.equal(app.root.dataset.theme, 'dark');
    app.window.siteTheme.set('light');
    app.change(true);
    assert.equal(app.root.dataset.theme, 'light');
    if (!blocked) assert.equal(app.storage.theme, 'light');
  });
}
test('非法存储值视为无手动偏好，兼容旧式媒体查询监听', () => {
  const app = boot({saved: 'invalid', dark: true, legacy: true});
  assert.equal(app.root.dataset.theme, 'dark');
  app.change(false);
  assert.equal(app.root.dataset.theme, 'light');
});
