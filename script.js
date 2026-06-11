/* ============================================================
   KNOWLEDGE EXPERTS — script.js
   Fully unified JS for all pages
   ============================================================ */

// ─── 1. MOBILE NAV INJECTION (works on ALL pages) ────────────
// Automatically injects the hamburger button if it doesn't exist
(function injectMobileNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Inject button if missing
    if (!document.getElementById('mobile-toggle')) {
        const btn = document.createElement('button');
        btn.className = 'mobile-menu-btn';
        btn.id = 'mobile-toggle';
        btn.setAttribute('aria-label', 'فتح القائمة');
        btn.innerHTML = `<i class="fas fa-bars icon-bars"></i><i class="fas fa-times icon-times"></i>`;
        nav.appendChild(btn);
    }

    // Make sure the UL has the right id
    const ul = nav.querySelector('ul');
    if (ul && !ul.id) ul.id = 'nav-menu';
})();

// ─── 2. INIT (runs after DOM is ready) ───────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // ── Page fade-in ────────────────────────────────────────
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.45s ease';
        document.body.style.opacity = '1';
    });

    // ── Mobile nav toggle ───────────────────────────────────
    const toggle  = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggle && navMenu) {
        // Add CSS transition for smooth slide-down once
        injectMobileNavStyles();

        toggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            toggle.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');

            // Animate height
            if (isOpen) {
                navMenu.style.maxHeight = navMenu.scrollHeight + 'px';
                navMenu.style.opacity  = '1';
            } else {
                navMenu.style.maxHeight = '0';
                navMenu.style.opacity  = '0';
            }
        });

        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-label', 'فتح القائمة');
                navMenu.style.maxHeight = '0';
                navMenu.style.opacity   = '0';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                toggle.classList.remove('is-open');
                navMenu.style.maxHeight = '0';
                navMenu.style.opacity   = '0';
            }
        });
    }

    // ── Sticky nav shrink on scroll ─────────────────────────
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('nav-scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    // ── Active nav link highlight ───────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href*="#"]');

    function setActiveLink() {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${current}` || href === `index.html#${current}`);
        });
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    // ── Smooth scroll for anchor links ──────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Scroll reveal ───────────────────────────────────────
    const revealEls = document.querySelectorAll(
        '.about, .program, .feature-item, .pricing-card, .step-card, ' +
        '.faq-item, .info-box, .program-description, .form-section'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Staggered delay for grid children
                const siblings = [...entry.target.parentElement.children];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${Math.min(idx * 60, 400)}ms`;
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => {
        el.classList.add('will-reveal');
        revealObserver.observe(el);
    });

    // ── Animated counters ───────────────────────────────────
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el      = entry.target;
                const raw     = el.textContent.replace(/[^0-9]/g, '');
                const suffix  = el.textContent.replace(/[0-9]/g, '').trim();
                const target  = parseInt(raw);
                if (!raw) return;
                const start   = performance.now();
                const dur     = 1600;
                const tick = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
                    el.textContent = Math.floor(eased * target) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    // ── FAQ Accordion ───────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', function () {
            const item     = this.parentElement;
            const answer   = item.querySelector('.faq-answer');
            const isOpen   = item.classList.contains('active');

            // Close others
            document.querySelectorAll('.faq-item.active').forEach(open => {
                if (open !== item) {
                    open.classList.remove('active');
                    const a = open.querySelector('.faq-answer');
                    if (a) { a.style.maxHeight = '0'; a.style.opacity = '0'; }
                }
            });

            item.classList.toggle('active', !isOpen);
            if (answer) {
                if (!isOpen) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity   = '1';
                } else {
                    answer.style.maxHeight = '0';
                    answer.style.opacity   = '0';
                }
            }
        });
    });

    // ── Contact form ─────────────────────────────────────────
    const mainForm = document.getElementById('contact');
    if (mainForm) {
        mainForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name    = document.getElementById('name')?.value.trim();
            const email   = document.getElementById('email')?.value.trim();
            const country = document.getElementById('country')?.value;
            const message = document.getElementById('message')?.value.trim();

            if (!name)                     { showNotification('الرجاء إدخال اسمك', 'error'); return; }
            if (!email || !isValidEmail(email)) { showNotification('الرجاء إدخال بريد إلكتروني صحيح', 'error'); return; }
            if (!country)                  { showNotification('الرجاء اختيار بلدك', 'error'); return; }
            if (!message)                  { showNotification('الرجاء إدخال رسالتك', 'error'); return; }

            showNotification('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا', 'success');
            this.reset();
        });
    }

    // ── Newsletter form ──────────────────────────────────────
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]')?.value;
            if (email) {
                showNotification('تم الاشتراك بنجاح! شكراً لك', 'success');
                this.reset();
            }
        });
    }

    // ── Auto-fill selected program ───────────────────────────
    const selectedProgram = localStorage.getItem('selectedProgram');
    if (selectedProgram) {
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            const note = document.createElement('div');
            note.style.cssText = 'background:rgba(26,86,219,0.08);padding:12px 16px;border-radius:8px;' +
                'margin-bottom:16px;border-right:3px solid #1a56db;color:#1a56db;font-size:14px;';
            note.innerHTML = `<strong>البرنامج المختار:</strong> ${selectedProgram}`;
            countrySelect.parentElement.insertBefore(note, countrySelect);
        }
        localStorage.removeItem('selectedProgram');
    }

    // ── Lazy load images ─────────────────────────────────────
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                    imgObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
    }

    // ── Scroll-to-top button ─────────────────────────────────
    const topBtn = document.createElement('button');
    topBtn.className = 'scroll-to-top';
    topBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    topBtn.title = 'العودة للأعلى';
    document.body.appendChild(topBtn);

    window.addEventListener('scroll', () => {
        topBtn.classList.toggle('show', window.pageYOffset > 400);
    }, { passive: true });

    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Input focus animations ────────────────────────────────
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('focus', () => el.parentElement?.classList.add('focused'));
        el.addEventListener('blur',  () => el.parentElement?.classList.remove('focused'));
    });

    // ── Ripple effect on buttons ─────────────────────────────
    document.querySelectorAll('.submit-btn, .contact-btn, .back-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect   = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size   = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute; border-radius:50%;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                background:rgba(255,255,255,0.25);
                transform:scale(0); animation:ripple-anim 0.55s ease-out forwards;
                pointer-events:none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Inject ripple keyframe once
    if (!document.querySelector('style[data-ripple]')) {
        const s = document.createElement('style');
        s.setAttribute('data-ripple', '1');
        s.textContent = `@keyframes ripple-anim { to { transform:scale(2.5); opacity:0; } }`;
        document.head.appendChild(s);
    }

    console.log('✨ KExperts scripts loaded');
});

// ─── 3. HELPERS ──────────────────────────────────────────────

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── 4. NOTIFICATION ─────────────────────────────────────────
function showNotification(message, type = 'success') {
    if (!document.querySelector('style[data-notif]')) {
        const s = document.createElement('style');
        s.setAttribute('data-notif', '1');
        s.textContent = `
            .kexp-notif {
                position: fixed; top: 24px; left: 24px;
                background: #fff;
                border-radius: 12px; padding: 14px 20px;
                display: flex; align-items: center; gap: 12px;
                font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
                color: #111; direction: rtl;
                z-index: 9999;
                box-shadow: 0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
                border: 1px solid #e4e3df;
                transform: translateY(-16px) scale(0.96); opacity: 0;
                transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
                max-width: min(360px, 90vw);
            }
            .kexp-notif.kexp-show { transform: translateY(0) scale(1); opacity: 1; }
            .kexp-notif-icon { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
            .kexp-notif.success .kexp-notif-icon { background:#e8faf0; color:#22c55e; }
            .kexp-notif.error   .kexp-notif-icon { background:#fef2f2; color:#ef4444; }
            .kexp-notif-bar { position:absolute; bottom:0; right:0; height:3px; border-radius:0 0 12px 12px; animation: kexp-bar 4s linear forwards; }
            .kexp-notif.success .kexp-notif-bar { background:#22c55e; }
            .kexp-notif.error   .kexp-notif-bar { background:#ef4444; }
            @keyframes kexp-bar { from { width:100%; } to { width:0%; } }
            @media (max-width:480px) { .kexp-notif { left:12px; right:12px; max-width:none; } }
        `;
        document.head.appendChild(s);
    }

    const icon = type === 'success' ? 'fa-check' : 'fa-exclamation';
    const el = document.createElement('div');
    el.className = `kexp-notif ${type}`;
    el.innerHTML = `
        <div class="kexp-notif-icon"><i class="fas ${icon}"></i></div>
        <span>${message}</span>
        <div class="kexp-notif-bar"></div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('kexp-show')));

    setTimeout(() => {
        el.classList.remove('kexp-show');
        setTimeout(() => el.remove(), 350);
    }, 4200);
}

// ─── 5. MOBILE NAV CSS INJECTION ─────────────────────────────
function injectMobileNavStyles() {
    if (document.querySelector('style[data-mobile-nav]')) return;
    const s = document.createElement('style');
    s.setAttribute('data-mobile-nav', '1');
    s.textContent = `
        /* Override display:none with animated height */
        @media (max-width: 768px) {
            nav ul#nav-menu {
                display: flex !important;
                max-height: 0 !important;
                opacity: 0 !important;
                overflow: hidden;
                transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1),
                            opacity 0.28s ease !important;
                pointer-events: none;
            }
            nav ul#nav-menu.active {
                max-height: 400px !important;
                opacity: 1 !important;
                pointer-events: auto;
            }

            /* Nav items slide in staggered */
            nav ul#nav-menu li {
                transform: translateX(12px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            nav ul#nav-menu.active li:nth-child(1) { transform:translateX(0); opacity:1; transition-delay:0.05s; }
            nav ul#nav-menu.active li:nth-child(2) { transform:translateX(0); opacity:1; transition-delay:0.10s; }
            nav ul#nav-menu.active li:nth-child(3) { transform:translateX(0); opacity:1; transition-delay:0.15s; }
            nav ul#nav-menu.active li:nth-child(4) { transform:translateX(0); opacity:1; transition-delay:0.20s; }
            nav ul#nav-menu.active li:nth-child(5) { transform:translateX(0); opacity:1; transition-delay:0.25s; }

            /* Nav shrink on scroll */
            nav.nav-scrolled {
                height: 56px !important;
                box-shadow: 0 2px 16px rgba(0,0,0,0.10) !important;
            }
        }

        /* Scroll reveal classes */
        .will-reveal {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* FAQ smooth open */
        .faq-answer {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
        }

        /* Nav shrink desktop */
        nav.nav-scrolled {
            height: 60px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.10);
        }
        nav {
            transition: height 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(s);
}
