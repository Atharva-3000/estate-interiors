/* ============================================================
   Estate Lookup Interiors — script.js v2
   Mobile nav · GSAP animations · 3D hover · Form · Filters
   ============================================================ */

'use strict';

/* ─── Utilities ─────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const isTouch = () => window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Mobile Navigation ─────────────────────────────────────── */
(function initNav() {
  const toggle = qs('#menuToggle');
  const nav    = qs('#siteNav');
  if (!toggle || !nav) return;

  function closeNav() {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function openNav() {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });

  // Close nav when any link is clicked
  qsa('a', nav).forEach(link => link.addEventListener('click', closeNav));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  // Close on backdrop click (outside nav)
  document.addEventListener('click', e => {
    if (nav.classList.contains('is-open') &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeNav();
    }
  });
})();

/* ─── Sticky Header Scroll Shadow ──────────────────────────── */
(function initHeaderScroll() {
  const header = qs('.site-header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
  );

  // Observe the topline bar as proxy for "scrolled past top"
  const topline = qs('.topline');
  if (topline) observer.observe(topline);
})();

/* ─── Active Nav Link Highlight ────────────────────────────── */
(function initActiveNav() {
  const path    = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = qsa('.site-nav a, .footer-nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop().split('#')[0] || 'index.html';
    if (linkPage === path && !href.includes('#')) {
      link.classList.add('active');
    }
  });
})();

/* ─── Contact Form (index.html) ─────────────────────────────── */
(function initContactForm() {
  const form = qs('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data    = new FormData(form);
    const name    = data.get('name')    || '';
    const phone   = data.get('phone')   || '';
    const type    = data.get('type')    || '';
    const message = data.get('message') || '';

    const text = [
      `Hello Estate Lookup Interiors,`,
      ``,
      `I'd like to discuss a project.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Project type: ${type}`,
      `Details: ${message}`
    ].join('\n');

    window.open(
      `https://wa.me/918697458440?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  });
})();

/* ─── Contact Page Form (contact.html) ─────────────────────── */
(function initContactPageForm() {
  const form = qs('#contactPageForm');
  if (!form) return;

  // Pre-fill service from URL param
  const params  = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (service) {
    const sel = qs('#cpTypeSelect');
    if (sel) {
      const opt = [...sel.options].find(o =>
        o.value.toLowerCase().includes(service.toLowerCase())
      );
      if (opt) sel.value = opt.value;
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data    = new FormData(form);
    const name    = data.get('name')    || '';
    const phone   = data.get('phone')   || '';
    const email   = data.get('email')   || '';
    const type    = data.get('type')    || '';
    const city    = data.get('city')    || '';
    const budget  = data.get('budget')  || '';
    const message = data.get('message') || '';

    const lines = [
      `Hello Estate Lookup Interiors,`,
      ``,
      `I'd like to discuss a project.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
    ];
    if (email)   lines.push(`Email: ${email}`);
    if (type)    lines.push(`Service: ${type}`);
    if (city)    lines.push(`Location: ${city}`);
    if (budget)  lines.push(`Budget: ${budget}`);
    if (message) lines.push(`\nDetails:\n${message}`);

    // Show success state briefly
    const successEl = qs('#formSuccess');
    if (successEl) {
      successEl.classList.add('visible');
      setTimeout(() => successEl.classList.remove('visible'), 5000);
    }

    window.open(
      `https://wa.me/918697458440?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
      'noopener,noreferrer'
    );
  });
})();

/* ─── Work Page Filter ──────────────────────────────────────── */
(function initWorkFilter() {
  const filterBtns = qsa('.filter-btn');
  const projects   = qsa('.project-full');
  if (!filterBtns.length || !projects.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projects.forEach(proj => {
        const cat = proj.dataset.category || '';
        const show = filter === 'all' || cat === filter;

        if (prefersReducedMotion()) {
          proj.style.display = show ? '' : 'none';
          return;
        }

        if (show) {
          proj.style.display = '';
          gsap?.fromTo(proj,
            { opacity: 0, y: 20, scale: .97 },
            { opacity: 1, y: 0,  scale: 1, duration: .45, ease: 'power2.out' }
          );
        } else {
          gsap?.to(proj, {
            opacity: 0, y: -10, scale: .97, duration: .3, ease: 'power2.in',
            onComplete: () => { proj.style.display = 'none'; }
          });
        }
      });
    });
  });
})();

/* ─── GSAP Animations ───────────────────────────────────────── */
(function initGSAP() {
  if (typeof gsap === 'undefined' || prefersReducedMotion()) return;

  gsap.registerPlugin(ScrollTrigger);

  /* — Hero entrance — */
  const heroCopy = qsa('.hero-copy > *');
  if (heroCopy.length) {
    gsap.set(heroCopy, { y: 48, opacity: 0 });
    gsap.set('.hero-image-main', { y: 80, opacity: 0, scale: .96 });
    gsap.set('.hero-image-small', { y: 60, opacity: 0, scale: .96 });
    gsap.set('.hero-note', { x: -28, opacity: 0 });
    gsap.set('.hero-stamp', { scale: 0, opacity: 0, rotation: -30 });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });
    heroTl
      .to(heroCopy, { y: 0, opacity: 1, stagger: .09, duration: 1.1 })
      .to('.hero-image-main',  { y: 0, opacity: 1, scale: 1 },                '-=1')
      .to('.hero-image-small', { y: 0, opacity: 1, scale: 1 },                '-=.9')
      .to('.hero-note',  { x: 0, opacity: 1 },                                '-=.7')
      .to('.hero-stamp', { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(1.6)' }, '-=.6');
  }

  /* — Hero parallax — */
  if (qs('.hero-image-main')) {
    gsap.to('.hero-image-main', {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.hero-image-small', {
      yPercent: -18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }

  /* — Scroll-reveal: [data-anim] elements — */
  qsa('[data-anim]').forEach((el, i) => {
    // Don't re-animate hero elements
    if (el.closest('.hero')) return;

    gsap.fromTo(el,
      { y: 36, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: .85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  /* — Staggered grid children — */
  const grids = [
    '.statement-grid',
    '.work-grid',
    '.work-masonry',
    '.services-list',
    '.process-list',
    '.quote-grid',
    '.stats-strip',
    '.service-detail-grid',
    '.contact-info-grid',
    '.form-grid',
  ];

  grids.forEach(sel => {
    const parent = qs(sel);
    if (!parent) return;
    const children = qsa(':scope > *', parent);
    if (!children.length) return;

    gsap.fromTo(children,
      { y: 32, opacity: 0, scale: .98 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: .7,
        stagger: .08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 86%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  /* — Process step hover — */
  qsa('.process-step').forEach(step => {
    step.addEventListener('mouseenter', () => {
      if (isTouch()) return;
      gsap.to(step, { paddingLeft: 12, duration: .3, ease: 'power2.out' });
    });
    step.addEventListener('mouseleave', () => {
      gsap.to(step, { paddingLeft: 0, duration: .35, ease: 'power2.out' });
    });
  });

  /* — Page hero entrance — */
  const pageHero = qs('.page-hero');
  if (pageHero) {
    const els = qsa('[data-anim]', pageHero);
    gsap.set(els, { y: 32, opacity: 0 });
    gsap.to(els, { y: 0, opacity: 1, stagger: .1, duration: .9, ease: 'power3.out', delay: .1 });
  }
})();

/* ─── 3D Tilt Hover Effect ──────────────────────────────────── */
(function init3DTilt() {
  if (isTouch() || prefersReducedMotion()) return;

  const tiltEls = qsa('.project, .service-card, .statement-grid > div, .quote-card, .project-full');

  tiltEls.forEach(el => {
    el.style.transformStyle = 'preserve-3d';
    let rafId = null;

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'box-shadow .3s ease';
      el.style.zIndex = '10';

      const isFeatured = el.classList.contains('featured');
      el.style.boxShadow = isFeatured
        ? '0 28px 60px rgba(23,32,28,.32), 0 8px 20px rgba(23,32,28,.2)'
        : '0 24px 56px rgba(23,32,28,.11), 0 8px 20px rgba(23,32,28,.07)';
    });

    el.addEventListener('mousemove', e => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect   = el.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = e.clientX - cx;
        const dy     = e.clientY - cy;
        const rx     = -(dy / rect.height) * 10;
        const ry     =  (dx / rect.width)  * 10;

        el.style.transition = 'transform .08s linear';
        el.style.transform  =
          `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    });

    el.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transition = 'transform .55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow .45s ease';
      el.style.transform  = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      el.style.zIndex     = '';
      el.style.boxShadow  = '';
    });
  });
})();

