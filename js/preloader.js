/**
 * BINGEN PIZZA & BURGER - 0-100% REAL PRELOADER
 * Accurately tracks actual asset loading (fonts, DOM images, page lifecycle)
 * Smoothly interpolates progress using requestAnimationFrame
 * Zero layout impact (fixed overlay with smooth fade-out and scroll unlock)
 */

(function () {
  'use strict';

  // Lock scroll immediately while preloader is active
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
    const statusEl = document.getElementById('preloader-status');

    let currentProgress = 0;
    let targetProgress = 0;
    let isFinished = false;
    let animationFrameId = null;

    // Status message thresholds
    function updateStatusText(p) {
      if (!statusEl) return;
      if (p < 25) {
        statusEl.textContent = 'Aquecendo o forno a lenha...';
      } else if (p < 55) {
        statusEl.textContent = 'Fermentando a massa artesanal...';
      } else if (p < 85) {
        statusEl.textContent = 'Selecionando os ingredientes...';
      } else if (p < 100) {
        statusEl.textContent = 'Finalizando os preparativos...';
      } else {
        statusEl.textContent = 'Pronto! Forno aquecido.';
      }
    }

    // Collect all elements to monitor
    const images = Array.from(document.images);
    const totalAssets = Math.max(1, images.length + 1); // +1 for document fonts
    let loadedAssets = 0;

    function onItemLoaded() {
      loadedAssets++;
      const computedTarget = Math.min(100, Math.floor((loadedAssets / totalAssets) * 100));
      if (computedTarget > targetProgress) {
        targetProgress = computedTarget;
      }
    }

    // Check fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onItemLoaded).catch(onItemLoaded);
    } else {
      onItemLoaded();
    }

    // Check images
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

    // Window load ensures external CSS & scripts are settled
    let windowLoaded = false;
    if (document.readyState === 'complete') {
      windowLoaded = true;
    } else {
      window.addEventListener('load', () => {
        windowLoaded = true;
        targetProgress = 100;
      }, { once: true });
    }

    // Smooth animation loop (lerp)
    function animate() {
      if (isFinished) return;

      const diff = targetProgress - currentProgress;
      // Smoothly advance toward targetProgress, with minimum increment to avoid freezing
      if (diff > 0) {
        currentProgress += Math.max(0.4, diff * 0.12);
        if (currentProgress > targetProgress) {
          currentProgress = targetProgress;
        }
      }

      const displayVal = Math.min(100, Math.round(currentProgress));

      if (counterEl) counterEl.textContent = displayVal;
      if (fillEl) fillEl.style.width = currentProgress + '%';
      updateStatusText(displayVal);

      // Finish condition
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
      if (statusEl) statusEl.textContent = 'Pronto! Forno aquecido.';

      // Brief delay at 100% for perceived completeness
      setTimeout(() => {
        preloader.classList.add('preloader-hidden');

        // Unlock page scrolling
        document.documentElement.classList.remove('preloader-locked');
        if (document.body) {
          document.body.classList.remove('preloader-locked');
        }

        // Notify plugins and recalculate layout measurements
        window.dispatchEvent(new Event('resize'));
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }

        // Completely hide after CSS transition ends
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 700);
      }, 250);
    }

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    // Hard fallback: never lock the user more than 3.2s under any network condition
    setTimeout(() => {
      if (!isFinished) {
        windowLoaded = true;
        targetProgress = 100;
      }
    }, 3200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
