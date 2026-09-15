/**
 * BINGEN PIZZA & BURGER - LOADER 0-100 REAL & FUNCIONAL
 * Monitora fontes, imagens do DOM e carregamento da página.
 * Atualiza suavemente o número de 0 a 100 de forma precisa e limpa.
 */

(function () {
  'use strict';

  // Bloqueia scroll enquanto o loader estiver na tela
  document.documentElement.classList.add('preloader-locked');
  if (document.body) {
    document.body.classList.add('preloader-locked');
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('preloader-locked');
    });
  }

  function initPreloader() {
    const preloader = document.getElementById('site-preloader');
    if (!preloader) return;

    const counterEl = document.getElementById('preloader-counter');
    const fillEl = document.getElementById('preloader-fill');

    let currentProgress = 0;
    let targetProgress = 0;
    let isFinished = false;
    let animationFrameId = null;

    // Coleta recursos críticos da página
    const images = Array.from(document.images);
    const totalAssets = Math.max(1, images.length + 1); // +1 para as fontes
    let loadedAssets = 0;

    function onItemLoaded() {
      loadedAssets++;
      const computedTarget = Math.min(100, Math.floor((loadedAssets / totalAssets) * 100));
      if (computedTarget > targetProgress) {
        targetProgress = computedTarget;
      }
    }

    // Monitora fontes
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onItemLoaded).catch(onItemLoaded);
    } else {
      onItemLoaded();
    }

    // Monitora imagens
    if (images.length === 0) {
      targetProgress = 100;
    } else {
      images.forEach((img) => {
        if (img.complete && img.naturalWidth !== 0) {
          onItemLoaded();
        } else {
          img.addEventListener('load', onItemLoaded, { once: true });
          img.addEventListener('error', onItemLoaded, { once: true });
        }
      });
    }

    // Monitora evento load da janela
    let windowLoaded = false;
    if (document.readyState === 'complete') {
      windowLoaded = true;
    } else {
      window.addEventListener('load', () => {
        windowLoaded = true;
        targetProgress = 100;
      }, { once: true });
    }

    // Interpolação fluida do contador (0 a 100)
    function animate() {
      if (isFinished) return;

      const diff = targetProgress - currentProgress;
      if (diff > 0) {
        currentProgress += Math.max(0.6, diff * 0.15);
        if (currentProgress > targetProgress) {
          currentProgress = targetProgress;
        }
      }

      const displayVal = Math.min(100, Math.round(currentProgress));

      if (counterEl) counterEl.textContent = displayVal;
      if (fillEl) fillEl.style.width = currentProgress + '%';

      if (currentProgress >= 100 && (windowLoaded || targetProgress >= 100)) {
        finishPreloader();
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    function finishPreloader() {
      if (isFinished) return;
      isFinished = true;

      if (counterEl) counterEl.textContent = '100';
      if (fillEl) fillEl.style.width = '100%';

      setTimeout(() => {
        preloader.classList.add('preloader-hidden');

        document.documentElement.classList.remove('preloader-locked');
        if (document.body) {
          document.body.classList.remove('preloader-locked');
        }

        window.dispatchEvent(new Event('resize'));
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }

        setTimeout(() => {
          preloader.style.display = 'none';
        }, 400);
      }, 150);
    }

    animationFrameId = requestAnimationFrame(animate);

    // Limite de segurança: no máximo 2.8s
    setTimeout(() => {
      if (!isFinished) {
        windowLoaded = true;
        targetProgress = 100;
      }
    }, 2800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
