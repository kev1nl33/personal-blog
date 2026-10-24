module.exports = {
 content: ['./templates/*.html', './*.html', './scripts/*.js', './data/articles.json'],
 corePlugins: { preflight: false },
 theme: { extend: {
  colors: { brand: {black:'var(--ink)',white:'var(--paper)',accent:'var(--brand-accent)',blue:'var(--brand-blue)',green:'var(--brand-green)',gray:'var(--ink-muted)'},
   coffee:{dark:'#3C2415',medium:'#6F4E37',light:'#A67B5B',cream:'#C4A484',foam:'#F5E6D3'} },
  fontFamily:{sans:['Noto Sans SC','sans-serif'],serif:['Noto Serif SC','serif'],mono:['JetBrains Mono','monospace']}
 } },
 safelist: ['bg-brand-accent', 'bg-brand-blue', 'bg-brand-green', 'text-brand-white', 'hidden']
};
