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
    const img7 = memoriesSection.querySelector('.img-burrata');
    const img8 = memoriesSection.querySelector('.img-bar');
    const img9 = memoriesSection.querySelector('.img-dough');

    // Fatores de posição Y inicial para palavras (bem espaçadas, NÃO juntas no começo):
    const wordFactors = {
      t1: 0.16,
      t2: 0.65,
      t3: 1.20,
      t4: 1.76,
      t5: 2.28,
      t6: 2.80
    };

    // Fatores de posição Y inicial para fotos (encaixadas nos vãos entre palavras):
    // Vão 1 (entre t1 e t2): img1 (0.28H), img2 (0.40H)
    // Vão 2 (entre t2 e t3): img7 (0.78H), img8 (0.92H)
    // Vão 3 (entre t3 e t4): img3 (1.34H), img4 (1.48H)
    // Vão 4 (entre t4 e t5): img9 (1.90H)
    // Vão 5 (entre t5 e t6): img5 (2.40H), img6 (2.50H)
    const imgConfigs = [
      { el: img1, y: 0.28 },
      { el: img2, y: 0.40 },
      { el: img7, y: 0.78 },
      { el: img8, y: 0.92 },
      { el: img3, y: 1.34 },
      { el: img4, y: 1.48 },
      { el: img9, y: 1.90 },
      { el: img5, y: 2.40 },
      { el: img6, y: 2.50 }
    ].filter(cfg => cfg.el);

    // 1. Posições iniciais dos textos (bem separados)
    gsap.set(t1, { y: () => getH() * wordFactors.t1 });
    gsap.set(t2, { y: () => getH() * wordFactors.t2 });
    gsap.set(t3, { y: () => getH() * wordFactors.t3 });
    gsap.set(t4, { y: () => getH() * wordFactors.t4 });
    gsap.set(t5, { y: () => getH() * wordFactors.t5 });
    gsap.set(t6, { y: () => getH() * wordFactors.t6 });

    // 2. Posições iniciais das imagens nos vãos
    imgConfigs.forEach(cfg => {
      gsap.set(cfg.el, { y: () => getH() * cfg.y });
    });

    const memoriesTl = gsap.timeline({
      scrollTrigger: {
        trigger: memoriesSection,
        start: 'top top',
        end: () => (window.innerWidth < 768 ? '+=480' : '+=830'),
        pin: true,
        scrub: 0.6,
        anticipatePin: 0,
        invalidateOnRefresh: true
      }
    });

    // -------------------------------------------------------------
    // REGRA 1: ZERO PARALLAX ENTRE IMAGENS
    // Todas as imagens se movem juntas na mesma velocidade e tempo.
    // O parallax ocorre exclusivamente entre o conjunto de imagens e os textos.
    // -------------------------------------------------------------
    const allImages = imgConfigs.map(cfg => cfg.el);
    const imgTravelMultiplier = 2.10;

    memoriesTl.to(allImages, {
      y: (index) => getH() * (imgConfigs[index].y - imgTravelMultiplier),
      ease: 'none',
      duration: 100
    }, 0);

    // -------------------------------------------------------------
    // REGRA 2: PARALLAX ENTRE PALAVRAS E IMAGENS + CONVERGÊNCIA DAS PALAVRAS
    // As palavras iniciam bem espaçadas (não juntas no começo)
    // e deslizam pelos vãos, com OUTROS, CRIAM e MEMÓRIAS se juntando
    // harmonicamente no centro ao final da narrativa.
    // -------------------------------------------------------------

    // 1. "HÁ SABORES" (Inicia em 0.16H e sobe pelo topo)
    memoriesTl.to(t1, { 
      y: () => -getH() * 0.40, 
      ease: 'none', 
      duration: 32 
    }, 0);

    // 2. "QUE" (Inicia em 0.65H e sobe pelo centro)
    memoriesTl.to(t2, { 
      y: () => -getH() * 0.40, 
      ease: 'none', 
      duration: 48 
    }, 0);

    // 3. "ALIMENTAM" (Inicia em 1.20H e sobe pelo centro)
    memoriesTl.to(t3, { 
      y: () => -getH() * 0.40, 
      ease: 'none', 
      duration: 64 
    }, 0);

    // 4. "OUTROS" (Inicia em 1.76H e ancora no terço superior em 0.28H)
    memoriesTl.to(t4, { 
      y: () => getH() * 0.28, 
      ease: 'power1.out', 
      duration: 82 
    }, 0);

    // 5. "CRIAM" (Inicia em 2.28H e se junta logo abaixo de OUTROS em 0.44H)
    memoriesTl.to(t5, { 
      y: () => getH() * 0.44, 
      ease: 'power1.out', 
      duration: 82 
    }, 0);

    // 6. "MEMÓRIAS" (Inicia em 2.80H e se junta logo abaixo de CRIAM em 0.60H)
    memoriesTl.to(t6, { 
      y: () => getH() * 0.60, 
      ease: 'power1.out', 
      duration: 82 
    }, 0);
  }

});



