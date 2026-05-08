document.addEventListener('DOMContentLoaded', () => {

    /* ── Nav: sticky + mobile ─────────────────── */
    const nav    = document.getElementById('nav');
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('stuck', window.scrollY > 40);
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    if (toggle) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            const spans = toggle.querySelectorAll('span');
            if (open) {
                spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
                spans[1].style.opacity   = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
            } else {
                spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            }
        });

        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            });
        });
    }

    /* ── Active nav link ──────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navAs    = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let cur = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 160) cur = s.id;
        });
        navAs.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${cur}`);
        });
    }, { passive: true });

    /* ── Scroll-to-top ────────────────────────── */
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ── Scroll-in animations ─────────────────── */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate], [data-animate-delay]').forEach(el => io.observe(el));

    /* ── Typing animation ─────────────────────── */
    const roles   = ['Software Engineer', 'Full-Stack Developer', 'Data Scientist', 'Backend Engineer'];
    const typed   = document.getElementById('typed-role');

    if (typed) {
        let ri = 0, ci = 0, deleting = false;

        const tick = () => {
            const word = roles[ri];
            typed.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
            deleting ? ci-- : ci++;

            let delay = deleting ? 55 : 95;
            if (!deleting && ci === word.length)   { delay = 2200; deleting = true; }
            else if (deleting && ci === 0)         { deleting = false; ri = (ri + 1) % roles.length; delay = 380; }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 1000);
    }
});
