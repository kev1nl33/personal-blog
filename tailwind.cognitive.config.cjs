module.exports = {
  content: ['./projects/108 Cognitive Weapons/*.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0a0a0a',
          white: '#f4f4f0',
          accent: '#FF4D00',
          blue: '#0047AB',
          green: '#059669',
          gray: '#8a8a8a',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'Inter', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"Songti SC"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
};
