/**
 * BINGEN PIZZA & BURGER - JAVASCRIPT
 * Strictly vanilla ES6.
 * Instant interactions only.
 * No animation libraries, no transitions, no scroll triggers.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. NAVIGATION TABS
     ========================================================================== */
  // Sem classes active persistentes que façam abas parecerem selecionadas


  /* ==========================================================================
     2. FAQ ACCORDION (INSTANT TOGGLE)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items for clean single-accordion presentation
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked item
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


  /* ==========================================================================
     3. TESTIMONIAL CAROUSEL (INSTANT SWAP)
     ========================================================================== */
  const testimonials = [
    {
      stars: '★★★★★',
      quote: 'Com o crescimento da demanda, Sei resolveu se estabelecer num pequeno espaço no Catete, onde, em 2014, abriu a primeira unidade do Ferro e Farinha, uma casa',
      author: 'Marcelo & Renata Albuquerque, Clientes Frequentes'
    },
    {
      stars: '★★★★★',
      quote: 'A melhor pizza napolitana que já comi no Brasil. A massa é extremamente leve, a borda aerada é inacreditável e os burgers artesanais têm um blend de costela surreal.',
      author: 'Guilherme Siqueira, Crítico Gastronômico'
    },
    {
      stars: '★★★★★',
      quote: 'O ambiente industrial e o cheiro do forno a lenha criam uma atmosfera única em Petrópolis. O atendimento é ágil e o delivery chega sempre muito quente e crocante.',
      author: 'Camila Mendonça, Moradora do Bingen'
    }
  ];

  let currentTestimonialIndex = 0;

  const quoteEl = document.getElementById('testimonial-quote-text');
  const authorEl = document.getElementById('testimonial-author-name');
  const starsEl = document.querySelector('.testimonial-stars');
  const btnPrev = document.getElementById('btn-testimonial-prev');
  const btnNext = document.getElementById('btn-testimonial-next');
  const indicatorDots = document.querySelectorAll('.indicator-dot');

  function renderTestimonial(index) {
    if (!quoteEl || !authorEl || !testimonials[index]) return;

    const data = testimonials[index];
    quoteEl.textContent = data.quote;
    authorEl.innerHTML = `&mdash; ${data.author}`;
    if (starsEl) {
      starsEl.textContent = data.stars;
    }

    // Update indicator dots
    indicatorDots.forEach((dot, dotIdx) => {
      if (dotIdx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });

    btnNext.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });
  }

  /* ==========================================================================
     4. GSAP SMOOTH SCROLL (LENIS + SCROLLTRIGGER + GSAP TICKER)
     ========================================================================== */
  if (window.gsap) {
    if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  }

  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else if (window.gsap) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -40, duration: 1.1 });
        } else if (window.gsap && window.ScrollToPlugin) {
          gsap.to(window, {
            duration: 0.9,
            scrollTo: { y: targetEl, offsetY: 40, autoKill: false },
            ease: 'power2.out'
          });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });


  /* ==========================================================================
     5. "HÁ SABORES QUE ALIMENTAM MEMÓRIAS"
     100vh Pinned Fake-Scroll com GSAP ScrollTrigger & Parallax Cinético Contínuo
     - Primeira palavra ("HÁ SABORES") e imagens iniciais JÁ COMEÇAM na tela para não haver vazio estranho
     - Palavras no meio da tela, centralizadas
     - Imagens com parallax mais rápidas que os textos
     - Movimento contínuo e suave: sem parar no topo para esperar a hora de sair
     - A saída é consequência fluida da velocidade natural em que sobem
     - ZERO transição por opacidade (100% físicas por movimento Y)
     - Relação contínua de quantidade: fotos presentes até o encerramento junto com as palavras
     ========================================================================== */
  const memoriesSection = document.getElementById('memorias');
  if (memoriesSection && window.gsap && window.ScrollTrigger) {
    const textItems = memoriesSection.querySelectorAll('.text-item');
    const imageItems = memoriesSection.querySelectorAll('.image-item');

    // 100% Sólidos desde o início - NENHUMA transição por opacidade!
    gsap.set(textItems, { opacity: 1, visibility: 'visible' });
    gsap.set(imageItems, { opacity: 1, visibility: 'visible' });

    const getH = () => window.innerHeight || document.documentElement.clientHeight;

    const t1 = memoriesSection.querySelector('.text-ha-sabores');
    const t2 = memoriesSection.querySelector('.text-que');
    const t3 = memoriesSection.querySelector('.text-alimentam');
    const t4 = memoriesSection.querySelector('.text-outros');
    const t5 = memoriesSection.querySelector('.text-criam');
    const t6 = memoriesSection.querySelector('.text-memorias');

    const img1 = memoriesSection.querySelector('.img-family');
    const img2 = memoriesSection.querySelector('.img-burger-close');
    const img3 = memoriesSection.querySelector('.img-ingredients');
    const img4 = memoriesSection.querySelector('.img-burger-beer');
    const img5 = memoriesSection.querySelector('.img-wood-oven');
    const img6 = memoriesSection.querySelector('.img-restaurant');

    // 1. POSIÇÃO INICIAL: A PRIMEIRA FRASE ("HÁ SABORES QUE ALIMENTAM") JÁ ESTÁ NA TELA!
    // Espaçamento vertical harmonioso e compacto (sem abismos vazios)
    gsap.set(t1, { y: () => getH() * 0.16 });
    gsap.set(t2, { y: () => getH() * 0.32 });
    gsap.set(t3, { y: () => getH() * 0.48 });

    // Primeiras imagens laterais já no viewport
    gsap.set(img1, { y: () => getH() * 0.15 });
    gsap.set(img2, { y: () => getH() * 0.32 });

    // Segunda frase ("OUTROS CRIAM MEMÓRIAS") e imagens seguintes entram suavemente logo abaixo
    gsap.set([t4, t5, t6], { y: () => getH() * 1.05 });
    gsap.set([img3, img4, img5, img6], { y: () => getH() * 1.05 });

    const memoriesTl = gsap.timeline({
      scrollTrigger: {
        trigger: memoriesSection,
        start: 'top top',
        end: () => (window.innerWidth < 768 ? '+=700' : '+=1100'),
        pin: true,
        scrub: 0.5,
        anticipatePin: 0,
        invalidateOnRefresh: true
      }
    });

    // -------------------------------------------------------------
    // CHOREOGRAFIA DOS TEXTOS EM GRUPOS COESOS (SEM VAZIOS)
    // -------------------------------------------------------------

    // Grupo 1: "HÁ SABORES QUE ALIMENTAM" sobem juntos suavemente
    memoriesTl.to(t1, { y: () => -getH() * 0.5, ease: 'none', duration: 18 }, 0);
    memoriesTl.to(t2, { y: () => -getH() * 0.5, ease: 'none', duration: 18 }, 2);
    memoriesTl.to(t3, { y: () => -getH() * 0.5, ease: 'none', duration: 18 }, 4);

    // Grupo 2: "OUTROS CRIAM MEMÓRIAS" entram coesos e ancoram com espaçamento perfeito
    memoriesTl.fromTo(t4, 
      { y: () => getH() * 1.05 }, 
      { y: () => getH() * 0.18, ease: 'power1.out', duration: 20 }, 
      10
    );

    memoriesTl.fromTo(t5, 
      { y: () => getH() * 1.05 }, 
      { y: () => getH() * 0.34, ease: 'power1.out', duration: 20 }, 
      12
    );

    memoriesTl.fromTo(t6, 
      { y: () => getH() * 1.05 }, 
      { y: () => getH() * 0.50, ease: 'power1.out', duration: 20 }, 
      14
    );

    // -------------------------------------------------------------
    // CHOREOGRAFIA DAS IMAGENS LATERAIS (FLANCOS)
    // -------------------------------------------------------------

    // Imagens do primeiro grupo sobem
    memoriesTl.to(img1, { y: () => -getH() - 100, ease: 'none', duration: 18 }, 0);
    memoriesTl.to(img2, { y: () => -getH() - 100, ease: 'none', duration: 20 }, 0);

    // Imagens intermediárias
    memoriesTl.fromTo(img3, { y: () => getH() * 1.05 }, { y: () => -getH() - 80, ease: 'none', duration: 22 }, 8);
    memoriesTl.fromTo(img4, { y: () => getH() * 1.05 }, { y: () => -getH() - 80, ease: 'none', duration: 22 }, 10);

    // Imagens finais se acomodam com a frase final
    memoriesTl.fromTo(img5, { y: () => getH() * 1.05 }, { y: () => getH() * 0.26, ease: 'power1.out', duration: 20 }, 14);
    memoriesTl.fromTo(img6, { y: () => getH() * 1.05 }, { y: () => getH() * 0.34, ease: 'power1.out', duration: 20 }, 16);
  }

});



