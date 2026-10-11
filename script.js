const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  });
});

document.querySelector('#contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get('name') || '';
  const phone = data.get('phone') || '';
  const type = data.get('type') || '';
  const message = data.get('message') || '';
  const text = `Hello Estate Lookup Interiors,\n\nI'd like to discuss a project.\nName: ${name}\nPhone: ${phone}\nProject: ${type}\nDetails: ${message}`;
  window.open(`https://wa.me/918697458440?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});

// --- Antigravity GSAP Animations ---

if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Initial State Setup
  gsap.set(".hero-copy > *", { y: 40, opacity: 0 });
  gsap.set(".hero-image-main", { y: 80, opacity: 0, scale: 0.95 });
  gsap.set(".hero-image-small", { y: 60, opacity: 0, scale: 0.95 });
  gsap.set(".hero-note", { x: -30, opacity: 0 });
  gsap.set(".hero-stamp", { scale: 0, opacity: 0, rotation: -45 });

  // Hero Sequence
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } });
  heroTl.to(".hero-copy > *", { y: 0, opacity: 1, stagger: 0.1, duration: 1.2 })
        .to(".hero-image-main", { y: 0, opacity: 1, scale: 1 }, "-=1")
        .to(".hero-image-small", { y: 0, opacity: 1, scale: 1 }, "-=0.9")
        .to(".hero-note", { x: 0, opacity: 1 }, "-=0.8")
        .to(".hero-stamp", { scale: 1, opacity: 1, rotation: 0, ease: "back.out(1.7)" }, "-=0.6");

  // Parallax for Hero Images
  gsap.to(".hero-image-main", {
    yPercent: 12,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
  gsap.to(".hero-image-small", {
    yPercent: -15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Section Entrances (Y-axis float + slight rotation)
  gsap.utils.toArray('section').forEach(section => {
    if (section.classList.contains('hero')) return;
    
    gsap.fromTo(section, 
      { y: 60, opacity: 0, rotationX: 4 },
      { 
        y: 0, 
        opacity: 1, 
        rotationX: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Staggered Entrances for Grids (Statement, Work, Services, Process, Quotes)
  const gridSelectors = ['.statement-grid > div', '.work-grid > article', '.services-list > article', '.process-step', '.quote-grid > blockquote'];

  gridSelectors.forEach(selector => {
    const elements = gsap.utils.toArray(selector);
    if (elements.length > 0) {
      const parent = elements[0].parentElement;
      gsap.fromTo(elements, 
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: parent,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });
}

// --- 3D Isometric Hover Effect ---
// Applied to project cards and service cards to add "Antigravity" spatial depth
const hoverElements = document.querySelectorAll('.project, .service-card, .statement-grid > div');
hoverElements.forEach(el => {
  // Ensure the element supports 3D transforms
  el.style.transformStyle = "preserve-3d";
  
  el.addEventListener('mouseenter', () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    el.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease-out";
    el.style.zIndex = 10;
    
    if (!el.classList.contains('featured')) {
      el.style.boxShadow = "0 30px 60px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.08)";
    } else {
      el.style.boxShadow = "0 30px 60px rgba(23,32,28,0.3), 0 10px 20px rgba(23,32,28,0.2)";
    }
  });

  el.addEventListener('mousemove', (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = (-y / rect.height) * 12; 
    const rotateY = (x / rect.width) * 12;  
    
    el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
    el.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.zIndex = 1;
    el.style.boxShadow = "none";
  });
});

