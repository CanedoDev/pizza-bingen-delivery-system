/**
 * BINGEN PIZZA & BURGER - CURSOR INTERATIVO ÚNICO (BOLINHA)
 * 1. Apenas UMA bolinha (sem bola duplicada ou pontinho solto acima e à esquerda).
 * 2. Em repouso: bolinha pequena sólida teal (sem neon).
 * 3. Ao hovear botões, cards ou o menu (quadrados da home): a bolinha pequena vira maior.
 * 4. O mouse fica sempre perfeitamente centralizado na bolinha.
 * 5. A palavra dentro é SEMPRE uma AÇÃO ("PEDIR", "VER", "VISITAR", "ANTERIOR", "PRÓXIMO", "EXPANDIR", "ESCONDER").
 * 6. Direção da seta ajustada: para a esquerda (‹) em ANTERIOR, VOLTAR e ESCONDER; para a direita (›) nas demais.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Apenas ativa em telas com mouse / ponteiro fino
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // Remove elementos legados se existirem
  const oldDot = document.getElementById('custom-cursor-dot');
  if (oldDot) oldDot.remove();
  const oldFollower = document.getElementById('custom-cursor-follower');
  if (oldFollower) oldFollower.remove();

  // Cria o cursor único
  let cursor = document.getElementById('custom-cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `
      <div class="cursor-content">
        <span class="cursor-action-text" id="cursor-action-text"></span>
        <span class="cursor-action-chevron" id="cursor-action-chevron">›</span>
      </div>
    `;
    document.body.appendChild(cursor);
  }

  const actionTextEl = document.getElementById('cursor-action-text');
  const actionChevronEl = document.getElementById('cursor-action-chevron');

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isVisible = false;

  // Rastreamento das coordenadas com delay elástico (lerp) via requestAnimationFrame
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursorX = mouseX;
      cursorY = mouseY;
      cursor.style.opacity = '1';
    }
  });

  function renderCursorLoop() {
    if (isVisible) {
      // Delay suave no movimento para não ficar grudado ao mover o mouse
      const ease = 0.20;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(renderCursorLoop);
  }
  requestAnimationFrame(renderCursorLoop);

  window.addEventListener('mouseleave', () => {
    isVisible = false;
    cursor.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    isVisible = true;
    cursor.style.opacity = '1';
  });

  // Determina a ação textual e a direção da seta baseada no elemento focado
  function getActionForElement(target) {
    if (!target) return null;

    // 0. O botão flutuante de delivery não possui balão na bolinha do mouse
    if (target.closest('.floating-delivery-btn')) {
      return null;
    }

    // 1. Carrossel de Avaliações: Anterior (seta ‹) e Próximo (seta ›)
    if (target.closest('#btn-testimonial-prev, .carousel-nav-btn.btn-prev')) {
      return { text: 'ANTERIOR', chevron: '‹' };
    }
    if (target.closest('#btn-testimonial-next, .carousel-nav-btn.btn-next')) {
      return { text: 'PRÓXIMO', chevron: '›' };
    }

    // 2. Acordeão do FAQ: no expandido escreve "ESCONDER" (seta ‹); no fechado "EXPANDIR" (seta ›)
    const faqItem = target.closest('.faq-accordion-item');
    const faqBtn = target.closest('.faq-question-btn');
    if (faqItem || faqBtn) {
      const parent = faqItem || faqBtn.closest('.faq-accordion-item');
      const isExpanded = parent?.classList.contains('open') || faqBtn?.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        return { text: 'ESCONDER', chevron: '‹' };
      }
      return { text: 'EXPANDIR', chevron: '›' };
    }

    // 3. Botão de Voltar ao Início (seta ‹)
    if (target.closest('.btn-back-clean, .btn-header-home, a[href="index.html"]')) {
      return { text: 'VOLTAR', chevron: '‹' };
    }

    // 4. Botão do WhatsApp no FAQ: "ENVIAR MENSAGEM"
    if (target.closest('#btn-faq-whatsapp, .faq-whatsapp-card a')) {
      return { text: 'ENVIAR MENSAGEM', chevron: '›' };
    }

    // 5. Imagens e cards da Seção de Delivery / Visita
    if (target.closest('.left-half, #btn-delivery-whatsapp')) {
      return { text: 'PEDIR', chevron: '›' };
    }
    if (target.closest('.right-half, #btn-visit-location')) {
      return { text: 'VISITAR', chevron: '›' };
    }

    // 6. Menu abaixo da Hero na Home (os 4 quadrados)
    const navTab = target.closest('.nav-tab-item');
    if (navTab) {
      if (navTab.classList.contains('tab-delivery') || navTab.id === 'tab-delivery-btn') return { text: 'PEDIR', chevron: '›' };
      if (navTab.classList.contains('tab-restaurante') || navTab.id === 'tab-restaurante-btn') return { text: 'VISITAR', chevron: '›' };
      return { text: 'VER', chevron: '›' };
    }

    // 7. Cards de Pizza e Combos na Home
    if (target.closest('.food-card, .combo-card')) {
      return { text: 'PEDIR', chevron: '›' };
    }

    // 8. Cards do Cardápio
    if (target.closest('.tripletta-card')) {
      return { text: 'PEDIR', chevron: '›' };
    }

    // 9. Botões de Pedido / Delivery / Carrinho
    if (target.closest('.btn-delivery-whatsapp, .btn-card-order, .btn-meio-meio-action, #header-cart-btn, #btn-dispatch-whatsapp, .btn-solid-teal')) {
      return { text: 'PEDIR', chevron: '›' };
    }

    // 10. Galeria de Fotos e Espaço
    if (target.closest('.gallery-photo-card, .gallery-card, .restaurant-photo-card, .mural-photo-item')) {
      return { text: 'VER', chevron: '›' };
    }

    // 11. Botões / Links de Visita e Reservas
    if (target.closest('#btn-visit-location, a[href*="restaurante"], a[href="#welcome"], a[href*="wa.me"]')) {
      const text = (target.closest('a, button')?.innerText || '').toLowerCase();
      if (text.includes('reservar') || text.includes('mesa') || text.includes('visitar')) {
        return { text: 'VISITAR', chevron: '›' };
      }
      return { text: 'PEDIR', chevron: '›' };
    }

    // 12. Qualquer outro link, botão, input ou elemento clicável
    const clickable = target.closest('a, button, input, select, textarea, .category-tab-btn, [role="button"], .filter-pill');
    if (clickable) {
      const text = (clickable.innerText || clickable.getAttribute('aria-label') || clickable.getAttribute('title') || '').toLowerCase();
      const href = (clickable.getAttribute('href') || '').toLowerCase();

      if (text.includes('anterior') || clickable.classList.contains('btn-prev')) {
        return { text: 'ANTERIOR', chevron: '‹' };
      }
      if (text.includes('próximo') || text.includes('proximo') || clickable.classList.contains('btn-next')) {
        return { text: 'PRÓXIMO', chevron: '›' };
      }
      if (text.includes('voltar') || text.includes('início') || text.includes('inicio') || href === 'index.html') {
        return { text: 'VOLTAR', chevron: '‹' };
      }
      if (text.includes('esconder')) {
        return { text: 'ESCONDER', chevron: '‹' };
      }
      if (text.includes('expandir') || text.includes('faq')) {
        return { text: 'EXPANDIR', chevron: '›' };
      }
      if (text.includes('pedir') || text.includes('delivery') || text.includes('carrinho') || href.includes('cardapio') || href.includes('wa.me')) {
        return { text: 'PEDIR', chevron: '›' };
      }
      if (text.includes('visitar') || text.includes('restaurante') || text.includes('mesa') || text.includes('reservar')) {
        return { text: 'VISITAR', chevron: '›' };
      }
      return { text: 'VER', chevron: '›' };
    }

    return null;
  }

  function updateCursorContent(action) {
    if (action) {
      cursor.classList.add('cursor-expanded');
      if (actionTextEl) actionTextEl.textContent = action.text;
      if (actionChevronEl) actionChevronEl.textContent = action.chevron || '›';
    } else {
      cursor.classList.remove('cursor-expanded');
      if (actionTextEl) actionTextEl.textContent = '';
    }
  }

  // Delegação de Hover para transformar a bolinha pequena em maior
  document.addEventListener('mouseover', (e) => {
    const action = getActionForElement(e.target);
    updateCursorContent(action);
  });

  document.addEventListener('mouseout', (e) => {
    const related = e.relatedTarget;
    if (!related || !getActionForElement(related)) {
      updateCursorContent(null);
    }
  });

  // Reavaliação imediata ao clicar (ex: abrir/fechar acordeão FAQ atualiza instantaneamente para ESCONDER/EXPANDIR)
  document.addEventListener('click', (e) => {
    setTimeout(() => {
      const action = getActionForElement(e.target);
      if (action) {
        updateCursorContent(action);
      }
    }, 40);
  });

  // Feedback tátil de clique
  window.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-pressed');
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-pressed');
  });

  // Clique nos cards de pizza e combos da home redireciona para o cardápio
  const homeFoodCards = document.querySelectorAll('.favorites-cards-grid .food-card, .combos-grid .combo-card');
  homeFoodCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      window.location.href = 'cardapio.html';
    });
  });
});
