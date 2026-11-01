import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    esbuild: { jsx: 'automatic', legalComments: 'eof' },
    build: {
        lib: {
            entry: 'src/main.jsx',
            formats: ['es'],
            fileName: () => 'liquid-logo.js',
            cssFileName: 'liquid-logo',
        },
        minify: 'esbuild',
    },
});
