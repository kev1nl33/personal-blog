// 图片懒加载和优化
class ImageOptimizer {
    constructor() {
        this.images = [];
        this.observer = null;
        this.init();
    }

    init() {
        // 为所有图片添加懒加载
        this.setupLazyLoading();

        // 添加WebP支持检测
        this.checkWebPSupport();
    }

    setupLazyLoading() {
        // 获取所有图片
        this.images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        // 使用Intersection Observer实现懒加载
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // 观察所有图片
        this.images.forEach(img => {
            this.observer.observe(img);
        });

        // 为新添加的图片自动添加懒加载
        this.watchDOMChanges();
    }

    loadImage(img) {
        const src = img.dataset.src || img.src;

        if (!src) return;

        // 创建新Image对象预加载
        const tempImage = new Image();

        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');

            // 移除data-src属性
            if (img.dataset.src) {
                delete img.dataset.src;
            }
        };

        tempImage.onerror = () => {
            img.classList.add('error');
            console.error('图片加载失败:', src);
        };

        tempImage.src = src;

        // 添加加载动画
        img.classList.add('loading');
    }

    watchDOMChanges() {
        // 监听DOM变化，自动为新图片添加懒加载
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'IMG') {
                        this.observer.observe(node);
                    } else if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll('img');
                        imgs.forEach(img => this.observer.observe(img));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    checkWebPSupport() {
        // 检测浏览器是否支持WebP
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            const support = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            if (support) {
                document.documentElement.classList.add('webp-support');
            }
        }
    }
}

// 初始化图片优化器
document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();

    // 为现有图片添加CSS
    const style = document.createElement('style');
    style.textContent = `
        img {
            transition: opacity 0.3s ease, filter 0.3s ease;
        }

        img.loading {
            opacity: 0.5;
            filter: blur(5px);
        }

        img.loaded {
            opacity: 1;
            filter: blur(0);
        }

        img.error {
            opacity: 0.3;
            background: #f0f0f0;
        }

        /* 占位符效果 */
        img:not([src]) {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
});
