document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.article-content');
  const panel = document.querySelector('.article-toc');
  const list = document.getElementById('toc-list');
  if (!content || !panel || !list) return;
  const headings = [...content.querySelectorAll('h2,h3')];
  if (!headings.length) return;
  panel.hidden = false;
  const existing = new Set([...document.querySelectorAll('[id]')].map(el=>el.id));
  const links = headings.map((heading,i) => {
    if (!heading.id) {
      let id = `section-${i+1}`;
      while (existing.has(id)) id += '-a';
      heading.id=id; existing.add(id);
    }
    const link=document.createElement('a');
    link.href=`#${encodeURIComponent(heading.id)}`;
    link.textContent=heading.textContent;
    if (heading.tagName==='H3') link.className='toc-sub';
    list.appendChild(link);
    return link;
  });
  let pending=false;
  function update() {
    let current=0;
    headings.forEach((heading,index)=>{if(heading.getBoundingClientRect().top<140) current=index;});
    links.forEach((link,index)=>{
      if (index===current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
    pending=false;
  }
  window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}}, {passive:true});
  update();
});
