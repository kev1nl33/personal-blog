// 页面加载动画和性能优化
class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        // 创建加载动画
        this.createLoader();

        // 页面加载完成
        window.addEventListener('load', () => {
            this.hideLoader();
        });

        // 页面切换动画
        this.setupPageTransitions();

        // 性能监控
        this.monitorPerformance();
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p class="loader-text">加载中...</p>
            </div>
        `;

        document.body.prepend(loader);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--bg-primary);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.5s ease, visibility 0.5s ease;
            }

            .page-loader.hidden {
                opacity: 0;
                visibility: hidden;
            }

            .loader-content {
                text-align: center;
            }

            .loader-spinner {
                width: 50px;
                height: 50px;
                margin: 0 auto 1rem;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: var(--accent);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .loader-text {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            /* 页面淡入动画 */
            body {
                animation: fadeIn 0.5s ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    hideLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 300);
        }
    }

    setupPageTransitions() {
        // 为链接添加过渡效果
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');

            if (link &&
                link.href &&
                link.href.includes(window.location.hostname) &&
                !link.target &&
                !link.href.includes('#')) {

                e.preventDefault();

                // 淡出当前页面
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    }

    monitorPerformance() {
        // 监控页面性能
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.renderTime || entry.loadTime);
                    }
                }
            });

            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // 输出性能指标
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;

                console.log('📊 性能指标:');
                console.log(`  页面加载时间: ${pageLoadTime}ms`);
                console.log(`  服务器响应时间: ${connectTime}ms`);
                console.log(`  DOM渲染时间: ${renderTime}ms`);
            }, 0);
        });
    }
}

// 初始化
new PageLoader();
