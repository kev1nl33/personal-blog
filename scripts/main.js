/* Shared navigation and restrained feedback. Content is visible before JavaScript. */
/* WebP 变体尚未上传时，<picture> 选中的 source 会 404，浏览器不会自动回退到
   <img> 的 JPG。加载失败时移除该 source 并重新加载 img，页面不会出现空图；
   回退后不再重试，JPG 也失败就保持原样。
   监听挂在 document 上并尽早注册：首屏封面可能在 DOMContentLoaded 前就已失败。 */
document.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const picture = image.closest('picture');
  if (!picture || picture.dataset.jpgFallback === '1') return;
  const source = picture.querySelector('source[type="image/webp"]');
  const fallback = image.getAttribute('src');
  if (!source || !fallback) return;
  picture.dataset.jpgFallback = '1';
  source.remove();
  image.src = fallback;
}, true);
document.addEventListener('DOMContentLoaded', () => {
  /* 脚本执行前就已失败的图不会再触发 error：启动时补扫一遍。 */
  document.querySelectorAll('picture:not([data-jpg-fallback]) > img').forEach((image) => {
    if (image.complete && image.naturalWidth === 0) image.dispatchEvent(new Event('error'));
  });
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

  const themeButton = document.querySelector('.theme-toggle');
  if (themeButton) {
    const labels = {dark: '切换到浅色模式', light: '切换到深色模式'};
    const sun = '<svg class="theme-icon theme-icon--sun" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"></circle><path fill="none" stroke="currentColor" stroke-width="1.6" d="M10 2.2v2.1M10 15.7v2.1M2.2 10h2.1M15.7 10h2.1M4.4 4.4l1.5 1.5M14.1 14.1l1.5 1.5M15.6 4.4l-1.5 1.5M5.9 14.1l-1.5 1.5"></path></svg>';
    const moon = '<svg class="theme-icon theme-icon--moon" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M14.2 11.6A5.4 5.4 0 0 1 8.2 4.4 6.2 6.2 0 1 0 15.6 13a5.4 5.4 0 0 1-1.4-1.4Z"></path></svg>';
    function paintTheme(theme) {
      document.documentElement.dataset.theme = theme;
      const dark = theme === 'dark';
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('aria-label', labels[theme]);
      themeButton.innerHTML = dark ? sun : moon;
    }
    themeButton.hidden = false;
    paintTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    themeButton.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (error) {}
      paintTheme(next);
    });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystem = (event) => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (error) {}
      if (saved === 'light' || saved === 'dark') return;
      paintTheme(event.matches ? 'dark' : 'light');
    };
    if (scheme.addEventListener) scheme.addEventListener('change', followSystem);
    else if (scheme.addListener) scheme.addListener(followSystem);
  }
});
