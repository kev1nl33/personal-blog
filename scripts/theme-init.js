/* Runs synchronously in <head>, before stylesheets, so the first paint matches the saved theme. */
(function () {
  var theme = 'light';
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
  } catch (error) {}
  document.documentElement.dataset.theme = theme;
})();
