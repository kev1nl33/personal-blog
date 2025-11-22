// 全站搜索功能
class GlobalSearch {
    constructor() {
        this.searchIndex = [];
        this.searchModal = null;
        this.searchInput = null;
        this.searchResults = null;
        this.init();
    }

    async init() {
        // 加载搜索索引
        await this.loadSearchIndex();

        // 创建搜索模态框
        this.createSearchModal();

        // 绑定键盘快捷键 (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }

            // ESC关闭搜索
            if (e.key === 'Escape' && this.searchModal.classList.contains('active')) {
                this.closeSearch();
            }
        });
    }

    async loadSearchIndex() {
        try {
            const response = await fetch('search-index.json');
            this.searchIndex = await response.json();
            console.log(`✅ 搜索索引已加载: ${this.searchIndex.length} 个页面`);
        } catch (error) {
            console.error('❌ 加载搜索索引失败:', error);
        }
    }

    createSearchModal() {
        // 创建模态框HTML
        const modalHTML = `
            <div class="search-modal" id="globalSearchModal">
                <div class="search-modal-backdrop"></div>
                <div class="search-modal-content">
                    <div class="search-modal-header">
                        <input type="text"
                               class="search-modal-input"
                               id="globalSearchInput"
                               placeholder="搜索文章、关键词... (Ctrl+K)"
                               autocomplete="off">
                        <button class="search-modal-close" id="closeSearchBtn">✕</button>
                    </div>
                    <div class="search-modal-results" id="searchResults">
                        <div class="search-empty-state">
                            <div class="search-empty-icon">🔍</div>
                            <p>输入关键词开始搜索</p>
                            <div class="search-tips">
                                <span class="search-tip">支持搜索标题、内容、分类</span>
                            </div>
                        </div>
                    </div>
                    <div class="search-modal-footer">
                        <span class="search-shortcut">
                            <kbd>↑</kbd><kbd>↓</kbd> 导航
                        </span>
                        <span class="search-shortcut">
                            <kbd>Enter</kbd> 打开
                        </span>
                        <span class="search-shortcut">
                            <kbd>ESC</kbd> 关闭
                        </span>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 获取元素引用
        this.searchModal = document.getElementById('globalSearchModal');
        this.searchInput = document.getElementById('globalSearchInput');
        this.searchResults = document.getElementById('searchResults');

        // 绑定事件
        this.searchInput.addEventListener('input', () => this.handleSearch());
        document.getElementById('closeSearchBtn').addEventListener('click', () => this.closeSearch());
        this.searchModal.querySelector('.search-modal-backdrop').addEventListener('click', () => this.closeSearch());

        // 键盘导航
        let selectedIndex = -1;
        this.searchInput.addEventListener('keydown', (e) => {
            const results = this.searchResults.querySelectorAll('.search-result-item');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
                this.highlightResult(results, selectedIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                this.highlightResult(results, selectedIndex);
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                results[selectedIndex]?.click();
            }
        });

        // 添加样式
        this.addSearchStyles();
    }

    highlightResult(results, index) {
        results.forEach((result, i) => {
            if (i === index) {
                result.classList.add('selected');
                result.scrollIntoView({ block: 'nearest' });
            } else {
                result.classList.remove('selected');
            }
        });
    }

    handleSearch() {
        const query = this.searchInput.value.trim().toLowerCase();

        if (!query) {
            this.searchResults.innerHTML = `
                <div class="search-empty-state">
                    <div class="search-empty-icon">🔍</div>
                    <p>输入关键词开始搜索</p>
                    <div class="search-tips">
                        <span class="search-tip">支持搜索标题、内容、分类</span>
                    </div>
                </div>
            `;
            return;
        }

        // 执行搜索
        const results = this.search(query);

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-empty-state">
                    <div class="search-empty-icon">😢</div>
                    <p>未找到相关结果</p>
                    <p class="search-query">搜索: "${query}"</p>
                </div>
            `;
            return;
        }

        // 显示结果
        const resultsHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item">
                <div class="search-result-header">
                    <h3 class="search-result-title">${this.highlightText(result.title, query)}</h3>
                    ${result.category ? `<span class="search-result-category">${result.category}</span>` : ''}
                </div>
                <p class="search-result-description">${this.highlightText(result.description, query)}</p>
            </a>
        `).join('');

        this.searchResults.innerHTML = `
            <div class="search-results-count">找到 ${results.length} 个结果</div>
            ${resultsHTML}
        `;
    }

    search(query) {
        const keywords = query.split(/\s+/).filter(k => k.length > 0);

        return this.searchIndex
            .map(item => {
                let score = 0;
                const searchText = `${item.title} ${item.description} ${item.content} ${item.category} ${item.keywords}`.toLowerCase();

                keywords.forEach(keyword => {
                    // 标题匹配权重最高
                    if (item.title.toLowerCase().includes(keyword)) {
                        score += 10;
                    }

                    // 分类匹配
                    if (item.category.toLowerCase().includes(keyword)) {
                        score += 5;
                    }

                    // 关键词匹配
                    if (item.keywords.toLowerCase().includes(keyword)) {
                        score += 3;
                    }

                    // 描述匹配
                    if (item.description.toLowerCase().includes(keyword)) {
                        score += 2;
                    }

                    // 内容匹配
                    if (item.content.toLowerCase().includes(keyword)) {
                        score += 1;
                    }
                });

                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // 最多显示10个结果
    }

    highlightText(text, query) {
        if (!text) return '';

        const keywords = query.split(/\s+/).filter(k => k.length > 0);
        let highlightedText = text;

        keywords.forEach(keyword => {
            const regex = new RegExp(`(${keyword})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });

        return highlightedText;
    }

    openSearch() {
        this.searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 延迟聚焦以确保动画流畅
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
    }

    closeSearch() {
        this.searchModal.classList.remove('active');
        document.body.style.overflow = '';
        this.searchInput.value = '';
        this.handleSearch(); // 重置结果
    }

    addSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
            }

            .search-modal.active {
                display: block;
            }

            .search-modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(4px);
            }

            .search-modal-content {
                position: absolute;
                top: 10%;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 600px;
                background: #1a1a2e;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                overflow: hidden;
                animation: slideDown 0.3s ease;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            .search-modal-header {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #2a2a3e;
            }

            .search-modal-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #fff;
                font-size: 1.1rem;
                outline: none;
            }

            .search-modal-input::placeholder {
                color: #666;
            }

            .search-modal-close {
                background: transparent;
                border: none;
                color: #999;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                transition: color 0.2s;
            }

            .search-modal-close:hover {
                color: #fff;
            }

            .search-modal-results {
                max-height: 400px;
                overflow-y: auto;
                padding: 0.5rem 0;
            }

            .search-modal-results::-webkit-scrollbar {
                width: 6px;
            }

            .search-modal-results::-webkit-scrollbar-track {
                background: #1a1a2e;
            }

            .search-modal-results::-webkit-scrollbar-thumb {
                background: #3a3a4e;
                border-radius: 3px;
            }

            .search-empty-state {
                text-align: center;
                padding: 3rem 1rem;
                color: #999;
            }

            .search-empty-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .search-tips {
                margin-top: 1rem;
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .search-tip {
                background: #2a2a3e;
                padding: 0.3rem 0.8rem;
                border-radius: 4px;
                font-size: 0.85rem;
                color: #666;
            }

            .search-query {
                color: #00d4ff;
                margin-top: 0.5rem;
            }

            .search-results-count {
                padding: 0.5rem 1rem;
                color: #999;
                font-size: 0.9rem;
                border-bottom: 1px solid #2a2a3e;
            }

            .search-result-item {
                display: block;
                padding: 1rem;
                border-bottom: 1px solid #2a2a3e;
                transition: background 0.2s;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
            }

            .search-result-item:hover,
            .search-result-item.selected {
                background: #2a2a3e;
            }

            .search-result-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }

            .search-result-title {
                margin: 0;
                font-size: 1rem;
                color: #fff;
            }

            .search-result-title mark {
                background: #7b2ff7;
                color: #fff;
                padding: 0.1rem 0.2rem;
                border-radius: 2px;
            }

            .search-result-category {
                background: #7b2ff7;
                color: #fff;
                padding: 0.2rem 0.6rem;
                border-radius: 4px;
                font-size: 0.75rem;
            }

            .search-result-description {
                margin: 0;
                color: #999;
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .search-result-description mark {
                background: #00d4ff33;
                color: #00d4ff;
                padding: 0.1rem 0.2rem;
                border-radius: 2px;
            }

            .search-modal-footer {
                display: flex;
                gap: 1rem;
                padding: 0.75rem 1rem;
                background: #0f0f1e;
                border-top: 1px solid #2a2a3e;
                font-size: 0.85rem;
                color: #666;
            }

            .search-shortcut {
                display: flex;
                align-items: center;
                gap: 0.3rem;
            }

            .search-shortcut kbd {
                background: #2a2a3e;
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.8rem;
                border: 1px solid #3a3a4e;
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .search-modal-content {
                    top: 5%;
                    width: 95%;
                }

                .search-modal-results {
                    max-height: 300px;
                }

                .search-modal-footer {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载后初始化全站搜索
document.addEventListener('DOMContentLoaded', () => {
    window.globalSearch = new GlobalSearch();
});
