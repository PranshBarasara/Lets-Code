import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP scrolltrigger with Lenis scroll
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Loading Screen Animation Lifecycle
  const loaderBar = document.querySelector('.loader-bar');
  const loaderScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('smooth-wrapper');

  if (loaderBar && loaderScreen) {
    // Initial hidden state for content
    if (mainContent) mainContent.style.opacity = '0';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Hide loader screen
        setTimeout(() => {
          loaderScreen.classList.add('hidden');
          if (mainContent) {
            mainContent.style.opacity = '1';
            triggerEntranceAnimations();
          }
        }, 300);
      }
      loaderBar.style.width = `${progress}%`;
    }, 80);
  } else {
    // Fallback if loader elements are missing
    if (mainContent) mainContent.style.opacity = '1';
    triggerEntranceAnimations();
  }

  // 3. Entrance and Scroll-based animations
  function triggerEntranceAnimations() {
    // Hero Entrance Timelines
    const heroTl = gsap.timeline();
    heroTl.from('.floating-badge', { opacity: 0, y: -20, duration: 0.6, ease: 'power3.out' })
          .from('.hero-heading span', { opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: 'power4.out', delay: -0.2 })
          .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: -0.4 })
          .from('.hero-ctas .btn-primary-glow, .hero-ctas .btn-glass', { opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)', delay: -0.3 })
          .from('.hero-dashboard', { opacity: 0, scale: 0.95, rotationY: -20, duration: 1.2, ease: 'power4.out', delay: -0.8 });

    // Navbar Shrink & Glow on Scroll
    ScrollTrigger.create({
      start: 'top -50px',
      onEnter: () => document.getElementById('navbar')?.classList.add('scrolled'),
      onLeaveBack: () => document.getElementById('navbar')?.classList.remove('scrolled'),
    });

    // General Section Headers Fade-In
    document.querySelectorAll('.section-header').forEach((header) => {
      gsap.from(header.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
        },
      });
    });

    // Why Us Cards Cascade Fade-In
    gsap.from('.feature-glass-card', {
      opacity: 0,
      x: -40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#why-us',
        start: 'top 70%',
      },
    });

    // AI Career Tools Grid Entrance
    gsap.from('.tool-card', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.tools-grid',
        start: 'top 75%',
      },
    });

    // Developer Journey Timeline Drawing Line
    gsap.fromTo(
      '.timeline-progress',
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 30%',
          end: 'bottom 70%',
          scrub: true,
        },
      }
    );

    // Stagger timeline items fading and shifting in
    document.querySelectorAll('.timeline-item').forEach((item) => {
      gsap.from(item.querySelector('.timeline-content'), {
        opacity: 0,
        x: item.classList.contains('right') ? 40 : -40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
        },
      });
    });

    // Bento Grid Boxes Scaling-up Fade
    gsap.from('.bento-card', {
      opacity: 0,
      scale: 0.96,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 75%',
      },
    });

    // Communities Grid Cards Lift-In
    gsap.from('.community-card', {
      opacity: 0,
      y: 30,
      stagger: 0.05,
      duration: 0.6,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.communities-grid',
        start: 'top 80%',
      },
    });

    // Metrics Counter Count-Ups (Scroll-triggered count ups for non-hero metrics)
    document.querySelectorAll('section:not(#hero) .count-up').forEach((counter) => {
      const targetStr = counter.getAttribute('data-target');
      const suffix = targetStr.includes('+') ? '+' : '';
      const targetVal = parseFloat(targetStr.replace('+', ''));

      const obj = { val: 0 };
      gsap.to(obj, {
        val: targetVal,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          counter.textContent = Math.floor(obj.val).toLocaleString() + suffix;
        },
      });
    });

    // CTA Massive Typography Reveal & Glow Mouse Interaction
    gsap.from('.cta-title', {
      opacity: 0,
      scale: 0.9,
      y: 30,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '#cta',
        start: 'top 75%',
      },
    });
    
    // Magnetic effects for key CTAs (Apple & OpenAI style microinteractions)
    const magneticBtns = document.querySelectorAll('.btn-primary-glow, .btn-glass, .nav-logo');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const bound = btn.getBoundingClientRect();
        const x = e.clientX - bound.left - (bound.width / 2);
        const y = e.clientY - bound.top - (bound.height / 2);
        
        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1.1, 0.4)'
        });
      });
    });

    // Hover mouse track for luxury cards (dynamic borders glow overlay)
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      });
    });
  }
}
