document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card-preview img').forEach(image=>{
    image.width=400;image.height=300;
    const fallback=document.createElement('span');fallback.className='equipment-photo-fallback';
    fallback.textContent=image.alt;fallback.hidden=true;image.parentElement.appendChild(fallback);
    function fail(){image.hidden=true;fallback.hidden=false;}
    image.addEventListener('error',fail);if(image.complete && !image.naturalWidth)fail();
  });
  const tabs=[...document.querySelectorAll('.coffee-tabs .tab-btn')];
  const panels=[...document.querySelectorAll('.tab-content')];
  if(!tabs.length)return;
  const tablist=document.querySelector('.coffee-tabs');tablist.setAttribute('role','tablist');tablist.setAttribute('aria-label','咖啡记录类型');
  function activate(index) {
    tabs.forEach((tab,i)=>{
      const active=i===index;tab.classList.toggle('tab-btn--active',active);
      tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
    });
    panels.forEach(panel=>{panel.hidden=panel.id!==tabs[index].dataset.tab;});
  }
  tabs.forEach((tab,index)=>{
    tab.id=`tab-${tab.dataset.tab}`;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',tab.dataset.tab);
    const panel=document.getElementById(tab.dataset.tab);panel?.setAttribute('role','tabpanel');panel?.setAttribute('aria-labelledby',tab.id);
    tab.addEventListener('click',()=>activate(index));
    tab.addEventListener('keydown',event=>{
      const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:-1;
      if(next!==-1){event.preventDefault();activate(next);tabs[next].focus();}
    });
  });
  const requestedTab = location.hash.slice(1);
  const initialIndex = tabs.findIndex(tab => tab.dataset.tab === requestedTab);
  activate(initialIndex < 0 ? 0 : initialIndex);
  document.querySelectorAll('[data-coffee-tab]').forEach(link => link.addEventListener('click', () => {
    const index = tabs.findIndex(tab => tab.dataset.tab === link.dataset.coffeeTab);
    if (index >= 0) activate(index);
  }));
  document.querySelectorAll('.equipment-expandable-card').forEach(card=>{
    const preview=card.querySelector('.card-preview'),details=card.querySelector('.card-details');
    if(!preview||!details)return;
    details.hidden=true;
    function toggle(){details.hidden=!details.hidden;preview.setAttribute('aria-expanded',String(!details.hidden));}
    preview.addEventListener('click',event=>{if(!event.target.closest('a,button'))toggle();});
    preview.addEventListener('keydown',event=>{if(event.target===preview&&['Enter',' '].includes(event.key)){event.preventDefault();toggle();}});
  });
});
