document.addEventListener('DOMContentLoaded', function() {
    const links = Array.from(document.querySelectorAll('.journal-photo-link'));
    const dialog = document.querySelector('.journal-lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const image = dialog.querySelector('.journal-lightbox-image');
    const caption = dialog.querySelector('#lightbox-caption');
    const count = dialog.querySelector('[data-count]');
    let selected = 0;
    let trigger;

    function showPhoto(index) {
        selected = (index + links.length) % links.length;
        const photo = links[selected].querySelector('img');
        image.src = links[selected].href;
        image.alt = photo.alt;
        caption.textContent = photo.alt;
        count.textContent = `${selected + 1} / ${links.length}`;
    }

    links.forEach(function(link, index) {
        link.addEventListener('click', function(event) {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            trigger = link;
            showPhoto(index);
            dialog.showModal();
            document.body.classList.add('journal-viewing');
        });
    });

    dialog.querySelector('[data-close]').addEventListener('click', function() { dialog.close(); });
    dialog.querySelector('[data-previous]').addEventListener('click', function() { showPhoto(selected - 1); });
    dialog.querySelector('[data-next]').addEventListener('click', function() { showPhoto(selected + 1); });
    dialog.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            showPhoto(selected + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    dialog.addEventListener('close', function() {
        document.body.classList.remove('journal-viewing');
        image.removeAttribute('src');
        if (trigger) trigger.focus({ preventScroll: true });
    });

    // 滚动路线条：随滚动高亮当前站（仅对 data-scrollspy 的分组导航启用）
    const routeNav = document.querySelector('.journal-index[data-scrollspy]');
    if (routeNav) {
        const routeLinks = Array.from(routeNav.querySelectorAll('a[href^="#"]'));
        const setActive = function(id) {
            routeLinks.forEach(function(link) {
                const active = link.hash === '#' + id;
                const changed = active && !link.classList.contains('is-active');
                link.classList.toggle('is-active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
                if (changed && routeNav.scrollWidth >= routeNav.clientWidth) {
                    const strip = link.parentElement;
                    if (strip.scrollWidth > strip.clientWidth) {
                        strip.scrollLeft = link.offsetLeft - strip.offsetLeft - (strip.clientWidth - link.offsetWidth) / 2;
                    }
                }
            });
        };
        const sections = routeLinks
            .map(function(link) { return document.getElementById(link.hash.slice(1)); })
            .filter(Boolean);
        // 锚线略低于 scroll-margin 落点（170px），保证最后一站受文档高度限制滚不到位时也能命中
        const anchorLine = 220;
        const syncActive = function() {
            let current = sections.length && sections[0].getBoundingClientRect().top > anchorLine ? sections[0].id : null;
            sections.forEach(function(section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= anchorLine && rect.bottom > anchorLine) current = section.id;
            });
            if (!current && sections.length) {
                const last = sections[sections.length - 1].getBoundingClientRect();
                if (last.bottom <= anchorLine) current = sections[sections.length - 1].id;
            }
            if (current) setActive(current);
        };
        if (routeLinks.length) setActive(routeLinks[0].hash.slice(1));
        // 用 scroll + rAF 而不是 IntersectionObserver：平滑滚动动画中段不会再有相交回调，位置会算在中途
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function() { ticking = false; syncActive(); });
        }, { passive: true });
        syncActive();
    }
});
