// 极简主页交互效果
document.addEventListener('DOMContentLoaded', function () {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 导航栏简化滚动效果
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 0) {
                nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });
    }

    // 创建阅读进度条
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    // 创建回到顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.title = '回到顶部';
    document.body.appendChild(backToTopBtn);

    // 滚动事件 - 更新进度条和回到顶部按钮
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 更新阅读进度条
        const scrollPercent = (currentScroll / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;

        // 显示/隐藏回到顶部按钮
        if (currentScroll > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // 回到顶部点击事件
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
