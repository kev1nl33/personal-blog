/**
 * ==========================================================================
 * AWARD.JS - Pure Vanilla JS Animation & Micro-Interaction Engine
 * Awwwards / Webby / FWA Standard for 计划李 (Kevin Lee)
 * ==========================================================================
 */

(function () {
  'use strict';

  // 1. Accessibility Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollReveal();
    initNav();
    initNavScroll();
    initProgress();
    initBackToTop();
    initCounter();
    initArchiveFilters();
    initCoffeeInteractions();

    if (isFinePointer && !prefersReducedMotion) {
      initMagnetic();
      initCardTilt();
    }
  });

  /* ------------------------------------------------------------------------
     01. Page Loader & Orchestrated Curtain Reveal
     ------------------------------------------------------------------------ */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) {
      startHeroChoreography();
      return;
    }

    const progressBar = loader.querySelector('.loader-progress-bar');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';

        setTimeout(() => {
          loader.classList.add('is-loaded');
          startHeroChoreography();
          setTimeout(() => {
            loader.style.display = 'none';
          }, 900);
        }, 160);
      } else {
        if (progressBar) progressBar.style.width = `${progress}%`;
      }
    }, 30);
  }

  function startHeroChoreography() {
    const eyebrow = document.querySelector('.hero-eyebrow');
    const title = document.getElementById('hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const desc = document.querySelector('.hero-description');
    const cta = document.querySelector('.hero-cta');
    const counter = document.getElementById('visitor-counter');

    if (eyebrow) eyebrow.classList.add('is-visible');
    if (title) title.classList.add('is-visible');
    if (subtitle) subtitle.classList.add('is-visible');
    if (desc) desc.classList.add('is-visible');
    if (cta) cta.classList.add('is-visible');
    if (counter) counter.classList.add('is-visible');
  }

  /* ------------------------------------------------------------------------
     03. Scroll Reveal via IntersectionObserver
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.hero .reveal)');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     04. Navigation & Mobile Drawer
     ------------------------------------------------------------------------ */
  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const overlay = document.getElementById('nav-overlay');
    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('is-active');
      overlay.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      const links = overlay.querySelectorAll('.nav-overlay-link');
      if (isOpen) {
        links.forEach((link, i) => {
          link.style.transitionDelay = `${0.08 + i * 0.05}s`;
          link.classList.add('is-visible');
        });
      } else {
        links.forEach(link => {
          link.style.transitionDelay = '0s';
          link.classList.remove('is-visible');
        });
      }
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-active');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  function initNavScroll() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 15) {
            nav.classList.add('is-scrolled');
          } else {
            nav.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     05. Reading Progress
     ------------------------------------------------------------------------ */
  function initProgress() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = (window.scrollY / total) * 100;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     06. Back to Top Button
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     07. Visitor Counter Digital Flip
     ------------------------------------------------------------------------ */
  function initCounter() {
    const display = document.getElementById('counter-display');
    if (!display) return;

    const digits = display.querySelectorAll('.counter-digit');
    if (!digits.length) return;

    const targetNumber = 12480;
    const duration = 1800;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const current = Math.floor((1 - Math.pow(2, -10 * progress)) * targetNumber);

      const str = String(current).padStart(digits.length, '0');
      str.split('').forEach((char, idx) => {
        if (digits[idx]) digits[idx].textContent = char;
      });

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    // Trigger when hero is ready
    setTimeout(() => {
      requestAnimationFrame(update);
    }, 800);
  }

  /* ------------------------------------------------------------------------
     08. Magnetic Button Micro-Interaction
     ------------------------------------------------------------------------ */
  function initMagnetic() {
    const elements = document.querySelectorAll('.magnetic');

    elements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
        el.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.12s ease-out';
      });
    });
  }



  /* ------------------------------------------------------------------------
     10. 3D Card Subtle Tilt on Desktop
     ------------------------------------------------------------------------ */
  function initCardTilt() {
    const cards = document.querySelectorAll('.card, .topic-card, .blog-card, .skill-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = -(y / (rect.height / 2)) * 3.5;
        const rotateY = (x / (rect.width / 2)) * 3.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  /* ------------------------------------------------------------------------
     11. Archive Filter & Instant Search Engine (blog.html)
     ------------------------------------------------------------------------ */
  function initArchiveFilters() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;

    const cards = Array.from(blogGrid.querySelectorAll('.blog-card'));
    const categoryBtns = Array.from(document.querySelectorAll('.category-btn'));
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchCount = document.getElementById('searchCount');
    const emptyState = document.getElementById('searchEmpty');

    // 1. Calculate & display counts on category pills
    const counts = { all: cards.length };
    cards.forEach(c => {
      const cat = c.dataset.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    categoryBtns.forEach(btn => {
      const cat = btn.dataset.category;
      if (counts[cat] !== undefined) {
        let pill = btn.querySelector('.count-pill');
        if (!pill) {
          pill = document.createElement('span');
          pill.className = 'count-pill';
          btn.appendChild(pill);
        }
        pill.textContent = counts[cat];
      }
    });

    let activeCategory = 'all';
    let searchQuery = '';

    function applyFilter() {
      let visibleCount = 0;
      const term = searchQuery.trim().toLowerCase();

      cards.forEach(card => {
        const cat = card.dataset.category;
        const title = (card.querySelector('.blog-card-title, h3') || {}).textContent || '';
        const excerpt = (card.querySelector('.blog-card-excerpt, p') || {}).textContent || '';
        const tags = card.dataset.tags || '';

        const matchesCategory = (activeCategory === 'all' || cat === activeCategory);
        const matchesSearch = !term ||
          title.toLowerCase().includes(term) ||
          excerpt.toLowerCase().includes(term) ||
          tags.toLowerCase().includes(term);

        if (matchesCategory && matchesSearch) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Update Result Counter
      if (searchCount) {
        if (searchQuery.trim() || activeCategory !== 'all') {
          searchCount.innerHTML = `已筛选出 <strong>${visibleCount}</strong> 篇相关文章`;
          searchCount.style.display = 'block';
        } else {
          searchCount.innerHTML = `共 <strong>${cards.length}</strong> 篇文章`;
          searchCount.style.display = 'block';
        }
      }

      // Empty State Display
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
      }

      // Clear button display
      if (searchClear) {
        searchClear.style.display = searchQuery ? 'block' : 'none';
      }
    }

    // Category click handler
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category || 'all';
        applyFilter();
      });
    });

    // Search input handler with debounce
    if (searchInput) {
      let timer = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          searchQuery = e.target.value;
          applyFilter();
        }, 80);
      });

      // Clear button
      if (searchClear) {
        searchClear.addEventListener('click', () => {
          searchInput.value = '';
          searchQuery = '';
          searchInput.focus();
          applyFilter();
        });
      }

      // Keyboard Shortcut '/' to focus search
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        } else if (e.key === 'Escape' && document.activeElement === searchInput) {
          searchInput.blur();
        }
      });
    }

    // URL parameter auto-filtering (e.g. ?category=ai)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      const targetBtn = categoryBtns.find(b => b.dataset.category === catParam);
      if (targetBtn) {
        categoryBtns.forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        activeCategory = catParam;
      }
    }

    // Initial pass
    applyFilter();
  }

  /* ------------------------------------------------------------------------
     12. Coffee Tabs & Expandable Gear Cards (coffee.html)
     ------------------------------------------------------------------------ */
  function initCoffeeInteractions() {
    const tabBtns = document.querySelectorAll('.coffee-tabs .tab-btn');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('tab-btn--active'));
        document.querySelectorAll('.tab-content').forEach(c => {
          c.classList.add('hidden');
          c.classList.remove('tab-content--active');
        });

        btn.classList.add('tab-btn--active');
        const targetId = btn.dataset.tab;
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.remove('hidden');
          targetContent.classList.add('tab-content--active');
        }
      });
    });

    document.querySelectorAll('.equipment-expandable-card').forEach(card => {
      const preview = card.querySelector('.card-preview');
      const details = card.querySelector('.card-details');
      if (preview && details) {
        preview.addEventListener('click', () => {
          details.classList.toggle('hidden');
        });
      }
    });
  }

})();
