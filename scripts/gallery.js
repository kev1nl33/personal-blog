// 画廊交互脚本
// 功能：图片加载、Bento 网格渲染、筛选、Lightbox、上传、管理

(function () {
    'use strict';

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    }
    function safeImageUrl(value) {
        try {
            const url = new URL(value, location.href);
            return ['http:', 'https:', 'blob:'].includes(url.protocol) ? escapeHtml(url.href) : '';
        } catch { return ''; }
    }

    // ========== 状态 ==========
    let photos = [];
    let filteredPhotos = [];
    let albums = [];
    let tags = [];
    let currentFilter = { type: 'all', value: null };
    let lightboxIndex = -1;
    let isAdmin = false;
    let apiKey = '';
    let apiAvailable = false;
    let loadError = false;

    // ========== DOM 缓存 ==========
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const grid = $('#gallery-grid');
    const filtersContainer = $('#gallery-filters');
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightbox-img');
    const lightboxCaption = $('#lightbox-caption');
    const lightboxCounter = $('#lightbox-counter');
    const uploadPanel = $('#upload-panel');
    const statPhotos = $('#stat-photos');
    const statAlbums = $('#stat-albums');

    // ========== 初始化 ==========
    async function init() {
        await loadPhotos();
        renderFilters();
        renderGrid();
        updateStats();
        bindEvents();
    }

    // ========== API 调用 ==========
    async function loadPhotos() {
        try {
            const params = new URLSearchParams();
            if (currentFilter.type === 'album') params.set('album', currentFilter.value);
            if (currentFilter.type === 'tag') params.set('tag', currentFilter.value);

            const res = await fetch(`/api/gallery/list?${params}`);
            if (!res.ok) throw new Error('API 不可用');
            apiAvailable = true;
            loadError = false;
            const data = await res.json();
            photos = data.photos || [];
            albums = data.albums || [];
            tags = data.tags || [];
        } catch (err) {
            // API 不可用时回退到本地静态 JSON
            apiAvailable = false;
            console.warn('API 不可用，使用本地数据:', err.message);
            try {
                const fallback = await fetch('gallery/gallery-data.json');
                if (!fallback.ok) throw new Error('静态相册不可用');
                const data = await fallback.json();
                loadError = false;
                photos = (data.photos || []).filter(photo => !String(photo.id).startsWith("demo-"));
                albums = [...new Set(photos.map(photo=>photo.album).filter(Boolean))];
                tags = [...new Set(photos.flatMap(photo=>photo.tags || []))];
            } catch {
                loadError = true;
                photos = [];
                albums = [];
                tags = [];
            }
        }
        applyFilter();
        const authorTools = $('#gallery-author-tools');
        if (authorTools) authorTools.hidden = !apiAvailable;
    }

    function applyFilter() {
        if (currentFilter.type === 'album') {
            filteredPhotos = photos.filter(p => p.album === currentFilter.value);
        } else if (currentFilter.type === 'tag') {
            filteredPhotos = photos.filter(p => p.tags?.includes(currentFilter.value));
        } else {
            filteredPhotos = photos;
        }
    }

    // ========== 渲染网格 ==========
    function renderGrid() {
        if (!grid) return;

        if (filteredPhotos.length === 0) {
            grid.innerHTML = `
                <div class="gallery-empty" style="grid-column: 1 / -1;">
                    <span class="gallery-empty-number" aria-hidden="true">01 / ◇</span>
                    <div class="gallery-empty-title">${loadError ? '影像暂时无法读取' : '有些画面，还在路上。'}</div>
                    <div class="gallery-empty-desc">${loadError ? '相册加载遇到问题，请稍后再试。' : '照片正在整理。这里会慢慢收下旅途与日常的片段。'}</div>
                </div>`;
            return;
        }

        // 分配 Bento 尺寸
        const sized = assignBentoSizes(filteredPhotos).map(photo => ({...photo,
            id:escapeHtml(photo.id),url:safeImageUrl(photo.url),caption:escapeHtml(photo.caption),
            originalName:escapeHtml(photo.originalName),album:escapeHtml(photo.album),
            tags:(photo.tags || []).map(escapeHtml)}));

        grid.innerHTML = sized.map((photo, i) => `
            <div class="gallery-item ${photo._bentoClass} reveal"
                 data-index="${i}" data-id="${photo.id}" role="button" tabindex="0" aria-label="查看照片：${photo.caption || photo.originalName}">
                <img src="${photo.url}" alt="${photo.caption || photo.originalName}"
                     loading="lazy" width="1200" height="900">
                <div class="gallery-item-overlay">
                    <div class="gallery-item-caption">${photo.caption || ''}</div>
                    <div class="gallery-item-meta">${photo.album}${photo.tags?.length ? ' · ' + photo.tags.join(' · ') : ''}</div>
                </div>
                <button class="gallery-item-delete" data-id="${photo.id}" title="删除">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `).join('');

        // 触发 scroll reveal
        requestAnimationFrame(triggerReveal);
    }

    function assignBentoSizes(list) {
        return list.map((photo, i) => {
            let cls = '';
            // 每 7 张图中: 第 1 张 featured, 第 4 张 wide, 第 6 张 tall
            const pos = i % 7;
            if (pos === 0) cls = 'gallery-item--featured';
            else if (pos === 3) cls = 'gallery-item--wide';
            else if (pos === 5) cls = 'gallery-item--tall';
            return { ...photo, _bentoClass: cls };
        });
    }

    // ========== 渲染筛选器 ==========
    function renderFilters() {
        if (!filtersContainer) return;

        let html = `<button class="gallery-filter-btn gallery-filter-btn--active" data-filter="all">全部</button>`;

        if (albums.length > 0) {
            html += `<div class="gallery-filter-divider"></div>`;
            html += albums.map(a =>
                `<button class="gallery-filter-btn" data-filter="album" data-value="${escapeHtml(a)}">${escapeHtml(a)}</button>`
            ).join('');
        }

        if (tags.length > 0) {
            html += `<div class="gallery-filter-divider"></div>`;
            html += tags.map(t =>
                `<button class="gallery-filter-btn" data-filter="tag" data-value="${escapeHtml(t)}">#${escapeHtml(t)}</button>`
            ).join('');
        }

        filtersContainer.innerHTML = html;
    }

    // ========== 统计更新 ==========
    function updateStats() {
        if (statPhotos) statPhotos.textContent = photos.length;
        if (statAlbums) statAlbums.textContent = albums.length;
        const stats = $('#gallery-stats');
        if (stats) stats.hidden = photos.length === 0;
        if (filtersContainer) filtersContainer.hidden = photos.length === 0;
        const related = $('#memory-related');
        if (related) related.hidden = photos.length > 0;
    }

    // ========== 事件绑定 ==========
    function bindEvents() {
        // 筛选点击
        filtersContainer?.addEventListener('click', async (e) => {
            const btn = e.target.closest('.gallery-filter-btn');
            if (!btn) return;

            $$('.gallery-filter-btn').forEach(b => b.classList.remove('gallery-filter-btn--active'));
            btn.classList.add('gallery-filter-btn--active');

            const type = btn.dataset.filter;
            const value = btn.dataset.value || null;
            currentFilter = { type, value };

            await loadPhotos();
            renderGrid();
            updateStats();
        });

        // 图片点击 -> Lightbox
        grid?.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.gallery-item-delete');
            if (deleteBtn) {
                e.stopPropagation();
                handleDelete(deleteBtn.dataset.id);
                return;
            }

            const item = e.target.closest('.gallery-item');
            if (!item) return;
            openLightbox(parseInt(item.dataset.index, 10));
        });

        grid?.addEventListener('keydown', event => {
            const item=event.target.closest('.gallery-item');
            if(item && event.target===item && ['Enter',' '].includes(event.key)){event.preventDefault();openLightbox(Number(item.dataset.index));}
        });

        // Lightbox 关闭
        $('#lightbox-close')?.addEventListener('click', closeLightbox);
        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Lightbox 导航
        $('#lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
        $('#lightbox-next')?.addEventListener('click', () => navigateLightbox(1));

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (!lightbox?.classList.contains('lightbox--open')) return;
            if (e.key === 'Tab') {
                const controls = [...lightbox.querySelectorAll('button')].filter(b => !b.disabled);
                const first=controls[0], last=controls[controls.length-1];
                if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();}
                else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}
            }
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });

        // 触摸滑动
        let touchStartX = 0;
        lightbox?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        lightbox?.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 50) {
                navigateLightbox(diff > 0 ? -1 : 1);
            }
        }, { passive: true });

        // 上传按钮
        $('#btn-upload')?.addEventListener('click', openUploadPanel);
        $('#upload-close')?.addEventListener('click', closeUploadPanel);
        uploadPanel?.addEventListener('click', (e) => {
            if (e.target === uploadPanel) closeUploadPanel();
        });

        // 拖拽上传
        const dropzone = $('#upload-dropzone');
        if (dropzone) {
            dropzone.addEventListener('click', () => $('#upload-file-input')?.click());
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('upload-dropzone--dragover');
            });
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('upload-dropzone--dragover');
            });
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('upload-dropzone--dragover');
                handleFiles(e.dataTransfer.files);
            });
        }

        $('#upload-file-input')?.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        $('#upload-submit')?.addEventListener('click', submitUpload);

        // 管理模式切换
        $('#btn-admin')?.addEventListener('click', toggleAdmin);
    }

    // ========== Lightbox ==========
    let dialogReturnFocus = null;
    function openLightbox(index) {
        if (index < 0 || index >= filteredPhotos.length) return;
        if (!lightbox?.classList.contains('lightbox--open')) dialogReturnFocus = document.activeElement;
        lightboxIndex = index;
        const photo = filteredPhotos[index];

        if (lightboxImg) { lightboxImg.src = safeImageUrl(photo.url); lightboxImg.alt = photo.caption || '照片预览'; }
        if (lightboxCaption) lightboxCaption.textContent = photo.caption || '';
        if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${filteredPhotos.length}`;

        lightbox?.classList.add('lightbox--open');
        $('#lightbox-close')?.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox?.classList.remove('lightbox--open');
        document.body.style.overflow = '';
        lightboxIndex = -1;
        dialogReturnFocus?.focus();
    }

    function navigateLightbox(dir) {
        const newIndex = lightboxIndex + dir;
        if (newIndex < 0 || newIndex >= filteredPhotos.length) return;
        openLightbox(newIndex);
    }

    // ========== 上传 ==========
    let pendingFiles = [];

    function openUploadPanel() {
        if (!apiKey) {
            apiKey = prompt('请输入管理密钥:');
            if (!apiKey) return;
        }
        uploadPanel?.classList.add('upload-panel--open');
        document.body.style.overflow = 'hidden';
    }

    function closeUploadPanel() {
        uploadPanel?.classList.remove('upload-panel--open');
        document.body.style.overflow = '';
        pendingFiles = [];
        const previews = $('#upload-previews');
        if (previews) previews.innerHTML = '';
        const fileInput = $('#upload-file-input');
        if (fileInput) fileInput.value = '';
    }

    function handleFiles(fileList) {
        pendingFiles = Array.from(fileList);
        const previews = $('#upload-previews');
        if (!previews) return;

        previews.innerHTML = pendingFiles.map(f => {
            const url = URL.createObjectURL(f);
            return `<img src="${url}" class="upload-preview" alt="${escapeHtml(f.name)}">`;
        }).join('');
    }

    async function submitUpload() {
        if (pendingFiles.length === 0) return;

        const submitBtn = $('#upload-submit');
        const progress = $('#upload-progress');
        const progressFill = $('#upload-progress-fill');
        const progressText = $('#upload-progress-text');

        if (submitBtn) submitBtn.disabled = true;
        if (progress) progress.classList.add('upload-progress--active');

        const album = $('#upload-album')?.value || '未分类';
        const tagsVal = $('#upload-tags')?.value || '';
        const caption = $('#upload-caption')?.value || '';

        const formData = new FormData();
        pendingFiles.forEach(f => formData.append('files', f));
        formData.append('album', album);
        formData.append('tags', tagsVal);
        formData.append('caption', caption);

        try {
            if (progressText) progressText.textContent = '上传中...';
            if (progressFill) progressFill.style.width = '30%';

            const res = await fetch('/api/gallery/upload', {
                method: 'POST',
                headers: { 'X-Gallery-Key': apiKey },
                body: formData,
            });

            if (progressFill) progressFill.style.width = '80%';

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || '上传失败');
            }

            const data = await res.json();
            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = `上传完成: ${data.results.filter(r => r.success).length} 张`;

            setTimeout(async () => {
                closeUploadPanel();
                if (submitBtn) submitBtn.disabled = false;
                if (progress) progress.classList.remove('upload-progress--active');
                if (progressFill) progressFill.style.width = '0%';

                currentFilter = { type: 'all', value: null };
                await loadPhotos();
                renderFilters();
                renderGrid();
                updateStats();
            }, 1000);
        } catch (err) {
            alert('上传失败: ' + err.message);
            if (submitBtn) submitBtn.disabled = false;
            if (progress) progress.classList.remove('upload-progress--active');
        }
    }

    // ========== 删除 ==========
    async function handleDelete(id) {
        if (!confirm('确定删除这张照片？')) return;

        try {
            const res = await fetch('/api/gallery/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Gallery-Key': apiKey,
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error('删除失败');

            await loadPhotos();
            renderGrid();
            updateStats();
        } catch (err) {
            alert('删除失败: ' + err.message);
        }
    }

    // ========== 管理模式 ==========
    function toggleAdmin() {
        if (!isAdmin) {
            apiKey = prompt('请输入管理密钥:');
            if (!apiKey) return;
        }
        isAdmin = !isAdmin;
        document.body.classList.toggle('admin-mode', isAdmin);
        const adminBar = $('.gallery-admin-bar');
        if (adminBar) adminBar.classList.toggle('gallery-admin-bar--visible', isAdmin);
        const adminBtn = $('#btn-admin');
        if (adminBtn) adminBtn.textContent = isAdmin ? '退出管理' : '管理';
    }

    // ========== Scroll Reveal ==========
    function triggerReveal() {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach((el) => observer.observe(el));
    }

    // ========== 启动 ==========
    document.addEventListener('DOMContentLoaded', init);
})();
