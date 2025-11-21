// 博客筛选和搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const tagBtns = document.querySelectorAll('.tag-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('searchInput');

    // 当前筛选状态
    let currentCategory = 'all';
    let currentTag = 'all';

    // 应用筛选
    function applyFilters() {
        blogCards.forEach(card => {
            const categoryMatch = currentCategory === 'all' || card.dataset.category === currentCategory;
            const cardTags = card.dataset.tags || '';
            const tagMatch = currentTag === 'all' || cardTags.includes(currentTag);

            if (categoryMatch && tagMatch) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // 分类筛选功能
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            applyFilters();
        });
    });

    // 标签筛选功能
    tagBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tagBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTag = this.dataset.tag;
            applyFilters();
        });
    });

    // 搜索功能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        blogCards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            const tag = card.querySelector('.blog-tag').textContent.toLowerCase();
            const itemTags = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';

            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tag.includes(searchTerm) || itemTags.includes(searchTerm)) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.classList.add('hidden');
            }
        });

        // 如果搜索框清空，恢复当前筛选
        if (searchTerm === '') {
            applyFilters();
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
