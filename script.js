// Theme toggle (persisted)
(function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
    const btn = document.getElementById('themeToggle');
    btn?.addEventListener('click', () => {
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        if (light) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
        else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
    });
})();

// Fixed header: spacer adjustment for real height
(function () {
    function setSpacer() {
        const h = document.getElementById('siteHeader').offsetHeight || 64;
        document.getElementById('headerSpacer').style.height = h + 'px';
        document.documentElement.style.setProperty('--header-h', h + 'px');
    }
    window.addEventListener('load', setSpacer);
    window.addEventListener('resize', setSpacer);
})();

// Blur/transparent on scroll
(function () {
    const header = document.getElementById('siteHeader');
    const onScroll = () => {
        if (window.scrollY > 8) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// Scroll reveal
(function () {
    const els = document.querySelectorAll('.reveal, .project, .card');
    els.forEach(el => el.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .14 });
    els.forEach(el => io.observe(el));
})();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

(function () {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = 'Sending...';
        submitBtn.disabled = true;

        const data = new FormData(form);
        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                form.reset();
                status.textContent = 'Thanks! Your message has been sent.';
            } else {
                const err = await res.json().catch(() => ({}));
                const msg = err?.errors?.[0]?.message || 'Something went wrong. Please try again or email directly.';
                status.textContent = msg;
            }
        } catch {
            status.textContent = 'Network error. Please try again.';
        } finally {
            submitBtn.disabled = false;
        }
    });
})();