/**
 * VisitorCounter - 访客计数器
 * 调用 /api/counter 获取真实访问量，本地开发时使用 localStorage 模拟
 */
class VisitorCounter {
    constructor() {
        this.container = document.getElementById('visitorCounter');
        this.display = document.getElementById('counterDisplay');
        if (!this.container || !this.display) return;

        this.digits = this.display.querySelectorAll('.counter-digit');
        this.totalDigits = this.digits.length;
        this.isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);
        this.animationDuration = 1500;

        this.init();
    }

    async init() {
        // 显示入场动画
        requestAnimationFrame(() => {
            this.container.classList.add('active');
        });

        const count = await this.getCount();
        if (count !== null) {
            this.animateCount(count);
        }
    }

    async getCount() {
        // 本地开发：使用 localStorage 模拟
        if (this.isLocal) {
            return this.getLocalCount();
        }

        // 线上环境：调用 Worker API
        // sessionStorage 防刷：同一会话只计数一次
        const sessionKey = 'visitor_counted';
        const cached = sessionStorage.getItem(sessionKey);

        if (cached) {
            return parseInt(cached, 10);
        }

        try {
            const res = await fetch('/api/counter');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const count = data.count;

            // 缓存到 sessionStorage（防刷）和 localStorage（降级备份）
            sessionStorage.setItem(sessionKey, count.toString());
            localStorage.setItem('visitor_count_backup', count.toString());

            return count;
        } catch (err) {
            // 降级：使用 localStorage 备份值
            const backup = localStorage.getItem('visitor_count_backup');
            if (backup) {
                return parseInt(backup, 10);
            }
            return this.getLocalCount();
        }
    }

    getLocalCount() {
        let count = parseInt(localStorage.getItem('visitor_local_count') || '0', 10);

        // 同一会话不重复计数
        if (!sessionStorage.getItem('visitor_counted_local')) {
            count += 1;
            localStorage.setItem('visitor_local_count', count.toString());
            sessionStorage.setItem('visitor_counted_local', '1');
        }

        return count;
    }

    animateCount(target) {
        const start = performance.now();
        const duration = this.animationDuration;

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutExpo 缓动
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);

            this.updateDigits(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.updateDigits(target);
            }
        };

        requestAnimationFrame(animate);
    }

    updateDigits(num) {
        const str = num.toString().padStart(this.totalDigits, '0');
        // 只取最后 totalDigits 位
        const trimmed = str.slice(-this.totalDigits);

        for (let i = 0; i < this.totalDigits; i++) {
            this.digits[i].textContent = trimmed[i];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VisitorCounter();
});
