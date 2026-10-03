module.exports = {
 content: ['./templates/*.html', './*.html', './scripts/*.js', './data/articles.json', './sync_notion.py'],
 corePlugins: { preflight: false },
 theme: { extend: {
  colors: { brand: {black:'#0a0a0a',white:'#f4f4f0',accent:'#FF4D00',blue:'#0047AB',green:'#059669',gray:'#4a4a4a'},
   coffee:{dark:'#3C2415',medium:'#6F4E37',light:'#A67B5B',cream:'#C4A484',foam:'#F5E6D3'} },
  fontFamily:{sans:['Noto Sans SC','sans-serif'],serif:['Noto Serif SC','serif'],mono:['JetBrains Mono','monospace']}
 } },
 safelist: ['bg-brand-accent', 'bg-brand-blue', 'bg-brand-green', 'text-brand-white', 'hidden']
};
