document.addEventListener('DOMContentLoaded', () => {

    // ─── Dynamic copyright year ───────────────────────────────────────────
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ─── Dark / Light Mode ────────────────────────────────────────────────
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    // Sync icon with whatever the FOUC script set
    updateThemeIcon(html.getAttribute('data-theme') || 'light');

    themeToggle.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });

    // ─── Navbar scroll effect ─────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ─── Mobile menu toggle ───────────────────────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    function setHamburger(open) {
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity  = open ? '0' : '1';
        spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            setHamburger(isOpen);
        });

        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                setHamburger(false);
            }
        });
    });

    // ─── Intersection Observer: fade-in sections ──────────────────────────
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => appearOnScroll.observe(el));

    // ─── Staggered skill tag animation ────────────────────────────────────
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.expertise-tag.tag-hidden');
                tags.forEach((tag, i) => {
                    setTimeout(() => tag.classList.add('tag-visible'), i * 55);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.expertise-row').forEach(row => {
        row.querySelectorAll('.expertise-tag').forEach(tag => tag.classList.add('tag-hidden'));
        skillObserver.observe(row);
    });

    // ─── Active nav link on scroll ────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - 220) current = section.getAttribute('id');
        });
        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }, { passive: true });

    // ─── Project filter ───────────────────────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;

                if (match) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = '';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') card.style.display = 'none';
                    }, 280);
                }
            });
        });
    });

    // ─── Copy email to clipboard ──────────────────────────────────────────
    const copyEmailBtn = document.getElementById('copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('arvinder.mundra@tamu.edu').then(() => {
                const icon = copyEmailBtn.querySelector('i');
                const prevClass = icon.className;
                icon.className = 'fa-solid fa-check';
                copyEmailBtn.classList.add('copied');
                copyEmailBtn.title = 'Copied!';

                setTimeout(() => {
                    icon.className = prevClass;
                    copyEmailBtn.classList.remove('copied');
                    copyEmailBtn.title = 'Copy email address';
                }, 2200);
            }).catch(() => {
                // Fallback for non-HTTPS or unsupported browsers
                const ta = document.createElement('textarea');
                ta.value = 'arvinder.mundra@tamu.edu';
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            });
        });
    }

});
