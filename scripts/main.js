/* Shared navigation and restrained feedback. Content is visible before JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-menu');
  const mobile = window.matchMedia('(max-width: 800px)');
  let previousOverflow = '';
  function setMenu(open, restoreFocus = true) {
    if (!toggle || !menu) return;
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    menu.classList.toggle('is-open', open);
    menu.hidden = mobile.matches && !open;
    if (open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      menu.querySelector('a')?.focus();
    } else if (wasOpen) {
      document.body.style.overflow = previousOverflow;
      if (restoreFocus) toggle.focus();
    }
    menu.hidden = mobile.matches && !open;
  }
  if (toggle && menu) {
    document.documentElement.classList.add('nav-ready');
    toggle.hidden = !mobile.matches;
    setMenu(false, false);
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false, false)));
    document.addEventListener('keydown', event => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
      if (event.key === 'Tab') {
        const stops = [toggle, ...menu.querySelectorAll('a')];
        const current = stops.indexOf(document.activeElement);
        if ((event.shiftKey && current === 0) || (!event.shiftKey && current === stops.length - 1)) {
          event.preventDefault(); stops[event.shiftKey ? stops.length - 1 : 0].focus();
        }
      }
    });
    mobile.addEventListener('change', () => { setMenu(false, false); toggle.hidden = !mobile.matches; });
  }
  const back = document.querySelector('.back-to-top');
  const progress = document.getElementById('reading-progress');
  let ticking = false;
  function updateScroll() {
    nav?.classList.toggle('is-scrolled', scrollY > 12);
    if (back) back.hidden = scrollY < 500;
    if (progress) {
      const total = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${total > 0 ? Math.min(100, scrollY / total * 100) : 0}%`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
  }, {passive:true});
  updateScroll();
  back?.addEventListener('click', () => window.scrollTo({top:0, behavior:reduceMotion.matches ? 'instant' : 'smooth'}));
});
