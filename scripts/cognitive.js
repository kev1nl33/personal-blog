/* Progressive enhancement: all 108 guides and links live in visual-design.html. */
(() => {
  'use strict';

  // Editorial synonyms connect everyday language to the methods' real use cases.
  const problemAliases = [
    {terms: ['拖延', '开始不了', '动不了', '下不了手', '任务太大', '事情太多', '做不完'], ids: [12, 82, 15, 16, 14]},
    {terms: ['选择困难', '选哪个', '怎么选', '做决定', '做决策', '选不出', '纠结'], ids: [65, 66, 62, 61, 85]},
    {terms: ['述职', '面试', '汇报', '说不清价值', '成果'], ids: [33, 32, 26, 37, 95]},
    {terms: ['学了就忘', '学过就忘', '记不住', '转身就忘', '记忆', '遗忘'], ids: [8, 1, 2, 3]},
    {terms: ['跳槽', '辞职', '职业方向', '转行', '工作意义'], ids: [42, 41, 46, 44, 65]},
    {terms: ['内耗', '反复想', '想太多', '放不下', '玻璃心', '被批评'], ids: [56, 55, 21, 59]},
    {terms: ['副业', '创业', '验证想法', '验证需求', '值不值得做'], ids: [74, 68, 39, 43, 103]},
    {terms: ['焦虑', '情绪', '难受', '压力', '生气', '发火'], ids: [55, 57, 58, 77, 59]},
    {terms: ['学不会', '学不进去', '学习', '听课', '囤课'], ids: [1, 2, 5, 4, 8]},
    {terms: ['说不清', '表达', '说话', '讲不清', '抓不住重点'], ids: [26, 37, 2, 36]},
    {terms: ['复盘', '犯同样', '重复犯错', '总结', '同样的错'], ids: [17, 19, 18, 20, 22]},
    {terms: ['会议', '开会', '讨论', '跑题'], ids: [35, 27, 29, 31]},
    {terms: ['团队', '管理', '带人', '下属', '领导'], ids: [47, 53, 34, 50, 51]},
    {terms: ['加班', '忙了一天', '忙碌', '效率', '专注', '没进展'], ids: [15, 10, 45, 81, 9]},
    {terms: ['坚持', '习惯', '自律', '三分钟热度'], ids: [82, 14, 5, 16]},
    {terms: ['目标', '计划'], ids: [16, 12, 46, 22]},
    {terms: ['放弃', '沉没成本', '止损', '回本'], ids: [63, 66, 67, 61]},
    {terms: ['写作', '文案', '内容', '没人看', '吸引读者'], ids: [91, 95, 93, 94, 92]},
    {terms: ['客户', '卖不掉', '没人买', '销量', '转化'], ids: [68, 75, 70, 71, 69]},
    {terms: ['沟通', '关系', '冲突', '倾听'], ids: [97, 36, 77, 96, 101]},
    {terms: ['安慰', '共情'], ids: [101, 97, 99]},
    {terms: ['资源', '合作'], ids: [88, 105, 104]},
    {terms: ['存钱', '花钱', '月光', '支出'], ids: [106, 104]},
    {terms: ['财务', '收入', '赚钱'], ids: [103, 106, 84, 108]},
  ];

  function normalize(value) {
    return String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  function scoreTool(record, query) {
    const q = normalize(query);
    if (!q) return 1;
    const text = normalize(record.text);
    const model = normalize(record.model);
    const number = Number(record.number);
    if (/^\d{1,3}$/.test(q)) return number === Number(q) ? 500 : 0;
    let score = model.includes(q) ? 300 : (text.includes(q) ? 100 : 0);
    for (const group of problemAliases) {
      if (!group.terms.some(term => q.includes(term))) continue;
      const position = group.ids.indexOf(number);
      if (position >= 0) score = Math.max(score, 200 - position * 8);
    }
    // Small, deterministic Chinese phrase matching; no remote service or generated answers.
    const phrases = q.replace(/我最近|我现在|我总是|我想|我该|怎么办|为什么|不知道|怎么|如何/g, '')
      .match(/[\u4e00-\u9fff]{2,}|[a-z][a-z0-9-]+/g) || [];
    for (const phrase of phrases) {
      if (text.includes(phrase)) score = Math.max(score, 70);
      if (!/^[\u4e00-\u9fff]+$/.test(phrase) || phrase.length < 4) continue;
      const pairs = [...new Set(Array.from({length: phrase.length - 1}, (_, i) => phrase.slice(i, i + 2)))];
      const matches = pairs.filter(pair => text.includes(pair)).length;
      if (matches >= 2 && matches / pairs.length >= 0.65) score = Math.max(score, 40 + matches);
    }
    return score;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = {scoreTool};
  if (typeof document === 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('tool-grid');
    if (!grid) return;
    const input = document.getElementById('tool-search');
    const form = document.getElementById('tool-search-form');
    const count = document.getElementById('results-count');
    const heading = document.getElementById('results-title');
    const clear = document.getElementById('clear-tools');
    const more = document.getElementById('show-more-tools');
    const visibleCount = document.getElementById('visible-tools');
    const empty = document.getElementById('tool-empty');
    const topics = [...document.querySelectorAll('[data-topic]')];
    const shortcuts = [...document.querySelectorAll('[data-query]')];
    const records = [...grid.querySelectorAll('.tool-card')].map((card, index) => ({
      card, index, number: card.dataset.number, topics: card.dataset.topics.split(' '),
      model: card.querySelector('.tool-model strong').textContent,
      text: `${card.textContent} ${card.dataset.keywords}`,
    }));
    let topic = 'all';
    let limit = 12;
    let matches = [];
    let composing = false;
    let inputTimer;

    function updateUrl(mode) {
      const url = new URL(window.location.href);
      const query = input.value.trim();
      if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
      if (topic !== 'all') url.searchParams.set('topic', topic); else url.searchParams.delete('topic');
      // A search supersedes any deep link to a tool that might now be hidden.
      url.hash = '';
      if (url.href !== window.location.href) window.history[mode === 'push' ? 'pushState' : 'replaceState']({cognitiveLimit: limit}, '', url);
    }

    function render({save = null} = {}) {
      const query = input.value.trim();
      matches = records.map(record => ({...record, score: scoreTool(record, query)}))
        .filter(record => record.score > 0 && (topic === 'all' || record.topics.includes(topic)))
        .sort((a, b) => b.score - a.score || a.index - b.index);
      records.forEach(record => { record.card.hidden = true; });
      matches.forEach((record, index) => {
        record.card.hidden = index >= limit;
        grid.appendChild(record.card);
      });
      const activeTopic = topics.find(button => button.dataset.topic === topic);
      const topicName = activeTopic.firstChild.textContent.trim();
      heading.textContent = query ? `关于“${query}”的方法` : (topic === 'all' ? '从这些常见问题开始' : `${topicName}，可以从这里开始`);
      count.textContent = `${topic === 'all' ? '' : topicName + ' · '}共 ${matches.length} 个${query ? '相关' : ''}方法${query ? '，按匹配程度排列' : ''}`;
      clear.hidden = !query && topic === 'all';
      empty.hidden = matches.length !== 0;
      more.hidden = limit >= matches.length;
      more.textContent = `继续看 ${Math.min(12, Math.max(0, matches.length - limit))} 个问题 ↓`;
      visibleCount.hidden = matches.length === 0;
      visibleCount.textContent = `已显示 ${Math.min(limit, matches.length)} / ${matches.length}`;
      topics.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
      shortcuts.forEach(button => button.setAttribute('aria-pressed', String(query === button.dataset.query && topic === 'all')));
      if (save) updateUrl(save);
    }

    function focusResults() {
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll: true});
      heading.scrollIntoView({block: 'start', behavior: 'instant'});
    }

    function reset() {
      clearTimeout(inputTimer);
      input.value = '';
      topic = 'all';
      limit = 12;
      render({save: 'push'});
      focusResults();
    }

    function restore() {
      clearTimeout(inputTimer);
      const params = new URLSearchParams(window.location.search);
      input.value = (params.get('q') || '').slice(0, 120);
      topic = topics.some(button => button.dataset.topic === params.get('topic')) ? params.get('topic') : 'all';
      const savedLimit = window.history.state?.cognitiveLimit;
      limit = Number.isInteger(savedLimit) ? Math.max(12, Math.min(records.length, savedLimit)) : 12;
      render();
      const linkedTool = matches.findIndex(record => `#${record.card.id}` === window.location.hash);
      if (linkedTool >= 0) {
        limit = Math.max(limit, linkedTool + 1);
        render();
        matches[linkedTool].card.scrollIntoView({block: 'center'});
      }
    }

    function handleInput() {
      if (composing) return;
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => { limit = 12; render(); }, 120);
    }
    input.addEventListener('compositionstart', () => { composing = true; clearTimeout(inputTimer); });
    input.addEventListener('compositionend', () => { composing = false; handleInput(); });
    input.addEventListener('input', handleInput);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (composing) return;
      clearTimeout(inputTimer);
      limit = 12;
      render({save: 'push'});
      focusResults();
    });
    topics.forEach(button => button.addEventListener('click', () => {
      clearTimeout(inputTimer);
      topic = button.dataset.topic;
      limit = 12;
      render({save: 'push'});
    }));
    shortcuts.forEach(button => button.addEventListener('click', () => {
      clearTimeout(inputTimer);
      input.value = button.dataset.query;
      topic = 'all';
      limit = 12;
      render({save: 'push'});
      focusResults();
    }));
    clear.addEventListener('click', reset);
    document.getElementById('empty-reset').addEventListener('click', reset);
    more.addEventListener('click', () => {
      const firstNew = limit;
      limit += 12;
      window.history.replaceState({...window.history.state, cognitiveLimit: limit}, '', window.location.href);
      render();
      matches[firstNew]?.card.querySelector('.tool-question a').focus({preventScroll: true});
    });
    grid.addEventListener('click', event => {
      if (event.target.closest('a')) {
        clearTimeout(inputTimer);
        updateUrl('push');
        window.history.replaceState({...window.history.state, cognitiveLimit: limit}, '', window.location.href);
      }
    });
    window.addEventListener('popstate', restore);
    restore();
  });
})();
