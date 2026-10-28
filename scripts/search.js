/* 全站搜索：匹配逻辑与弹层交互。
 * 匹配函数同时导出给 node --test 使用；DOM 部分只在浏览器里初始化。 */
(() => {
  'use strict';

  const FIELD_WEIGHTS = {title: 48, keywords: 18, description: 12, content: 4};
  const MAX_SNIPPET = 96;

  function normalize(value) {
    return String(value || '')
      .normalize('NFKC')
      .toLocaleLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function termsOf(query) {
    return normalize(query).split(' ').filter(Boolean);
  }

  function countOccurrences(haystack, needle) {
    if (!needle) return 0;
    let count = 0;
    let from = 0;
    while (count < 3) {
      const index = haystack.indexOf(needle, from);
      if (index === -1) break;
      count += 1;
      from = index + needle.length;
    }
    return count;
  }

  // 中文不做分词：查询串按原样子串匹配；有空格时视为多个条件同时满足。
  function scoreEntry(entry, query) {
    const terms = termsOf(query);
    if (!terms.length) return 0;

    const fields = {
      title: normalize(entry.title),
      keywords: normalize(entry.keywords),
      description: normalize(entry.description),
      content: normalize(entry.content),
    };
    const phrase = terms.join(' ');
    let score = 0;

    for (const term of terms) {
      let matched = false;
      for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
        const occurrences = countOccurrences(fields[field], term);
        if (!occurrences) continue;
        matched = true;
        // 同一字段只计一次权重，标题里多次出现再额外加分但设上限。
        score += weight + (field === 'title' ? (occurrences - 1) * 6 : 0);
      }
      if (!matched) return 0;
    }

    if (fields.title.includes(phrase)) score += 80;
    if (fields.title.startsWith(phrase)) score += 20;
    if (fields.title === phrase) score += 60;
    if (fields.description.includes(phrase)) score += 10;
    return score;
  }

  const RESULTS_LIMIT = 8;

  function searchEntries(entries, query, limit = RESULTS_LIMIT) {
    const scored = [];
    for (const entry of entries) {
      const score = scoreEntry(entry, query);
      if (score > 0) scored.push({entry, score});
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(item => ({...item.entry, score: item.score}));
  }

  function snippetFor(entry, query) {
    const terms = termsOf(query);
    // 优先用页面自己的摘要；摘要里没有命中词时（例如列表页）再回落到正文片段。
    const candidates = [entry.description, entry.content].filter(Boolean);
    for (const text of candidates) {
      const haystack = text.toLocaleLowerCase();
      const firstHit = Math.min(...terms.map(term => haystack.indexOf(term)).filter(index => index >= 0));
      if (!Number.isFinite(firstHit)) continue;

      // 命中词前最近的句子边界，距离不太远就从那里开始，读者能看到完整一句。
      const sentence = Math.max(
        text.lastIndexOf('。', firstHit - 1),
        text.lastIndexOf('！', firstHit - 1),
        text.lastIndexOf('？', firstHit - 1),
        text.lastIndexOf('. ', firstHit - 1)
      );
      let start = sentence >= 0 && firstHit - sentence <= 80 ? sentence + 1 : Math.max(0, firstHit - 20);
      // 兜底截断时退到最近的空格，避免从英文单词中间开始。
      if (start > 0 && start < firstHit) {
        const space = text.lastIndexOf(' ', firstHit);
        if (space >= start && firstHit - space < 24) start = space + 1;
      }

      const snippet = text.slice(start, start + MAX_SNIPPET).trim();
      return `${start > 0 ? '…' : ''}${snippet}${text.length > start + MAX_SNIPPET ? '…' : ''}`;
    }
    return entry.description || entry.content || '';
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightInto(parent, text, query) {
    const terms = termsOf(query);
    if (!terms.length || !text) {
      parent.textContent = text;
      return;
    }
    const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
    let last = 0;
    for (const match of text.matchAll(pattern)) {
      if (match.index > last) parent.append(text.slice(last, match.index));
      const mark = document.createElement('mark');
      mark.textContent = match[0];
      parent.append(mark);
      last = match.index + match[0].length;
    }
    if (last < text.length) parent.append(text.slice(last));
  }

  const api = {normalize, termsOf, scoreEntry, searchEntries, snippetFor};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  const INDEX_URL = '/search-index.json';
  const CACHE_KEY = 'site-search-index-v1';
  const state = {entries: [], loading: null, loaded: false, dialog: null, active: -1, results: [], opener: null};

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      return Array.isArray(cached) && cached.length ? cached : null;
    } catch (error) {
      return null;
    }
  }

  function writeCache(entries) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
    } catch (error) {
      // 隐私模式或配额不足时忽略，搜索仍可在本次访问内使用。
    }
  }

  function loadIndex() {
    if (state.loaded) return Promise.resolve(state.entries);
    if (state.loading) return state.loading;
    state.loading = fetch(INDEX_URL, {credentials: 'same-origin', cache: 'no-cache'})
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(entries => {
        state.entries = Array.isArray(entries) ? entries : [];
        state.loaded = true;
        writeCache(state.entries);
        return state.entries;
      })
      .catch(error => {
        state.loading = null;
        // 断网时退回上次成功写入本地的索引。
        const cached = readCache();
        if (cached) {
          state.entries = cached;
          state.loaded = true;
          return state.entries;
        }
        throw error;
      });
    return state.loading;
  }

  function buildDialog() {
    if (state.dialog) return state.dialog;

    const root = document.createElement('div');
    root.className = 'site-search';
    root.hidden = true;
    root.innerHTML = `
      <div class="site-search-backdrop" data-search-close></div>
      <div class="site-search-panel" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
        <h2 class="sr-only" id="site-search-title">全站搜索</h2>
        <div class="site-search-bar">
          <svg class="site-search-icon" aria-hidden="true" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="m13 13 4 4"></path></svg>
          <input class="site-search-input" id="site-search-input" type="search" role="combobox"
                 aria-expanded="false" aria-controls="site-search-results" aria-autocomplete="list"
                 aria-describedby="site-search-status" placeholder="搜索文章、游记、页面…"
                 autocomplete="off" spellcheck="false">
          <button class="site-search-close" type="button" data-search-close aria-label="关闭搜索">Esc</button>
        </div>
        <p class="site-search-status" id="site-search-status" role="status" aria-live="polite"></p>
        <ul class="site-search-results" id="site-search-results" role="listbox" aria-label="搜索结果"></ul>
        <div class="site-search-foot" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><kbd>Enter</kbd> 打开</span>
          <span><kbd>Esc</kbd> 关闭</span>
        </div>
      </div>`;
    document.body.append(root);

    const input = root.querySelector('.site-search-input');
    const list = root.querySelector('.site-search-results');
    const status = root.querySelector('.site-search-status');

    root.querySelectorAll('[data-search-close]').forEach(element => {
      element.addEventListener('click', () => close());
    });
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        move(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        move(-1);
      } else if (event.key === 'Enter') {
        const target = state.results[state.active] || state.results[0];
        if (target) {
          event.preventDefault();
          window.location.href = '/' + target.url;
        }
      } else if (event.key === 'Tab') {
        const stops = [input, root.querySelector('.site-search-close')];
        const current = stops.indexOf(document.activeElement);
        if (event.shiftKey && current <= 0) {
          event.preventDefault();
          stops[1].focus();
        } else if (!event.shiftKey && current === stops.length - 1) {
          event.preventDefault();
          stops[0].focus();
        }
      }
    });
    list.addEventListener('click', event => {
      if (event.target.closest('a')) close({restoreFocus: false});
    });

    state.dialog = {root, input, list, status};
    return state.dialog;
  }

  function setStatus(message) {
    state.dialog.status.textContent = message;
  }

  function render(query) {
    const {input, list} = state.dialog;
    state.results = [];
    state.active = -1;
    list.textContent = '';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');

    if (!normalize(query)) {
      setStatus('输入关键词开始搜索，中文、英文都可以。');
      return;
    }
    if (!state.loaded) {
      setStatus('正在载入搜索索引…');
      loadIndex()
        .then(() => {
          if (!state.dialog.root.hidden && state.dialog.input.value === query) render(query);
        })
        .catch(() => {
          if (!state.dialog.root.hidden) setStatus('搜索索引暂时无法载入，请检查网络后重新打开。');
        });
      return;
    }

    const results = searchEntries(state.entries, query);
    state.results = results;
    state.dialog.list.scrollTop = 0;
    if (!results.length) {
      setStatus(`没有找到与「${query.trim()}」相关的页面，换个词试试。`);
      return;
    }

    setStatus(`找到 ${results.length} 个结果`);
    const fragment = document.createDocumentFragment();
    results.forEach((entry, index) => {
      const item = document.createElement('li');
      item.className = 'site-search-result';
      item.id = `site-search-option-${index}`;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');

      const link = document.createElement('a');
      link.href = '/' + entry.url;
      link.tabIndex = -1;

      const title = document.createElement('span');
      title.className = 'site-search-result-title';
      highlightInto(title, entry.title, query);

      const description = document.createElement('span');
      description.className = 'site-search-result-desc';
      highlightInto(description, snippetFor(entry, query), query);

      link.append(title, description);
      item.append(link);
      fragment.append(item);
    });
    list.append(fragment);
    input.setAttribute('aria-expanded', 'true');
  }

  function move(step) {
    if (!state.results.length) return;
    const total = state.results.length;
    state.active = state.active === -1
      ? (step > 0 ? 0 : total - 1)
      : (state.active + step + total) % total;
    const options = state.dialog.list.children;
    for (let index = 0; index < options.length; index += 1) {
      options[index].setAttribute('aria-selected', String(index === state.active));
    }
    const active = options[state.active];
    state.dialog.input.setAttribute('aria-activedescendant', active.id);
    const list = state.dialog.list;
    const top = active.offsetTop;
    const bottom = top + active.offsetHeight;
    // 列表自身滚动，避免 scrollIntoView 连带滚动背后的页面。
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }

  function open(opener = document.activeElement) {
    const dialog = buildDialog();
    const {root, input} = dialog;
    if (!root.hidden) return;

    // 手机端导航抽屉打开时先收起，避免两层遮罩叠在一起。
    const toggle = document.querySelector('.nav-toggle');
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') toggle.click();

    state.opener = opener && opener !== document.body ? opener : document.querySelector('[data-search-open]');
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    render('');
    input.focus({preventScroll: true});

    if (state.loaded) {
      setStatus('输入关键词开始搜索，中文、英文都可以。');
      return;
    }
    loadIndex()
      .then(() => {
        if (!root.hidden) render(input.value);
      })
      .catch(() => {
        if (!root.hidden) setStatus('搜索索引暂时无法载入，请检查网络后重新打开。');
      });
  }

  function close({restoreFocus = true} = {}) {
    const dialog = state.dialog;
    if (!dialog || dialog.root.hidden) return;
    dialog.root.hidden = true;
    document.body.style.overflow = '';
    dialog.input.value = '';
    dialog.list.textContent = '';
    dialog.status.textContent = '';
    state.active = -1;
    state.results = [];
    dialog.input.setAttribute('aria-expanded', 'false');
    dialog.input.removeAttribute('aria-activedescendant');
    if (restoreFocus && state.opener && typeof state.opener.focus === 'function') {
      state.opener.focus({preventScroll: true});
    }
  }

  function isEditable(element) {
    if (!element) return false;
    const tag = element.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
  }

  // 弹层是打开时才创建的；Esc 需要在捕获阶段处理，既不惊动页面其他监听，也能先于它们关闭。
  function onEscape(event) {
    if (event.key !== 'Escape') return;
    if (!state.dialog || state.dialog.root.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  }

  function init() {
    document.addEventListener('keydown', onEscape, true);
    document.querySelectorAll('[data-search-open]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        open();
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key !== '/' || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target)) return;
      if (state.dialog && !state.dialog.root.hidden) return;
      event.preventDefault();
      open();
    });

    // 页面空闲时预取索引，断网后仍可搜索。
    const prefetch = () => loadIndex().catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(prefetch, {timeout: 3000});
    else setTimeout(prefetch, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
})();
