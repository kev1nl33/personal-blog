/* Restore the original curtain, staggered entrances and tactile pointer feedback.
   Content stays readable without this script; motion never represents loading. */
document.addEventListener('DOMContentLoaded', () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (reduced.matches || typeof Element.prototype.animate !== 'function') return;
  const easing = 'cubic-bezier(.16,1,.3,1)';
  const running = new Set();
  function play(element, frames, options) {
    const animation = element.animate(frames, options);
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    return animation;
  }
  const hero = document.querySelector('.home-hero,.page-header,.article-header,[class*="hero"]') || document.querySelector('h1')?.parentElement;
  if (hero) {
    const parts = [...hero.querySelectorAll('.eyebrow,h1,.hero-description,.hero-actions,.hero-mark,.hero-bottom,[class$="subtitle"]')];
    parts.forEach((element, index) => play(element,
      [{opacity:0, transform:`translateY(${index === 1 ? 24 : 14}px)`}, {opacity:1, transform:'translateY(0)'}],
      {duration:380, delay:30 + index * 55, easing, fill:'backwards'}));
  }
  const targets = document.querySelectorAll('.section-heading,.feature-story,.topic-link,.blog-card,.bean-card,.shop-card,.note-card,.hotel-card,.detail-highlight-card,.equipment-card,.card-preview,.project-card,.highlight-card,.stamp-card,.bento-card,.gallery-item');
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (!reduced.matches) play(entry.target, [{opacity:.3,translate:'0 22px'},{opacity:1,translate:'0 0'}],
        {duration:560,easing});
    }), {threshold:.12});
    targets.forEach(element => observer.observe(element));
  }
  const interactive = [...document.querySelectorAll('.feature-story,.blog-card,.topic-link,.equipment-expandable-card,.equipment-card,.bean-card,.shop-card,.note-card,.hotel-card,.detail-highlight-card,.btn,.detail-back,button:not(.nav-toggle):not(.back-to-top),.project-card,.highlight-card,.stamp-card,.bento-card,.gallery-item')];
  function bindInteractive(element) {
    if (element.classList.contains('motion-interactive')) return;
    let frame = 0, position;
    const magnetic = element.matches('.btn,.detail-back,button');
    element.classList.add('motion-interactive');
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      element.style.removeProperty('transform');
      element.classList.remove('pointer-engaged');
    };
    element.addEventListener('pointermove', event => {
      if (!pointer.matches || reduced.matches || event.pointerType !== 'mouse') return;
      // Clamp pointer feedback to keep movement subtle at every card size.
      const rect = element.getBoundingClientRect();
      position = {x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5};
      element.classList.add('pointer-engaged');
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (reduced.matches || !pointer.matches) return reset();
        const x = Math.max(-.5,Math.min(.5,position.x));
        const y = Math.max(-.5,Math.min(.5,position.y));
        element.style.transform = magnetic ? `translate(${x*10}px,${y*8}px)` :
          `perspective(1000px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-4px)`;
      });
    });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    reduced.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
  }
  interactive.forEach(bindInteractive);
  // 仅在动态渲染卡片的页面监听新增节点，避免搜索或筛选时触发全页 MutationObserver。
  const dynamicRoot = document.querySelector('#tool-grid, .cut-root');
  if (dynamicRoot) {
    const additions = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      const selector = '.gallery-item,.bento-card,.project-card';
      if (node.matches(selector)) bindInteractive(node);
      node.querySelectorAll(selector).forEach(bindInteractive);
    })));
    additions.observe(dynamicRoot, {childList:true,subtree:true});
  }
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer?.disconnect();
    running.forEach(animation => animation.cancel());
  });
});
