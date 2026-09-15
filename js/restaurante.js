/**
 * BINGEN PIZZA & BURGER - RESTAURANTE JAVASCRIPT
 * Smooth Scroll Lenis integration & FAQ Accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. LENIS SMOOTH SCROLL INITIALIZATION
     ========================================================================== */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for internal anchor links (e.g. #visita, #fogo-vivo, #faq-restaurante, etc.)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        try {
          const targetEl = document.querySelector(href);
          if (targetEl && lenis) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -20, duration: 1.0 });
          }
        } catch (err) {}
      });
    });
  }

  /* ==========================================================================
     2. FAQ ACCORDION INTERACTION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Fecha os demais itens para visualização limpa
        faqItems.forEach((otherItem) => {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Alterna o item clicado
        if (!isOpen) {
          item.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('open');
          questionBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
});
