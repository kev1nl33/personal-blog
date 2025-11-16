// 博客筛选和搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('searchInput');

    // 分类筛选功能
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            // 筛选卡片
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                    // 添加淡入动画
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 搜索功能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        blogCards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            const tag = card.querySelector('.blog-tag').textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tag.includes(searchTerm)) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.classList.add('hidden');
            }
        });

        // 如果搜索框清空，恢复当前分类筛选
        if (searchTerm === '') {
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            blogCards.forEach(card => {
                if (activeCategory === 'all' || card.dataset.category === activeCategory) {
                    card.classList.remove('hidden');
                }
            });
        }
    });
});

// 添加淡入动画的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
