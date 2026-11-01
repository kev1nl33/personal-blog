import { defineConfig } from 'vite';

// 首页顶栏的第二个构建入口：输出独立的 liquid-logo-nav.js / .css，不与实验页样式混打包。
export default defineConfig({
    base: './',
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    esbuild: { jsx: 'automatic', legalComments: 'eof' },
    build: {
        // 追加构建：不清空 dist，保留主入口的 liquid-logo.js / .css。
        emptyOutDir: false,
        lib: {
            entry: 'src/nav.jsx',
            formats: ['es'],
            fileName: () => 'liquid-logo-nav.js',
            cssFileName: 'liquid-logo-nav',
        },
        minify: 'esbuild',
    },
});
