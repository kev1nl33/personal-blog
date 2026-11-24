/* 在样式表之前同步应用主题，避免首屏闪烁。 */
(function () {
  var query = '(prefers-color-scheme: dark)';
  var scheme = window.matchMedia(query);

  function systemTheme() {
    return window.matchMedia(query).matches ? 'dark' : 'light';
  }

  function readStorage() {
    try {
      return {ok: true, value: localStorage.getItem('theme')};
    } catch (error) {
      return {ok: false, value: null};
    }
  }

  function writeStorage(theme) {
    try { localStorage.setItem('theme', theme); } catch (error) {}
  }

  function removeStorage() {
    try { localStorage.removeItem('theme'); } catch (error) {}
  }

  function applyTheme(theme) {
    if (document.documentElement.dataset.theme === theme) return;
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent('themechange', {detail: theme}));
  }

  var lastSystem = systemTheme();
  var override = null;

  function clearOverride() {
    override = null;
    removeStorage();
  }

  function loadOverride(sys) {
    var stored = readStorage();
    if (!stored.ok) return;
    if (stored.value === 'light' || stored.value === 'dark') {
      if (stored.value === sys) {
        clearOverride();
      } else {
        override = stored.value;
      }
    } else {
      override = null;
    }
  }

  function syncFromEnvironment(matches) {
    var sys = typeof matches === 'boolean' ? (matches ? 'dark' : 'light') : systemTheme();
    if (sys !== lastSystem) {
      lastSystem = sys;
      clearOverride();
      applyTheme(sys);
      return;
    }
    loadOverride(sys);
    applyTheme(override || sys);
  }

  window.siteTheme = {
    set: function (theme) {
      if (theme !== 'light' && theme !== 'dark') return;
      var sys = systemTheme();
      lastSystem = sys;
      if (theme === sys) {
        clearOverride();
        applyTheme(sys);
        return;
      }
      override = theme;
      writeStorage(theme);
      applyTheme(theme);
    },
    reset: function () {
      var sys = systemTheme();
      lastSystem = sys;
      clearOverride();
      applyTheme(sys);
    }
  };

  loadOverride(lastSystem);
  applyTheme(override || lastSystem);

  function followSystem(event) {
    syncFromEnvironment(event && typeof event.matches === 'boolean' ? event.matches : undefined);
  }
  if (scheme.addEventListener) scheme.addEventListener('change', followSystem);
  else if (scheme.addListener) scheme.addListener(followSystem);

  if (window.addEventListener) {
    window.addEventListener('pageshow', function () {
      syncFromEnvironment();
    });
    window.addEventListener('storage', function (event) {
      try {
        if (event && event.storageArea && event.storageArea !== localStorage) return;
      } catch (error) {}
      if (event && event.key !== null && event.key !== 'theme') return;
      var sys = systemTheme();
      lastSystem = sys;
      loadOverride(sys);
      applyTheme(override || sys);
    });
  }
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') syncFromEnvironment();
    });
  }
})();
