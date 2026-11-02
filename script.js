'use strict';
// Replace these demonstration values with the school's real details.
const SCHOOL = { name: 'THULASI Driving School', email: '', phone: '', address: '' };
const loader = document.querySelector('#loader');
let introTimer;
function finishIntro() {
    clearTimeout(introTimer);

    loader?.classList.add('done');

    document.body.classList.remove('loading');
    document.body.classList.add('intro-finished');
}
function playIntro() {
  clearTimeout(introTimer);

  if (
    !loader ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    finishIntro();
    return;
  }

  document.body.classList.add('loading');
  loader.classList.remove('done');

  const bar = loader.querySelector('.progress i');

  if (bar) {
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
  }

  introTimer = setTimeout(finishIntro, 2100);
}

document.querySelector('#skip')
  ?.addEventListener('click', finishIntro);

document.querySelector('#replay')
  ?.addEventListener('click', playIntro);

playIntro();
const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('nav');
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); menu.textContent = open ? '×' : '☰'; });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); menu.textContent = '☰'; }));
const courseDescriptions = {
    'Beginner Driving': 'Start with the basics: car controls, safe observation, moving off, steering, braking, turns, and parking. Enquire to discuss your experience and a suitable lesson plan. Course length, vehicles, fees, and availability must be confirmed by the school.',
    'Refresher Lessons': 'Return to the road with focused practice. Discuss the skills you want to revisit, including traffic, junctions, manoeuvres, and parking. The school can confirm an appropriate schedule and vehicle options.',
    'Test Preparation': 'Review your driving skills, practise manoeuvres, and prepare a checklist for your next step. Test requirements and any booking support must be confirmed by the school for your location.'
};
const dialog = document.querySelector('#course-dialog');
document.querySelectorAll('[data-course]').forEach(button => button.addEventListener('click', () => { const course = button.dataset.course; document.querySelector('#dialog-title').textContent = course; document.querySelector('#dialog-description').textContent = courseDescriptions[course]; document.querySelector('#course').value = course; dialog.showModal(); }));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-enquire').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
if (SCHOOL.email) { document.querySelector('#form-note').textContent = 'Prepare your enquiry, then open it in your email app. Nothing is sent automatically.'; document.querySelector('.contact-note').textContent = [SCHOOL.name, SCHOOL.phone, SCHOOL.address].filter(Boolean).join(' · '); }
document.querySelector('#enquiry').addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.currentTarget); const message = `Hello ${SCHOOL.name},\n\nI would like to enquire about ${data.get('course')}.\n\nName: ${String(data.get('name')).trim()}\nPhone: ${String(data.get('phone')).trim()}\n\n${String(data.get('message')).trim()}`; document.querySelector('#prepared-message').value = message; document.querySelector('#enquiry-result').hidden = false; document.querySelector('#copy-status').textContent = 'Your message is ready. It has not been sent.'; if (SCHOOL.email) { let link = document.querySelector('#email-enquiry'); if (!link) { link = document.createElement('a'); link.id = 'email-enquiry'; link.className = 'button purple'; link.textContent = 'Open email app ↗'; document.querySelector('#enquiry-result').append(link); } link.href = `mailto:${encodeURIComponent(SCHOOL.email)}?subject=${encodeURIComponent('Driving course enquiry')}&body=${encodeURIComponent(message)}`; } });
document.querySelector('#copy-message').addEventListener('click', async () => { const message = document.querySelector('#prepared-message'); try { await navigator.clipboard.writeText(message.value); document.querySelector('#copy-status').textContent = 'Copied. Paste this message into your preferred messaging app.'; } catch { message.focus(); message.select(); document.querySelector('#copy-status').textContent = 'Select the message and press Ctrl+C (or touch and hold to copy).'; } });
/* ===== SECTION ANIMATIONS & LIGHTING ===== */
(() => {
    const motionPreference = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    const header = document.querySelector('header');

    function updateHeader() {
        header?.classList.toggle(
            'is-scrolled',
            window.scrollY > 30
        );
    }

    window.addEventListener('scroll', updateHeader, {
        passive: true
    });

    updateHeader();

    /* Entrance animation for individual section elements */
    const elements = document.querySelectorAll(`
    .about-visual,
    .about-content,
    .section-heading,
    .course,
    .why-copy,
    .journey article,
    .destination,
    .faq-section > div:first-child,
    .faqs details,
    .contact > div,
    #enquiry
  `);

    let revealObserver;

    if (
        !motionPreference.matches &&
        'IntersectionObserver' in window
    ) {
        revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08
            }
        );

        elements.forEach(element => {
            /* Stagger only neighbouring course cards */
            if (element.matches('.course')) {
                const cards = [
                    ...element.parentElement.children
                ];

                element.style.setProperty(
                    '--reveal-delay',
                    `${cards.indexOf(element) * 100}ms`
                );
            }

            element.classList.add('reveal-pending');
            revealObserver.observe(element);
        });
    }

    /* Cursor-following light on desktop cards */
    const finePointer = window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    );

    document.querySelectorAll('.course').forEach(card => {
        card.addEventListener('pointermove', event => {
            if (
                motionPreference.matches ||
                !finePointer.matches
            ) {
                return;
            }

            const bounds = card.getBoundingClientRect();

            card.style.setProperty(
                '--light-x',
                `${event.clientX - bounds.left}px`
            );

            card.style.setProperty(
                '--light-y',
                `${event.clientY - bounds.top}px`
            );
        });
    });

    /* Highlight the section currently being viewed */
    const navLinks = [
        ...document.querySelectorAll(
            '#navigation > a[href^="#"]:not(.button)'
        )
    ];

    const linkedSections = navLinks
        .map(link => {
            const id = link.getAttribute('href').slice(1);
            return document.getElementById(id);
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    navLinks.forEach(link => {
                        const active =
                            link.getAttribute('href') ===
                            `#${entry.target.id}`;

                        link.classList.toggle('active', active);

                        if (active) {
                            link.setAttribute(
                                'aria-current',
                                'location'
                            );
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                });
            },
            {
                rootMargin: '-15% 0px -65% 0px',
                threshold: 0
            }
        );

        linkedSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /* Immediately reveal content if reduced motion is enabled */
    motionPreference.addEventListener('change', event => {
        if (!event.matches) return;

        revealObserver?.disconnect();

        elements.forEach(element => {
            element.classList.remove('reveal-pending');
        });
    });
})();
/* Reveal Why Choose Us points: 01 → 02 → 03 */
(() => {
    const journey = document.querySelector('#why-us .journey');

    if (
        !journey ||
        !('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        return;
    }

    const steps = journey.querySelectorAll(':scope > article');

    steps.forEach((step, index) => {
        step.style.setProperty(
            '--step-delay',
            `${index * 650}ms`
        );
    });

    journey.classList.add('steps-ready');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            journey.classList.add('steps-visible');
            observer.disconnect();
        });
    }, {
        threshold: 0,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(journey);
})();
/* Automatic hero background images */
(() => {
    const hero = document.querySelector('#home');

    if (!hero || hero.querySelector('.hero-bg-slides')) return;

    const images = [
        'assets/hero1.jpg',
        'assets/leaner-car.png',
        'assets/driving-3.jpg'
    ];

    const container = document.createElement('div');
    container.className = 'hero-bg-slides';
    container.setAttribute('aria-hidden', 'true');

    const overlay = document.createElement('div');
    overlay.className = 'hero-bg-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    hero.prepend(container, overlay);

    const slides = [];
    const motion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    let current = 0;
    let timer;

    function stopSlideshow() {
        clearInterval(timer);
        timer = undefined;
    }

    function startSlideshow() {
        stopSlideshow();

        if (
            slides.length < 2 ||
            motion.matches ||
            document.hidden
        ) {
            return;
        }

        timer = setInterval(() => {
            slides[current].classList.remove('is-active');

            current = (current + 1) % slides.length;

            slides[current].classList.add('is-active');
        }, 5000);
    }

    async function initialise() {
        /* Skip missing images without interrupting the slideshow */
        const loaded = await Promise.all(
            images.map(src => new Promise(resolve => {
                const image = new Image();

                image.onload = () => resolve(src);
                image.onerror = () => resolve(null);

                image.src = src;
            }))
        );

        loaded.filter(Boolean).forEach((src, index) => {
            const slide = document.createElement('div');

            slide.className = 'hero-bg-slide';
            slide.style.backgroundImage = `url("${src}")`;

            if (index === 0) {
                slide.classList.add('is-active');
            }

            container.append(slide);
            slides.push(slide);
        });

        startSlideshow();
    }

    document.addEventListener(
        'visibilitychange',
        startSlideshow
    );

    motion.addEventListener('change', startSlideshow);

    initialise();
})();
/* Why Choose Us: photo reveal and sequential benefits */
(() => {
    const section = document.querySelector(
        '#why-us.THULASI-why'
    );

    if (!section) return;

    const feature = section.querySelector('.tw-feature');
    const toggle = section.querySelector('.tw-photo-toggle');
    const label = toggle?.querySelector('.tw-toggle-label');

    toggle?.addEventListener('click', () => {
        const visible = feature.classList.toggle(
            'is-photo-visible'
        );

        toggle.setAttribute('aria-pressed', String(visible));

        label.textContent = visible
            ? 'Photo pinned · tap to unpin'
            : 'Show photo';
    });

    /* Benefits appear in order: 01 → 02 → 03 */
    const grid = section.querySelector('.tw-grid');
    const cards = section.querySelectorAll('.tw-benefit');
    const motion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    if (
        motion.matches ||
        !('IntersectionObserver' in window)
    ) {
        return;
    }

    cards.forEach((card, index) => {
        card.style.setProperty(
            '--tw-delay',
            `${index * 450}ms`
        );
    });

    grid.classList.add('tw-benefits-ready');

    const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) {
            return;
        }

        grid.classList.add('tw-benefits-visible');
        observer.disconnect();
    }, {
        threshold: 0,
        rootMargin: '0px 0px -60px 0px'
    });

    observer.observe(grid);

    motion.addEventListener('change', event => {
        if (!event.matches) return;

        observer.disconnect();
        grid.classList.remove('tw-benefits-ready');
    });
})();
const footerYear = document.querySelector('#footer-year');

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}
(() => {
    const home = document.querySelector('#home');
    const panel = home?.querySelector('.home-driving-features');

    if (!home || !panel) return;

    panel.id = 'home-driving-panel';

    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'home-highlights-toggle';
    button.textContent = 'Driving highlights ↑';
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-expanded', 'false');

    home.append(button);

    button.addEventListener('click', () => {
        const open = home.classList.toggle('features-open');

        button.setAttribute('aria-expanded', String(open));
        button.textContent = open
            ? 'Close highlights ↓'
            : 'Driving highlights ↑';
    });

    document.addEventListener('click', event => {
        if (home.contains(event.target)) return;

        home.classList.remove('features-open');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Driving highlights ↑';
    });
})();