// 文章目录(TOC)自动生成
class TableOfContents {
    constructor() {
        this.article = document.querySelector('.article-content');
        this.tocContainer = null;
        this.headings = [];
        this.init();
    }

    init() {
        if (!this.article) {
            return; // 不是文章页面
        }

        // 查找所有标题
        this.headings = Array.from(this.article.querySelectorAll('h2, h3, h4'));

        if (this.headings.length < 3) {
            return; // 标题太少，不显示目录
        }

        // 为标题添加ID
        this.addHeadingIds();

        // 创建目录
        this.createTOC();

        // 监听滚动，高亮当前标题
        this.setupScrollSpy();

        // 目录展开/收起切换
        this.setupToggle();
    }

    addHeadingIds() {
        this.headings.forEach((heading, index) => {
            if (!heading.id) {
                // 生成ID：基于文本内容或使用索引
                const id = this.slugify(heading.textContent) || `heading-${index}`;
                heading.id = id;
            }
        });
    }

    slugify(text) {
        // 简单的slug生成：移除特殊字符，转小写
        return text
            .trim()
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50);
    }

    createTOC() {
        // 创建目录容器
        this.tocContainer = document.createElement('div');
        this.tocContainer.className = 'toc-container';
        this.tocContainer.innerHTML = `
            <div class="toc-header">
                <h3 class="toc-title">📑 目录</h3>
                <button class="toc-toggle" aria-label="展开/收起目录">
                    <span class="toc-toggle-icon">−</span>
                </button>
            </div>
            <nav class="toc-nav">
                <ul class="toc-list">
                    ${this.generateTOCItems()}
                </ul>
            </nav>
        `;

        // 插入到文章前面
        this.article.parentElement.insertBefore(this.tocContainer, this.article);

        // 添加样式
        this.addStyles();
    }

    generateTOCItems() {
        let html = '';
        let currentLevel = 2;

        this.headings.forEach((heading) => {
            const level = parseInt(heading.tagName.substring(1)); // h2 -> 2
            const text = heading.textContent;
            const id = heading.id;

            if (level > currentLevel) {
                html += '<ul class="toc-sublist">';
            } else if (level < currentLevel) {
                html += '</ul>'.repeat(currentLevel - level);
            }

            html += `
                <li class="toc-item" data-level="${level}">
                    <a href="#${id}" class="toc-link">
                        <span class="toc-bullet"></span>
                        <span class="toc-text">${text}</span>
                    </a>
                </li>
            `;

            currentLevel = level;
        });

        return html;
    }

    setupScrollSpy() {
        const tocLinks = this.tocContainer.querySelectorAll('.toc-link');
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll);

        // 点击TOC链接平滑滚动
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offset = 80; // 导航栏高度
                    const targetPosition = targetElement.offsetTop - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // 更新URL hash（可选）
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }

    updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        let activeHeading = null;

        // 找到当前视口中的标题
        for (let i = this.headings.length - 1; i >= 0; i--) {
            const heading = this.headings[i];
            if (heading.offsetTop <= scrollPosition) {
                activeHeading = heading;
                break;
            }
        }

        // 更新活动链接
        const tocLinks = this.tocContainer.querySelectorAll('.toc-link');
        tocLinks.forEach(link => {
            link.classList.remove('active');
        });

        if (activeHeading) {
            const activeLink = this.tocContainer.querySelector(`a[href="#${activeHeading.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');

                // 滚动目录到可见位置
                const tocNav = this.tocContainer.querySelector('.toc-nav');
                if (tocNav) {
                    const linkTop = activeLink.offsetTop;
                    const navHeight = tocNav.clientHeight;
                    const linkHeight = activeLink.clientHeight;

                    if (linkTop < tocNav.scrollTop || linkTop + linkHeight > tocNav.scrollTop + navHeight) {
                        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            }
        }
    }

    setupToggle() {
        const toggleBtn = this.tocContainer.querySelector('.toc-toggle');
        const tocNav = this.tocContainer.querySelector('.toc-nav');
        const toggleIcon = this.tocContainer.querySelector('.toc-toggle-icon');

        toggleBtn.addEventListener('click', () => {
            this.tocContainer.classList.toggle('collapsed');

            if (this.tocContainer.classList.contains('collapsed')) {
                tocNav.style.maxHeight = '0';
                toggleIcon.textContent = '+';
            } else {
                tocNav.style.maxHeight = tocNav.scrollHeight + 'px';
                toggleIcon.textContent = '−';
            }
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toc-container {
                background: #1a1a2e;
                border: 1px solid #2a2a3e;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                position: sticky;
                top: 80px;
                max-height: calc(100vh - 120px);
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .toc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid #2a2a3e;
            }

            .toc-title {
                margin: 0;
                font-size: 1.1rem;
                color: #fff;
                font-weight: 600;
            }

            .toc-toggle {
                background: transparent;
                border: 1px solid #2a2a3e;
                color: #999;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .toc-toggle:hover {
                border-color: #00d4ff;
                color: #00d4ff;
            }

            .toc-toggle-icon {
                line-height: 1;
            }

            .toc-nav {
                max-height: 500px;
                overflow-y: auto;
                overflow-x: hidden;
                transition: max-height 0.3s ease;
            }

            .toc-nav::-webkit-scrollbar {
                width: 4px;
            }

            .toc-nav::-webkit-scrollbar-track {
                background: #1a1a2e;
            }

            .toc-nav::-webkit-scrollbar-thumb {
                background: #3a3a4e;
                border-radius: 2px;
            }

            .toc-list {
                list-style: none;
                margin: 0;
                padding: 0;
            }

            .toc-sublist {
                list-style: none;
                margin-left: 1rem;
                padding: 0;
            }

            .toc-item {
                margin: 0.25rem 0;
            }

            .toc-link {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                padding: 0.4rem 0.5rem;
                color: #999;
                text-decoration: none;
                border-radius: 6px;
                transition: all 0.2s;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .toc-link:hover {
                background: #2a2a3e;
                color: #fff;
            }

            .toc-link.active {
                background: #2a2a3e;
                color: #00d4ff;
                font-weight: 500;
            }

            .toc-link.active .toc-bullet {
                background: #00d4ff;
            }

            .toc-bullet {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #666;
                flex-shrink: 0;
                margin-top: 0.5rem;
                transition: background 0.2s;
            }

            .toc-text {
                flex: 1;
            }

            .toc-container.collapsed .toc-nav {
                max-height: 0 !important;
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .toc-container {
                    position: static;
                    margin-bottom: 1.5rem;
                }

                .toc-nav {
                    max-height: 300px;
                }
            }

            /* 为文章内容添加布局，使TOC在侧边 */
            @media (min-width: 1400px) {
                .article-container .container {
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    gap: 2rem;
                    align-items: start;
                    max-width: 1400px;
                }

                .toc-container {
                    order: -1;
                }

                .article-header {
                    grid-column: 1 / -1;
                }

                .article-content {
                    min-width: 0; /* 防止溢出 */
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化TOC
document.addEventListener('DOMContentLoaded', () => {
    new TableOfContents();
});
