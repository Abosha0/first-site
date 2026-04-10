// ============================================
// PAGE TRANSITION — fade in on load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 10);
});

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
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

// ============================================
// AUTO-FILL SELECTED PROGRAM (from programs.html)
// ============================================
window.addEventListener('load', () => {
    const selectedProgram = localStorage.getItem('selectedProgram');
    if (selectedProgram) {
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            const programNote = document.createElement('div');
            programNote.style.cssText =
                'background:rgba(102,126,234,0.2);padding:15px;border-radius:10px;' +
                'margin-bottom:20px;border-right:4px solid #667eea;color:rgba(255,255,255,0.9);';
            programNote.innerHTML = `<strong>البرنامج المختار:</strong> ${selectedProgram}`;
            countrySelect.parentElement.insertBefore(programNote, countrySelect);
        }
        localStorage.removeItem('selectedProgram');
    }
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.about, .program').forEach(el => revealObserver.observe(el));

// ============================================
// MAIN CONTACT FORM VALIDATION (site.html)
// ============================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const mainForm = document.getElementById('contact');
if (mainForm) {
    mainForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name    = document.getElementById('name')?.value.trim();
        const email   = document.getElementById('email')?.value.trim();
        const country = document.getElementById('country')?.value;
        const message = document.getElementById('message')?.value.trim();

        if (!name)                          { showNotification('الرجاء إدخال اسمك', 'error'); return; }
        if (!email || !validateEmail(email)) { showNotification('الرجاء إدخال بريد إلكتروني صحيح', 'error'); return; }
        if (!country)                        { showNotification('الرجاء اختيار بلدك', 'error'); return; }
        if (!message)                        { showNotification('الرجاء إدخال رسالتك', 'error'); return; }

        showNotification('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا', 'success');
        this.reset();
    });
}

// ============================================
// NEWSLETTER FORM
// ============================================
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

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type) {
    // Inject styles once
    if (!document.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            .notification {
                position: fixed; top: 20px; right: 20px;
                background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(102,126,234,0.1));
                backdrop-filter: blur(20px);
                border: 1.5px solid rgba(255,255,255,0.3);
                border-radius: 12px; padding: 16px 20px;
                color: #ffffff; font-weight: 600;
                z-index: 9999; transform: translateX(420px); opacity: 0;
                transition: all 0.3s ease;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2); max-width: 90vw;
            }
            .notification.show { transform: translateX(0); opacity: 1; }
            .notification-success { border-color: rgba(76,175,80,0.6); background: linear-gradient(135deg,rgba(76,175,80,0.2),rgba(102,126,234,0.1)); }
            .notification-error   { border-color: rgba(244,67,54,0.6);  background: linear-gradient(135deg,rgba(244,67,54,0.2), rgba(102,126,234,0.1)); }
            .notification-content { display:flex; align-items:center; gap:10px; }
            .notification i { font-size:20px; }
            @media (max-width:480px) { .notification { right:10px; left:10px; max-width:none; } }
        `;
        document.head.appendChild(style);
    }

    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `<div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span></div>`;
    document.body.appendChild(el);

    setTimeout(() => el.classList.add('show'), 80);
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 350);
    }, 4000);
}

// ============================================
// ANIMATED COUNTERS (stat-number elements)
// ============================================
function animateCounter(element, target, duration = 1500) {
    const start = performance.now();
    const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        element.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = target;
    };
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const raw = el.textContent.replace(/[^0-9]/g, '');
            const suffix = el.textContent.replace(/[0-9]/g, '').trim();
            if (raw) {
                animateCounter({ set textContent(v) { el.textContent = v + suffix; } }, parseInt(raw));
            }
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ============================================
// ACTIVE NAV LINK on scroll (single-page only)
// ============================================
window.addEventListener('scroll', () => {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('nav a[href^="#"]');
    let current = '';

    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// ============================================
// FAQ ACCORDION (faq.html)
// ============================================
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function () {
        this.parentElement.classList.toggle('active');
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function createMobileMenu() {
    const nav = document.querySelector('nav ul');
    if (!nav || window.innerWidth > 768) return;
    if (document.querySelector('.mobile-menu-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.innerHTML = '<i class="fas fa-bars"></i>';
    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
        btn.innerHTML = nav.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
    document.querySelector('nav').insertBefore(btn, nav);
}
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', () => {
    const btn = document.querySelector('.mobile-menu-btn');
    if (btn && window.innerWidth > 768) {
        btn.remove();
        const nav = document.querySelector('nav ul');
        if (nav) nav.classList.remove('active');
    } else {
        createMobileMenu();
    }
});

// ============================================
// SCROLL-TO-TOP BUTTON
// ============================================
(function createScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.title = 'العودة للأعلى';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.pageYOffset > 300);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

   
})();

// ============================================
// EXPANDABLE ABOUT SECTIONS (site.html)
// ============================================
document.querySelectorAll('.about').forEach(section => {
    const btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    btn.setAttribute('aria-label', 'توسيع القسم');
    section.appendChild(btn);
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        section.classList.toggle('expanded-about');
        btn.querySelector('i').style.transform =
            section.classList.contains('expanded-about') ? 'rotate(180deg)' : '';
    });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
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

// ============================================
// TOOLTIP for [data-tooltip] elements
// ============================================
document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.style.position = 'relative';
    el.addEventListener('mouseenter', function () {
        const tip = document.createElement('div');
        tip.className = 'tooltip';
        tip.textContent = this.getAttribute('data-tooltip');
        tip.style.cssText =
            'position:absolute;background:rgba(0,0,0,0.8);color:#fff;padding:8px 12px;' +
            'border-radius:6px;font-size:12px;white-space:nowrap;bottom:125%;left:50%;' +
            'transform:translateX(-50%);z-index:1000;pointer-events:none;';
        this.appendChild(tip);
    });
    el.addEventListener('mouseleave', function () {
        this.querySelector('.tooltip')?.remove();
    });
});

console.log('✨ Website interactivity loaded successfully!');