/* 在样式表之前同步应用主题，避免首屏闪烁。 */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (error) {}
  var manual = saved === 'light' || saved === 'dark';
  var scheme = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent('themechange', {detail: theme}));
  }

  window.siteTheme = {
    set: function (theme) {
      if (theme !== 'light' && theme !== 'dark') return;
      manual = true;
      try { localStorage.setItem('theme', theme); } catch (error) {}
      applyTheme(theme);
    }
  };

  applyTheme(manual ? saved : (scheme.matches ? 'dark' : 'light'));
  function followSystem(event) {
    if (!manual) applyTheme(event.matches ? 'dark' : 'light');
  }
  if (scheme.addEventListener) scheme.addEventListener('change', followSystem);
  else if (scheme.addListener) scheme.addListener(followSystem);
})();