/* ─── Button Ripple Effect ──────────────────────────────────── */
(function initRipple() {
  qsa('.button').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', e => {
      if (prefersReducedMotion()) return;

      const rect  = btn.getBoundingClientRect();
      const size  = Math.max(rect.width, rect.height) * 1.8;
      const x     = e.clientX - rect.left - size / 2;
      const y     = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      Object.assign(ripple.style, {
        position:     'absolute',
        borderRadius: '50%',
        width:        `${size}px`,
        height:       `${size}px`,
        left:         `${x}px`,
        top:          `${y}px`,
        background:   'rgba(255,255,255,.18)',
        transform:    'scale(0)',
        pointerEvents:'none',
        transition:   'transform .6s ease, opacity .5s ease',
        opacity:      '1',
      });

      btn.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity   = '0';
      });
      setTimeout(() => ripple.remove(), 700);
    });
  });
})();

/* ─── Smooth scroll offset for sticky header ─────────────────── */
(function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const header = qs('.site-header');
      const offset = header ? header.offsetHeight + 16 : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── Input focus floating label micro-animation ─────────────── */
(function initFormMicro() {
  qsa('.form-input, .form-textarea, .contact-form input, .contact-form textarea').forEach(el => {
    el.addEventListener('focus', () => {
      el.closest('label')?.classList.add('label-active');
    });
    el.addEventListener('blur', () => {
      if (!el.value) el.closest('label')?.classList.remove('label-active');
    });
  });
})();
