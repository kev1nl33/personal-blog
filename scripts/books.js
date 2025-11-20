// 书单筛选功能
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookCards = document.querySelectorAll('.book-card');

    // 类型筛选功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // 筛选卡片
            bookCards.forEach(card => {
                const cardTags = card.dataset.tags || '';

                if (filter === 'all') {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-in-out';
                } else if (cardTags.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-in-out';
                } else {
                    card.classList.add('hidden');
                }
            });

            // 检查每个区域是否有可见的卡片
            checkEmptySections();
        });
    });

    // 检查区域是否为空
    function checkEmptySections() {
        const sections = ['readBooks', 'readingBooks', 'wantToReadBooks'];

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) return;

            const visibleCards = Array.from(section.querySelectorAll('.book-card'))
                .filter(card => !card.classList.contains('hidden'));

            // 移除旧的空状态提示
            const existingEmpty = section.querySelector('.empty-state');
            if (existingEmpty) {
                existingEmpty.remove();
            }

            // 如果没有可见卡片，显示空状态
            if (visibleCards.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">暂无符合条件的书籍</div>
                `;
                section.appendChild(emptyState);
            }
        });
    }

    // 初始检查
    checkEmptySections();
});
