// 深色/浅色模式切换
class ThemeManager {
    constructor() {
        this.currentTheme = this.getSavedTheme() || 'dark';
        this.init();
    }

    init() {
        // 应用保存的主题
        this.applyTheme(this.currentTheme);

        // 创建主题切换按钮
        this.createThemeToggle();

        // 监听系统主题变化
        this.watchSystemTheme();
    }

    getSavedTheme() {
        return localStorage.getItem('theme');
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.saveTheme(theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    createThemeToggle() {
        // 创建切换按钮
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', '切换主题');
        themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';

        // 添加到页面
        document.body.appendChild(themeToggle);

        // 绑定点击事件
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // 添加样式
        this.addStyles();
    }

    updateThemeIcon() {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    watchSystemTheme() {
        // 监听系统主题变化（可选）
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

            darkModeQuery.addEventListener('change', (e) => {
                // 只有在用户没有手动设置主题时才自动切换
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 浅色主题变量 */
            :root[data-theme="light"] {
                --bg-primary: #ffffff;
                --bg-secondary: #f5f5f5;
                --bg-card: #ffffff;
                --text-primary: #1a1a1a;
                --text-secondary: #666666;
                --accent: #0066cc;
                --accent-hover: #0052a3;
                --border-color: rgba(0, 0, 0, 0.1);
                --shadow-color: rgba(0, 0, 0, 0.1);
            }

            /* 深色主题变量（默认）*/
            :root[data-theme="dark"] {
                --bg-primary: #0a0a0a;
                --bg-secondary: #1a1a1a;
                --bg-card: #222222;
                --text-primary: #ffffff;
                --text-secondary: #a0a0a0;
                --accent: #00d4ff;
                --accent-hover: #00b8e6;
                --border-color: rgba(255, 255, 255, 0.1);
                --shadow-color: rgba(0, 0, 0, 0.5);
            }

            /* 主题切换按钮 */
            .theme-toggle {
                position: fixed;
                bottom: 80px;
                right: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--bg-card);
                border: 2px solid var(--border-color);
                box-shadow: 0 4px 12px var(--shadow-color);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .theme-toggle:hover {
                transform: scale(1.1) rotate(20deg);
                border-color: var(--accent);
            }

            .theme-icon {
                transition: transform 0.3s ease;
            }

            /* 确保所有元素使用CSS变量 */
            body {
                background: var(--bg-primary);
                color: var(--text-primary);
                transition: background 0.3s ease, color 0.3s ease;
            }

            .nav {
                background: rgba(10, 10, 10, 0.9);
                border-bottom: 1px solid var(--border-color);
            }

            :root[data-theme="light"] .nav {
                background: rgba(255, 255, 255, 0.95);
            }

            .article-card,
            .blog-card,
            .book-card {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                box-shadow: 0 4px 12px var(--shadow-color);
            }

            .toc-container,
            .search-modal-content {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
            }

            /* 浅色模式特殊处理 */
            :root[data-theme="light"] .hero {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }

            :root[data-theme="light"] .gradient-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            :root[data-theme="light"] .logo {
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .theme-toggle {
                    bottom: 70px;
                    right: 1rem;
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
