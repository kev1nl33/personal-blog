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
});
