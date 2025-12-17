// 书单页面完整功能：筛选、搜索、排序、统计
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const bookCards = document.querySelectorAll('.book-card');

    // 当前筛选和搜索状态
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'default';

    // 初始化统计
    updateStats();

    // ========== 统计功能 ==========
    function updateStats() {
        const total = bookCards.length;
        const readSection = document.getElementById('readBooks');
        const readingSection = document.getElementById('readingBooks');
        const wantSection = document.getElementById('wantToReadBooks');

        const readCount = readSection ? readSection.querySelectorAll('.book-card').length : 0;
        const readingCount = readingSection ? readingSection.querySelectorAll('.book-card').length : 0;
        const wantCount = wantSection ? wantSection.querySelectorAll('.book-card').length : 0;

        // 更新统计数字
        document.getElementById('totalBooks').textContent = total;
        document.getElementById('readBooks').textContent = readCount;
        document.getElementById('readingBooks').textContent = readingCount;
        document.getElementById('wantToReadBooks').textContent = wantCount;
    }

    // ========== 类型筛选功能 ==========
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentFilter = this.dataset.filter;
            applyFiltersAndSort();
        });
    });

    // ========== 搜索功能 ==========
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value.toLowerCase().trim();
            applyFiltersAndSort();
        });
    }

    // ========== 排序功能 ==========
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            applyFiltersAndSort();
        });
    }

    // ========== 应用筛选、搜索和排序 ==========
    function applyFiltersAndSort() {
        // 获取所有区域
        const sections = ['readBooks', 'readingBooks', 'wantToReadBooks'];

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) return;

            const cards = Array.from(section.querySelectorAll('.book-card'));

            // 1. 先应用筛选和搜索
            cards.forEach(card => {
                const cardTags = card.dataset.tags || '';
                const cardTitle = (card.dataset.title || '').toLowerCase();
                const cardAuthor = (card.dataset.author || '').toLowerCase();

                // 筛选条件
                const matchesFilter = currentFilter === 'all' || cardTags.includes(currentFilter);

                // 搜索条件（书名或作者包含搜索词）
                const matchesSearch = !currentSearch ||
                    cardTitle.includes(currentSearch) ||
                    cardAuthor.includes(currentSearch);

                if (matchesFilter && matchesSearch) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // 2. 获取可见的卡片
            const visibleCards = cards.filter(card => !card.classList.contains('hidden'));

            // 3. 应用排序
            if (currentSort !== 'default' && visibleCards.length > 0) {
                sortCards(visibleCards, currentSort);

                // 重新排列 DOM
                visibleCards.forEach(card => {
                    section.appendChild(card);
                });
            }

            // 4. 检查是否需要显示空状态
            checkEmptyState(section, visibleCards.length);
        });
    }

    // ========== 排序功能实现 ==========
    function sortCards(cards, sortType) {
        cards.sort((a, b) => {
            switch(sortType) {
                case 'title-asc':
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-CN');

                case 'title-desc':
                    return (b.dataset.title || '').localeCompare(a.dataset.title || '', 'zh-CN');

                case 'rating-desc':
                    return (parseInt(b.dataset.rating) || 0) - (parseInt(a.dataset.rating) || 0);

                case 'rating-asc':
                    return (parseInt(a.dataset.rating) || 0) - (parseInt(b.dataset.rating) || 0);

                case 'date-desc':
                    return (b.dataset.date || '').localeCompare(a.dataset.date || '');

                case 'date-asc':
                    return (a.dataset.date || '').localeCompare(b.dataset.date || '');

                default:
                    return 0;
            }
        });
    }

    // ========== 检查空状态 ==========
    function checkEmptyState(section, visibleCount) {
        // 移除旧的空状态提示
        const existingEmpty = section.querySelector('.empty-state');
        if (existingEmpty) {
            existingEmpty.remove();
        }

        // 如果没有可见卡片，显示空状态
        if (visibleCount === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';

            // 根据当前状态显示不同的提示
            let message = '暂无符合条件的书籍';
            if (currentSearch) {
                message = `没有找到包含 "${currentSearch}" 的书籍`;
            }

            emptyState.innerHTML = `
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">${message}</div>
            `;
            section.appendChild(emptyState);
        }
    }

    // ========== 初始检查空状态 ==========
    const sections = ['readBooks', 'readingBooks', 'wantToReadBooks'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const visibleCards = Array.from(section.querySelectorAll('.book-card'))
            .filter(card => !card.classList.contains('hidden'));

        checkEmptyState(section, visibleCards.length);
    });

    // ========== 添加动画效果 ==========
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.5s ease-in-out';
            }
        });
    }, { threshold: 0.1 });

    bookCards.forEach(card => {
        observer.observe(card);
    });
});
