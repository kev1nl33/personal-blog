const assert = require('node:assert/strict');
const {test} = require('node:test');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '../scripts/theme-init.js'), 'utf8');

function boot({saved = null, dark = false, blocked = false, legacy = false} = {}) {
  let schemeListener;
  const windowListeners = new Map();
  const documentListeners = new Map();
  const events = [];
  const root = {dataset: {}};
  const scheme = {matches: dark};
  scheme[legacy ? 'addListener' : 'addEventListener'] = (...args) => { schemeListener = args.at(-1); };
  const storage = {theme: saved};
  const localStorage = {
    getItem(key) { if (blocked) throw Error('Storage blocked'); return storage[key] ?? null; },
    setItem(key, value) { if (blocked) throw Error('Storage blocked'); storage[key] = value; },
    removeItem(key) { if (blocked) throw Error('Storage blocked'); storage[key] = null; },
  };
  const add = (map) => (type, fn) => {
    if (!map.has(type)) map.set(type, []);
    map.get(type).push(fn);
  };
  const window = {
    matchMedia: () => scheme,
    dispatchEvent: event => events.push(event),
    addEventListener: add(windowListeners),
  };
  const document = {
    documentElement: root,
    visibilityState: 'visible',
    addEventListener: add(documentListeners),
  };
  vm.runInNewContext(source, {
    window,
    document,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    localStorage,
  });
  return {
    window,
    document,
    root,
    storage,
    events,
    change(nextDark) {
      scheme.matches = nextDark;
      schemeListener({matches: nextDark});
    },
    setSystemWithoutEvent(nextDark) {
      scheme.matches = nextDark;
    },
    pageshow(persisted = true) {
      for (const fn of windowListeners.get('pageshow') || []) fn({persisted});
    },
    visibility(state) {
      document.visibilityState = state;
      for (const fn of documentListeners.get('visibilitychange') || []) fn();
    },
    storageChange(key, newValue) {
      if (key === null) storage.theme = null;
      else storage[key] = newValue;
      for (const fn of windowListeners.get('storage') || []) {
        fn({key, newValue, storageArea: localStorage});
      }
    },
  };
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

test('首屏已存偏好与当前系统相反时保留覆盖，相同则自动清理历史锁定', () => {
  const overrideApp = boot({saved: 'light', dark: true});
  assert.equal(overrideApp.root.dataset.theme, 'light');
  assert.equal(overrideApp.storage.theme, 'light');

  const staleApp = boot({saved: 'dark', dark: true});
  assert.equal(staleApp.root.dataset.theme, 'dark');
  assert.equal(staleApp.storage.theme, null);
  staleApp.change(false);
  assert.equal(staleApp.root.dataset.theme, 'light');
});

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
  test(`手动切回与系统一致时自动清除覆盖并恢复跟随，存储受限=${blocked}`, () => {
    const app = boot({dark: true, blocked});
    app.window.siteTheme.set('light');
    assert.equal(app.root.dataset.theme, 'light');
    if (!blocked) assert.equal(app.storage.theme, 'light');

    app.window.siteTheme.set('dark');
    assert.equal(app.root.dataset.theme, 'dark');
    assert.equal(app.storage.theme, null);

    app.change(false);
    assert.equal(app.root.dataset.theme, 'light');
    app.change(true);
    assert.equal(app.root.dataset.theme, 'dark');
  });

  test(`手动覆盖后系统下一次切换深浅色时自动重新接管，存储受限=${blocked}`, () => {
    const app = boot({dark: false, blocked});
    app.window.siteTheme.set('dark');
    assert.equal(app.root.dataset.theme, 'dark');
    if (!blocked) assert.equal(app.storage.theme, 'dark');

    // 系统未变化时，切后台再回来不丢手动覆盖
    app.visibility('hidden');
    app.visibility('visible');
    assert.equal(app.root.dataset.theme, 'dark');

    // 系统切到 dark：解除覆盖，保持 dark 且不再写锁
    app.change(true);
    assert.equal(app.root.dataset.theme, 'dark');
    assert.equal(app.storage.theme, null);

    // 之后系统切回 light：自动跟随
    app.change(false);
    assert.equal(app.root.dataset.theme, 'light');
    assert.equal(app.storage.theme, null);
  });
}

test('休眠唤醒或 bfcache 恢复时通过 pageshow / visibilitychange 补同步系统变化', () => {
  const app = boot({dark: false});
  app.window.siteTheme.set('dark');
  assert.equal(app.storage.theme, 'dark');

  // 模拟后台/休眠期间系统切为深色但未收到 change 事件
  app.setSystemWithoutEvent(true);
  app.visibility('visible');
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(app.storage.theme, null);

  // 再次在 bfcache 中切回浅色
  app.setSystemWithoutEvent(false);
  app.pageshow(true);
  assert.equal(app.root.dataset.theme, 'light');
});

test('多标签页通过 storage 事件实时同步手动覆盖与恢复自动', () => {
  const app = boot({dark: false});
  app.storageChange('other', 'dark');
  assert.equal(app.root.dataset.theme, 'light');

  app.storageChange('theme', 'dark');
  assert.equal(app.root.dataset.theme, 'dark');

  app.storageChange('theme', null);
  assert.equal(app.root.dataset.theme, 'light');

  app.storageChange('theme', 'dark');
  assert.equal(app.root.dataset.theme, 'dark');
  app.storageChange(null, null);
  assert.equal(app.root.dataset.theme, 'light');

  // bfcache 返回时同步其他页面写入的覆盖
  app.storage.theme = 'dark';
  app.pageshow(true);
  assert.equal(app.root.dataset.theme, 'dark');
});

test('siteTheme.reset 主动清除覆盖并回到系统主题', () => {
  const app = boot({dark: true});
  app.window.siteTheme.set('light');
  assert.equal(app.root.dataset.theme, 'light');
  app.window.siteTheme.reset();
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(app.storage.theme, null);
});

test('非法存储值视为无手动偏好，兼容旧式媒体查询监听', () => {
  const app = boot({saved: 'invalid', dark: true, legacy: true});
  assert.equal(app.root.dataset.theme, 'dark');
  app.change(false);
  assert.equal(app.root.dataset.theme, 'light');
});
