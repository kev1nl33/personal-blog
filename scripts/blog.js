document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.blog-card')];
  const input = document.getElementById('searchInput');
  const tag = document.getElementById('tagFilter');
  const clear = document.getElementById('searchClear');
  const reset = document.getElementById('resetFilters');
  const count = document.getElementById('searchCount');
  const empty = document.getElementById('searchEmpty');
  const buttons = [...document.querySelectorAll('.category-btn')];
  let category = 'all';
  const records = cards.map(card => ({card, category:card.dataset.category,
    tags:card.dataset.tags.split(',').filter(Boolean),
    text:[card.querySelector('h2').textContent,card.querySelector('p').textContent,card.dataset.tags].join(' ').toLocaleLowerCase()}));
  function applyFilters(save = false) {
    const query = input.value.trim().toLocaleLowerCase();
    let visible = 0;
    records.forEach(record => {
      const match = (category === 'all' || category === record.category) &&
        (tag.value === 'all' || record.tags.includes(tag.value)) && (!query || record.text.includes(query));
      record.card.hidden = !match;
      if (match) visible++;
    });
    buttons.forEach(button => {
      const active = button.dataset.category === category;
      button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active));
    });
    count.textContent = query || category !== 'all' || tag.value !== 'all' ? `已筛选出 ${visible} 篇相关文章` : `共 ${visible} 篇文章`;
    empty.hidden = visible !== 0;
    clear.hidden = input.value === '';
    if (save) {
      const url = new URL(location.href);
      for (const [key,value] of [['category',category === 'all' ? '' : category],['q',input.value],['tag',tag.value === 'all' ? '' : tag.value]]) {
        if (value) url.searchParams.set(key,value); else url.searchParams.delete(key);
      }
      if (url.href !== location.href) history.pushState(null,'',url);
    }
  }
  function restore() {
    const params = new URLSearchParams(location.search);
    category = buttons.some(b => b.dataset.category === params.get('category')) ? params.get('category') : 'all';
    input.value = params.get('q') || '';
    tag.value = [...tag.options].some(o => o.value === params.get('tag')) ? params.get('tag') : 'all';
    applyFilters();
  }
  buttons.forEach(button => button.addEventListener('click', () => {category=button.dataset.category;applyFilters(true);}));
  input.addEventListener('input', () => applyFilters(true));
  tag.addEventListener('change', () => applyFilters(true));
  clear.addEventListener('click', () => { input.value='';applyFilters(true);input.focus(); });
  reset.addEventListener('click', () => { category='all';input.value='';tag.value='all';applyFilters(true);input.focus(); });
  window.addEventListener('popstate', restore);
  window.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable]')) {
      event.preventDefault();input.focus();
    }
  });
  restore();
});
