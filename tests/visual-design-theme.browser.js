/* 在本地 visual-design.html 的浏览器上下文运行，验证真实计算颜色。 */
async function verifyVisualDesignTheme() {
  const root = document.documentElement;
  const originalTheme = root.dataset.theme;
  const failures = [];
  const checks = [];
  const rgb = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
  const luminance = color => rgb(color).map(n => {
    const value = n / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
  function background(element) {
    const color = getComputedStyle(element).backgroundColor;
    return color === 'rgba(0, 0, 0, 0)' ? background(element.parentElement) : color;
  }
  function check(name, pass, actual) {
    checks.push({name, pass, actual});
    if (!pass) failures.push(name);
  }
  try {
    for (const theme of ['light', 'dark']) {
      root.dataset.theme = theme;
      await new Promise(resolve => setTimeout(resolve, 250));
      for (const selector of ['.finder-panel', '.finder-input', '.tool-card']) {
        const color = background(document.querySelector(selector));
        check(`${theme} ${selector} surface`, theme === 'dark' ? luminance(color) < .1 : luminance(color) > .7, color);
      }
      for (const selector of ['.cognitive-deck', '.finder-coordinate', '#tool-search-form label', '#tool-search', '.finder-input button', '.finder-bottom strong', '.tool-question a', '.tool-outcome', '.tool-meta>span:first-child', '.tool-model strong', '.tool-card summary', '.tool-action', '.tool-source', '.tool-original', '.topic-filters button[aria-pressed=true]', '.topic-filters button[aria-pressed=true] span', '.shortcut-number', '.tool-empty h3', '.tool-empty p', '#empty-reset', '#show-more-tools']) {
        const element = document.querySelector(selector);
        const style = getComputedStyle(element);
        const levels = [luminance(style.color), luminance(background(element))].sort((a,b) => b-a);
        const ratio = (levels[0]+.05)/(levels[1]+.05);
        check(`${theme} ${selector} contrast`, ratio >= 4.5, Number(ratio.toFixed(2)));
      }
    }
  } finally {
    root.dataset.theme = originalTheme;
  }
  return {passed: failures.length === 0, failures, checks};
}
