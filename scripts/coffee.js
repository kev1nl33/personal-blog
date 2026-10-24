document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gear-image img').forEach(image => {
    const fallback = document.createElement('span');
    fallback.className = 'equipment-photo-fallback';
    fallback.textContent = image.alt;
    fallback.hidden = true;
    image.closest('figure').appendChild(fallback);
    function showFallback() {
      // 公共脚本先尝试 JPG 回退，只有 JPG 也失败才显示文字。
      if (image.closest('picture')?.querySelector('source')) return;
      image.hidden = true;
      fallback.hidden = false;
    }
    image.addEventListener('error', showFallback);
    if (image.complete && !image.naturalWidth) showFallback();
  });

  const links = [...document.querySelectorAll('.coffee-index a')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    const candidates = sections.filter(section => visible.has(section));
    const current = candidates.filter(section => section.getBoundingClientRect().top <= 200).at(-1) || candidates[0];
    links.forEach(link => {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-64px 0px -35% 0px' });
  sections.forEach(section => observer.observe(section));
});
