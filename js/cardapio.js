/**
 * BINGEN PIZZA & BURGER - CARDÁPIO SYSTEM
 * 100% Client-Side Engine (Vanilla ES6)
 * Estilo Rústico, Quadrado e Neo-Brutalista (Idêntico à Home)
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.cardapioData;
  if (!data) {
    console.error('Base de dados cardapioData não encontrada.');
    return;
  }

  /* ==================== ESTADO DA APLICAÇÃO ==================== */
  if (window.gsap) {
    if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
    if (window.Flip) gsap.registerPlugin(Flip);
  }

  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    if (window.gsap) {
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

  let cart = [];
  try {
    const savedCart = localStorage.getItem('bingen_delivery_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (e) {
    cart = [];
  }

  let currentCategory = 'todos';
  let currentSearchQuery = '';
  let activeModalProduct = null;
  let selectedSizeIndex = 1; // Padrão Grande
  let selectedCrustId = 'tradicional';
  let selectedFreeGift = '';
  let selectedBurgerDoneness = '';
  let selectedBurgerExtras = [];
  let currentModalQty = 1;

  // Meio a Meio
  let meioMeioFlavor1 = null;
  let meioMeioFlavor2 = null;
  let meioMeioSizeIndex = 1; // Grande
  let meioMeioCrustId = 'tradicional';
  let meioMeioFreeGift = '';
  let meioMeioQty = 1;

  // Checkout
  let deliveryType = 'delivery';
  let selectedPaymentMethod = 'pix';

  /* ==================== UTILITÁRIOS ==================== */
  const normalizeStr = str => (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const formatBRL = val => (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function pushModalState(modalId) {
    document.body.classList.add('modal-open');
    if (window.lenis) window.lenis.stop();
    if (window.history && window.history.pushState) {
      window.history.pushState({ modalOpen: modalId }, '');
    }
  }

  window.addEventListener('popstate', () => {
    closeAllModals();
  });

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  /* ==================== SELETORES DO DOM ==================== */
  const productsGridEl = document.getElementById('products-grid');
  const categoryPillsEl = document.getElementById('category-pills');
  const searchInputEl = document.getElementById('search-input');
  const searchClearBtnEl = document.getElementById('search-clear-btn');
  const openMeioMeioBannerBtn = document.getElementById('btn-open-meio-meio-banner');

  // Cart
  const headerCartBtn = document.getElementById('header-cart-btn');
  const cartCounterBadge = document.getElementById('cart-counter-badge');
  const cartBtnPrice = document.getElementById('cart-btn-price');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const closeCartDrawerBtn = document.getElementById('btn-close-cart-drawer');
  const cartItemsListEl = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal-val');
  const cartDeliveryFeeEl = document.getElementById('cart-delivery-fee-val');
  const cartTotalAmountEl = document.getElementById('cart-total-amount-val');
  const freeDeliveryProgressText = document.getElementById('free-delivery-text');
  const btnProceedCheckout = document.getElementById('btn-proceed-checkout');

  // Modal Produto Padrão
  const productModalOverlay = document.getElementById('product-modal-overlay');
  const closeProductModalBtn = document.getElementById('btn-close-product-modal');
  const modalProductName = document.getElementById('modal-product-name');
  const modalProductDesc = document.getElementById('modal-product-desc');
  const modalSizesContainer = document.getElementById('modal-sizes-container');
  const modalCrustSection = document.getElementById('modal-crust-section');
  const modalCrustContainer = document.getElementById('modal-crust-container');
  const modalFreeGiftSection = document.getElementById('modal-freegift-section');
  const modalFreeGiftSelect = document.getElementById('modal-freegift-select');
  const modalBurgerOptionsSection = document.getElementById('modal-burger-options-section');
  const modalBurgerDonenessContainer = document.getElementById('modal-burger-doneness-container');
  const modalBurgerExtrasContainer = document.getElementById('modal-burger-extras-container');
  const modalItemNotes = document.getElementById('modal-item-notes');
  const modalQtyDisplay = document.getElementById('modal-qty-display');
  const btnModalQtyMinus = document.getElementById('btn-modal-qty-minus');
  const btnModalQtyPlus = document.getElementById('btn-modal-qty-plus');
  const modalTotalPriceEl = document.getElementById('modal-total-price');
  const btnModalAddToCart = document.getElementById('btn-modal-add-to-cart');

  // Modal Meio a Meio
  const meioMeioModalOverlay = document.getElementById('meio-meio-modal-overlay');
  const closeMeioMeioModalBtn = document.getElementById('btn-close-meio-meio-modal');
  const slot1FlavorName = document.getElementById('slot1-flavor-name');
  const slot1FlavorPrice = document.getElementById('slot1-flavor-price');
  const slot2FlavorName = document.getElementById('slot2-flavor-name');
  const slot2FlavorPrice = document.getElementById('slot2-flavor-price');
  const slot1Search = document.getElementById('slot1-search');
  const slot1List = document.getElementById('slot1-list');
  const slot2Search = document.getElementById('slot2-search');
  const slot2List = document.getElementById('slot2-list');
  const meioMeioSizesContainer = document.getElementById('meio-meio-sizes-container');
  const meioMeioCrustContainer = document.getElementById('meio-meio-crust-container');
  const meioMeioFreeGiftSection = document.getElementById('meio-meio-freegift-section');
  const meioMeioFreeGiftSelect = document.getElementById('meio-meio-freegift-select');
  const meioMeioNotes = document.getElementById('meio-meio-notes');
  const meioMeioTotalPrice = document.getElementById('meio-meio-total-price');
  const btnMeioMeioAddToCart = document.getElementById('btn-meio-meio-add-to-cart');

  // Modal Checkout
  const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
  const closeCheckoutModalBtn = document.getElementById('btn-close-checkout-modal');
  const typeDeliveryBtn = document.getElementById('type-delivery-btn');
  const typeRetiradaBtn = document.getElementById('type-retirada-btn');
  const deliveryAddressFields = document.getElementById('delivery-address-fields');
  const clientNameInput = document.getElementById('client-name');
  const clientWhatsappInput = document.getElementById('client-whatsapp');
  const clientCepInput = document.getElementById('client-cep');
  const clientRuaInput = document.getElementById('client-rua');
  const clientNumeroInput = document.getElementById('client-numero');
  const clientBairroInput = document.getElementById('client-bairro');
  const clientComplementoInput = document.getElementById('client-complemento');
  const clientNotesInput = document.getElementById('client-notes');
  const trocoContainer = document.getElementById('troco-container');
  const clientTrocoInput = document.getElementById('client-troco');
  const checkoutSummaryItemsList = document.getElementById('checkout-summary-items-list');
  const checkoutFinalSubtotal = document.getElementById('checkout-final-subtotal');
  const checkoutFinalDelivery = document.getElementById('checkout-final-delivery');
  const checkoutFinalTotal = document.getElementById('checkout-final-total');
  const btnDispatchWhatsapp = document.getElementById('btn-dispatch-whatsapp');

  /* ==================== 1. RENDERIZAÇÃO DO CATÁLOGO ==================== */
  function renderProducts(animateWithFlip = false) {
    if (!productsGridEl) return;

    let state = null;
    if (animateWithFlip && window.Flip) {
      state = Flip.getState(productsGridEl.querySelectorAll('.food-card, .category-header-divider'));
    }

    let filtered = data.products.filter(item => {
      const matchCategory = (currentCategory === 'todos') || (item.category === currentCategory);
      const matchSearch = !currentSearchQuery || 
        normalizeStr(item.name).includes(normalizeStr(currentSearchQuery)) ||
        normalizeStr(item.description).includes(normalizeStr(currentSearchQuery)) ||
        normalizeStr(item.categoryName).includes(normalizeStr(currentSearchQuery));
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      productsGridEl.innerHTML = `
        <div class="empty-cardapio-box">
          <h3 class="empty-cardapio-title">Nenhum item encontrado</h3>
          <p class="empty-cardapio-desc">Não encontramos resultados para "${escapeHTML(currentSearchQuery)}".</p>
          <button class="btn-solid-teal" id="btn-reset-filters">LIMPAR BUSCA E FILTROS</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'todos';
          currentSearchQuery = '';
          if (searchInputEl) searchInputEl.value = '';
          if (searchClearBtnEl) searchClearBtnEl.classList.remove('active');
          updateCategoryPillsUI();
          renderProducts(true);
        });
      }
      return;
    }

    if (currentCategory === 'todos' && !currentSearchQuery) {
      const categoriesOrder = [
        'pizzas-tradicionais',
        'pizzas-especiais',
        'burgers',
        'entradas',
        'pizzas-doces',
        'bebidas'
      ];

      let html = '';
      categoriesOrder.forEach(catId => {
        const catItems = data.products.filter(p => p.category === catId);
        if (catItems.length > 0) {
          const catInfo = data.categories.find(c => c.id === catId);
          html += `
            <div class="category-header-divider" data-flip-id="cat-header-${catId}">
              <h2 class="category-header-title">${catInfo ? catInfo.name.toUpperCase() : catItems[0].categoryName.toUpperCase()}</h2>
              <span class="category-header-count">${catItems.length} OPÇÕES</span>
            </div>
          `;
          catItems.forEach(item => {
            html += generateProductCardHTML(item);
          });
        }
      });
      productsGridEl.innerHTML = html;
    } else {
      productsGridEl.innerHTML = filtered.map(item => generateProductCardHTML(item)).join('');
    }

    // Vincula botões PEDIR
    const orderBtns = productsGridEl.querySelectorAll('.btn-card-order');
    orderBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = parseInt(btn.getAttribute('data-id'), 10);
        const product = data.products.find(p => p.id === prodId);
        if (product) {
          openProductModal(product);
        }
      });
    });

    // Vincula clique direto em cada food-card para personalização
    const cards = productsGridEl.querySelectorAll('.food-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const prodId = parseInt(card.getAttribute('data-id'), 10);
        const product = data.products.find(p => p.id === prodId);
        if (product) {
          openProductModal(product);
        }
      });
    });

    // Directive 10: Animação limpa com GSAP Flip nas trocas de categoria
    if (state && window.Flip) {
      Flip.from(state, {
        duration: 0.45,
        ease: 'power2.inOut',
        stagger: 0.02,
        absolute: false,
        onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35 }),
        onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.95, duration: 0.25 })
      });
    }
  }

  function generateProductCardHTML(item) {
    const startingPrice = item.price && item.price.length > 0 ? item.price[0] : 0;
    
    // Badge / Categoria
    let badgeTag = 'FORNO A LENHA';
    if (item.tags && item.tags.includes('favorita')) badgeTag = 'FAVORITA';
    else if (item.tags && item.tags.includes('chef')) badgeTag = 'CHEF SIGNATURE';
    else if (item.tags && item.tags.includes('veggie')) badgeTag = 'VEGETARIANA';
    else if (item.tags && item.tags.includes('piccante')) badgeTag = 'PICANTE';
    else if (item.isBurger) badgeTag = 'CHAPA QUENTE';
    else if (item.isSnack) badgeTag = 'PETISCO';
    else if (item.isDrink) badgeTag = 'GELADA';

    // Directive 2: Card idêntico ao da Imagem 1 (Tripletta)
    // 1. Título em destaque no topo
    // 2. Foto no meio com botão PEDIR sobreposto no canto inferior direito
    // 3. Preço em negrito + Descrição em itálico abaixo
    return `
      <article class="food-card tripletta-card" data-id="${item.id}" data-flip-id="prod-${item.id}">
        <div class="tripletta-card-header">
          <h3 class="tripletta-card-name">${escapeHTML(item.name.toUpperCase())}</h3>
        </div>
        
        <div class="tripletta-card-media">
          <img src="${item.img}" alt="${escapeHTML(item.name)}" class="tripletta-card-img" loading="lazy">
          <button class="btn-card-order btn-tripletta-order" data-id="${item.id}" title="Personalizar e Pedir">
            <span>PEDIR</span>
          </button>
        </div>

        <div class="tripletta-card-footer">
          <div class="tripletta-card-price-row">
            <span class="tripletta-card-price">${formatBRL(startingPrice)}</span>
            <span class="tripletta-card-badge">${badgeTag}</span>
          </div>
          <p class="tripletta-card-desc">${escapeHTML(item.description)}</p>
        </div>
      </article>
    `;
  }

  /* ==================== 2. FILTROS & BUSCA ==================== */
  function renderCategoryPills() {
    if (!categoryPillsEl) return;
    categoryPillsEl.innerHTML = data.categories.map(cat => {
      return `
        <button class="category-tab-btn ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
          <span class="tab-btn-text">${escapeHTML(cat.name)}</span>
          <img src="assets/icons/chevron-right-nav2.svg" alt="" class="tab-chevron">
        </button>
      `;
    }).join('');

    categoryPillsEl.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-category');
        currentCategory = catId;
        updateCategoryPillsUI();
        
        // Directive 10: Filtrar com animação GSAP Flip
        renderProducts(true);

        // Directive 13: Rolagem suave até a lista de produtos via Lenis/GSAP
        smoothScrollTo('#secao-produtos');
      });
    });
  }

  function smoothScrollTo(targetSelector, offset = 80) {
    const el = typeof targetSelector === 'string' ? document.querySelector(targetSelector) : targetSelector;
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { offset: -offset, duration: 1.1 });
    } else if (window.gsap && window.ScrollToPlugin) {
      gsap.to(window, {
        duration: 0.75,
        scrollTo: { y: el, offsetY: offset, autoKill: false },
        ease: 'power2.out'
      });
    } else {
      const topPos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  }

  function updateCategoryPillsUI() {
    if (!categoryPillsEl) return;
    categoryPillsEl.querySelectorAll('.category-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-category') === currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (searchClearBtnEl) {
        if (currentSearchQuery.length > 0) {
          searchClearBtnEl.classList.add('active');
        } else {
          searchClearBtnEl.classList.remove('active');
        }
      }
      renderProducts();
    });
  }

  if (searchClearBtnEl) {
    searchClearBtnEl.addEventListener('click', () => {
      // Directive 10: Botão PESQUISAR filtra e rola suavemente para os produtos
      if (searchInputEl) {
        currentSearchQuery = searchInputEl.value.trim();
        renderProducts();
        const target = document.getElementById('category-pills') || document.getElementById('secao-produtos');
        if (target) {
          if (window.lenis) {
            window.lenis.scrollTo(target, { offset: -20 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  }

  /* ==================== 3. MODAL DE CUSTOMIZAÇÃO ==================== */
  function openProductModal(product) {
    activeModalProduct = product;
    selectedSizeIndex = product.sizes.length > 1 ? 1 : 0;
    selectedCrustId = 'tradicional';
    selectedFreeGift = data.freeGiftOptions[0];
    selectedBurgerDoneness = data.burgerDoneness[0];
    selectedBurgerExtras = [];
    currentModalQty = 1;

    if (modalProductName) modalProductName.textContent = product.name;
    if (modalProductDesc) modalProductDesc.textContent = product.description;
    if (modalItemNotes) modalItemNotes.value = '';
    if (modalQtyDisplay) modalQtyDisplay.textContent = currentModalQty;

    renderModalSizes(product);

    if (product.isPizza && modalCrustSection) {
      modalCrustSection.style.display = 'block';
      renderModalCrusts();
    } else if (modalCrustSection) {
      modalCrustSection.style.display = 'none';
    }

    if (product.isBurger && modalBurgerOptionsSection) {
      modalBurgerOptionsSection.style.display = 'block';
      renderBurgerOptions();
    } else if (modalBurgerOptionsSection) {
      modalBurgerOptionsSection.style.display = 'none';
    }

    updateModalFreeGiftVisibility();
    updateModalTotalPrice();

    if (productModalOverlay) {
      productModalOverlay.classList.add('active', 'open');
      pushModalState('product-modal');
    }
  }

  function renderModalSizes(product) {
    if (!modalSizesContainer) return;
    modalSizesContainer.innerHTML = product.sizes.map((sizeName, idx) => {
      const price = product.price[idx];
      const isSelected = idx === selectedSizeIndex;
      return `
        <div class="option-sharp-card ${isSelected ? 'selected' : ''}" data-index="${idx}">
          <span class="option-sharp-name">${escapeHTML(sizeName)}</span>
          <span class="option-sharp-price">${formatBRL(price)}</span>
        </div>
      `;
    }).join('');

    modalSizesContainer.querySelectorAll('.option-sharp-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedSizeIndex = parseInt(card.getAttribute('data-index'), 10);
        modalSizesContainer.querySelectorAll('.option-sharp-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        updateModalFreeGiftVisibility();
        updateModalTotalPrice();
      });
    });
  }

  function renderModalCrusts() {
    if (!modalCrustContainer) return;
    modalCrustContainer.innerHTML = data.crustOptions.map(crust => {
      const isSelected = crust.id === selectedCrustId;
      return `
        <div class="option-sharp-card ${isSelected ? 'selected' : ''}" data-crust-id="${crust.id}">
          <span class="option-sharp-name">${escapeHTML(crust.name)}</span>
          <span class="option-sharp-price">${crust.price > 0 ? '+ ' + formatBRL(crust.price) : 'GRÁTIS'}</span>
        </div>
      `;
    }).join('');

    modalCrustContainer.querySelectorAll('.option-sharp-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedCrustId = card.getAttribute('data-crust-id');
        modalCrustContainer.querySelectorAll('.option-sharp-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        updateModalTotalPrice();
      });
    });
  }

  function updateModalFreeGiftVisibility() {
    if (!modalFreeGiftSection) return;
    const isEligible = activeModalProduct && activeModalProduct.isPizza && (selectedSizeIndex === 2 || selectedSizeIndex === 3);
    if (isEligible) {
      modalFreeGiftSection.style.display = 'block';
      if (modalFreeGiftSelect) {
        modalFreeGiftSelect.innerHTML = data.freeGiftOptions.map(opt => `
          <option value="${escapeHTML(opt)}">${escapeHTML(opt)}</option>
        `).join('');
        selectedFreeGift = modalFreeGiftSelect.value;
      }
    } else {
      modalFreeGiftSection.style.display = 'none';
      selectedFreeGift = '';
    }
  }

  if (modalFreeGiftSelect) {
    modalFreeGiftSelect.addEventListener('change', (e) => {
      selectedFreeGift = e.target.value;
    });
  }

  function renderBurgerOptions() {
    if (modalBurgerDonenessContainer) {
      modalBurgerDonenessContainer.innerHTML = data.burgerDoneness.map((doneness, idx) => `
        <div class="option-sharp-card ${idx === 0 ? 'selected' : ''}" data-doneness="${escapeHTML(doneness)}">
          <span class="option-sharp-name">${escapeHTML(doneness)}</span>
        </div>
      `).join('');

      modalBurgerDonenessContainer.querySelectorAll('.option-sharp-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedBurgerDoneness = card.getAttribute('data-doneness');
          modalBurgerDonenessContainer.querySelectorAll('.option-sharp-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        });
      });
    }

    if (modalBurgerExtrasContainer) {
      modalBurgerExtrasContainer.innerHTML = data.burgerExtras.map(extra => `
        <div class="option-sharp-card" data-extra-id="${extra.id}">
          <span class="option-sharp-name">${escapeHTML(extra.name)}</span>
          <span class="option-sharp-price">+ ${formatBRL(extra.price)}</span>
        </div>
      `).join('');

      modalBurgerExtrasContainer.querySelectorAll('.option-sharp-card').forEach(card => {
        card.addEventListener('click', () => {
          const extraId = card.getAttribute('data-extra-id');
          const isSelected = card.classList.contains('selected');
          if (isSelected) {
            card.classList.remove('selected');
            selectedBurgerExtras = selectedBurgerExtras.filter(id => id !== extraId);
          } else {
            card.classList.add('selected');
            selectedBurgerExtras.push(extraId);
          }
          updateModalTotalPrice();
        });
      });
    }
  }

  function updateModalTotalPrice() {
    if (!activeModalProduct || !modalTotalPriceEl) return;
    let basePrice = activeModalProduct.price[selectedSizeIndex] || 0;

    if (activeModalProduct.isPizza) {
      const crust = data.crustOptions.find(c => c.id === selectedCrustId);
      if (crust) basePrice += crust.price;
    }

    if (activeModalProduct.isBurger) {
      selectedBurgerExtras.forEach(extraId => {
        const extra = data.burgerExtras.find(e => e.id === extraId);
        if (extra) basePrice += extra.price;
      });
    }

    const total = basePrice * currentModalQty;
    modalTotalPriceEl.textContent = formatBRL(total);
  }

  if (btnModalQtyMinus) {
    btnModalQtyMinus.addEventListener('click', () => {
      if (currentModalQty > 1) {
        currentModalQty--;
        if (modalQtyDisplay) modalQtyDisplay.textContent = currentModalQty;
        updateModalTotalPrice();
      }
    });
  }

  if (btnModalQtyPlus) {
    btnModalQtyPlus.addEventListener('click', () => {
      currentModalQty++;
      if (modalQtyDisplay) modalQtyDisplay.textContent = currentModalQty;
      updateModalTotalPrice();
    });
  }

  if (btnModalAddToCart) {
    btnModalAddToCart.addEventListener('click', () => {
      if (!activeModalProduct) return;

      let unitPrice = activeModalProduct.price[selectedSizeIndex] || 0;
      let crustName = '';
      if (activeModalProduct.isPizza) {
        const crust = data.crustOptions.find(c => c.id === selectedCrustId);
        if (crust && crust.price > 0) {
          unitPrice += crust.price;
          crustName = crust.name;
        }
      }

      let extraNames = [];
      if (activeModalProduct.isBurger) {
        selectedBurgerExtras.forEach(extraId => {
          const extra = data.burgerExtras.find(e => e.id === extraId);
          if (extra) {
            unitPrice += extra.price;
            extraNames.push(extra.name);
          }
        });
      }

      const notes = modalItemNotes ? modalItemNotes.value.trim() : '';
      const sizeName = activeModalProduct.sizes[selectedSizeIndex];
      const uniqueId = `${activeModalProduct.id}-s${selectedSizeIndex}-${selectedCrustId}-${selectedBurgerExtras.sort().join('-')}-${normalizeStr(selectedFreeGift)}`;

      addToCart({
        uniqueId: uniqueId,
        productId: activeModalProduct.id,
        name: activeModalProduct.name,
        img: activeModalProduct.img,
        size: sizeName,
        price: unitPrice,
        qty: currentModalQty,
        crust: crustName,
        freeGift: selectedFreeGift,
        doneness: selectedBurgerDoneness,
        extras: extraNames,
        notes: notes,
        isPizza: activeModalProduct.isPizza,
        isMeioMeio: false
      });

      closeAllModals();
      openCartDrawer();
    });
  }

  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener('click', () => closeAllModals());
  }

  /* ==================== 4. MODAL MEIO A MEIO ==================== */
  function openMeioMeioModal() {
    const pizzaFlavors = data.products.filter(p => p.isPizza);
    if (pizzaFlavors.length < 2) return;

    meioMeioFlavor1 = pizzaFlavors[0];
    meioMeioFlavor2 = pizzaFlavors[1];
    meioMeioSizeIndex = 1; // Padrão Grande
    meioMeioCrustId = 'tradicional';
    meioMeioFreeGift = '';
    meioMeioQty = 1;

    renderMeioMeioSizes();
    renderMeioMeioCrusts();
    renderMeioMeioFlavorPickers();
    updateMeioMeioSummary();

    if (meioMeioModalOverlay) {
      meioMeioModalOverlay.classList.add('active', 'open');
      pushModalState('meio-meio-modal');
    }
  }

  function renderMeioMeioSizes() {
    if (!meioMeioSizesContainer) return;
    const meioSizes = [
      { index: 1, name: 'Grande 35 cm (8 fatias)' },
      { index: 2, name: 'Super 40 cm (10 fatias - Ganha 2L Grátis)' },
      { index: 3, name: 'Max 45 cm (12 fatias - Ganha 2L Grátis)' }
    ];

    meioMeioSizesContainer.innerHTML = meioSizes.map((s, idx) => `
      <div class="option-sharp-card ${s.index === meioMeioSizeIndex ? 'selected' : ''}" data-target-index="${s.index}">
        <span class="option-sharp-name">${escapeHTML(s.name)}</span>
      </div>
    `).join('');

    meioMeioSizesContainer.querySelectorAll('.option-sharp-card').forEach(card => {
      card.addEventListener('click', () => {
        meioMeioSizeIndex = parseInt(card.getAttribute('data-target-index'), 10);
        meioMeioSizesContainer.querySelectorAll('.option-sharp-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        updateMeioMeioSummary();
      });
    });
  }

  function renderMeioMeioCrusts() {
    if (!meioMeioCrustContainer) return;
    meioMeioCrustContainer.innerHTML = data.crustOptions.map(crust => `
      <div class="option-sharp-card ${crust.id === meioMeioCrustId ? 'selected' : ''}" data-crust-id="${crust.id}">
        <span class="option-sharp-name">${escapeHTML(crust.name)}</span>
        <span class="option-sharp-price">${crust.price > 0 ? '+ ' + formatBRL(crust.price) : 'GRÁTIS'}</span>
      </div>
    `).join('');

    meioMeioCrustContainer.querySelectorAll('.option-sharp-card').forEach(card => {
      card.addEventListener('click', () => {
        meioMeioCrustId = card.getAttribute('data-crust-id');
        meioMeioCrustContainer.querySelectorAll('.option-sharp-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        updateMeioMeioSummary();
      });
    });
  }

  function renderMeioMeioFlavorPickers() {
    const pizzaFlavors = data.products.filter(p => p.isPizza);

    function populateList(container, filterText, selectedFlavorId, onSelect) {
      if (!container) return;
      const filtered = pizzaFlavors.filter(p => !filterText || normalizeStr(p.name).includes(normalizeStr(filterText)));
      container.innerHTML = filtered.map(p => `
        <button class="flavor-option-btn ${p.id === selectedFlavorId ? 'active-flavor' : ''}" data-id="${p.id}">
          <span>${escapeHTML(p.name)}</span>
          <span style="font-family:var(--font-display);">${formatBRL(p.price[meioMeioSizeIndex] || p.price[1])}</span>
        </button>
      `).join('');

      container.querySelectorAll('.flavor-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const flavor = pizzaFlavors.find(p => p.id === id);
          if (flavor) {
            onSelect(flavor);
          }
        });
      });
    }

    populateList(slot1List, '', meioMeioFlavor1 ? meioMeioFlavor1.id : null, (flavor) => {
      meioMeioFlavor1 = flavor;
      updateMeioMeioSummary();
      renderMeioMeioFlavorPickers();
    });

    if (slot1Search) {
      slot1Search.addEventListener('input', (e) => {
        populateList(slot1List, e.target.value, meioMeioFlavor1 ? meioMeioFlavor1.id : null, (flavor) => {
          meioMeioFlavor1 = flavor;
          updateMeioMeioSummary();
          renderMeioMeioFlavorPickers();
        });
      });
    }

    populateList(slot2List, '', meioMeioFlavor2 ? meioMeioFlavor2.id : null, (flavor) => {
      meioMeioFlavor2 = flavor;
      updateMeioMeioSummary();
      renderMeioMeioFlavorPickers();
    });

    if (slot2Search) {
      slot2Search.addEventListener('input', (e) => {
        populateList(slot2List, e.target.value, meioMeioFlavor2 ? meioMeioFlavor2.id : null, (flavor) => {
          meioMeioFlavor2 = flavor;
          updateMeioMeioSummary();
          renderMeioMeioFlavorPickers();
        });
      });
    }
  }

  function updateMeioMeioSummary() {
    if (!meioMeioFlavor1 || !meioMeioFlavor2) return;

    if (slot1FlavorName) slot1FlavorName.textContent = meioMeioFlavor1.name;
    if (slot2FlavorName) slot2FlavorName.textContent = meioMeioFlavor2.name;

    const p1 = meioMeioFlavor1.price[meioMeioSizeIndex] || meioMeioFlavor1.price[1];
    const p2 = meioMeioFlavor2.price[meioMeioSizeIndex] || meioMeioFlavor2.price[1];

    if (slot1FlavorPrice) slot1FlavorPrice.textContent = `Individual: ${formatBRL(p1)}`;
    if (slot2FlavorPrice) slot2FlavorPrice.textContent = `Individual: ${formatBRL(p2)}`;

    const higherPrice = Math.max(p1, p2);

    let crustExtra = 0;
    const crust = data.crustOptions.find(c => c.id === meioMeioCrustId);
    if (crust) crustExtra = crust.price;

    const total = (higherPrice + crustExtra) * meioMeioQty;
    if (meioMeioTotalPrice) {
      meioMeioTotalPrice.textContent = formatBRL(total);
    }

    if (meioMeioFreeGiftSection) {
      if (meioMeioSizeIndex === 2 || meioMeioSizeIndex === 3) {
        meioMeioFreeGiftSection.style.display = 'block';
        if (meioMeioFreeGiftSelect && !meioMeioFreeGift) {
          meioMeioFreeGiftSelect.innerHTML = data.freeGiftOptions.map(opt => `
            <option value="${escapeHTML(opt)}">${escapeHTML(opt)}</option>
          `).join('');
          meioMeioFreeGift = meioMeioFreeGiftSelect.value;
        }
      } else {
        meioMeioFreeGiftSection.style.display = 'none';
        meioMeioFreeGift = '';
      }
    }
  }

  if (meioMeioFreeGiftSelect) {
    meioMeioFreeGiftSelect.addEventListener('change', (e) => {
      meioMeioFreeGift = e.target.value;
    });
  }

  if (btnMeioMeioAddToCart) {
    btnMeioMeioAddToCart.addEventListener('click', () => {
      if (!meioMeioFlavor1 || !meioMeioFlavor2) return;

      const p1 = meioMeioFlavor1.price[meioMeioSizeIndex] || meioMeioFlavor1.price[1];
      const p2 = meioMeioFlavor2.price[meioMeioSizeIndex] || meioMeioFlavor2.price[1];
      let higherPrice = Math.max(p1, p2);

      let crustName = '';
      const crust = data.crustOptions.find(c => c.id === meioMeioCrustId);
      if (crust && crust.price > 0) {
        higherPrice += crust.price;
        crustName = crust.name;
      }

      const sizeName = meioMeioFlavor1.sizes[meioMeioSizeIndex];
      const notes = meioMeioNotes ? meioMeioNotes.value.trim() : '';
      const uniqueId = `meio-${meioMeioSizeIndex}-${meioMeioFlavor1.id}-${meioMeioFlavor2.id}-${meioMeioCrustId}-${normalizeStr(meioMeioFreeGift)}`;

      addToCart({
        uniqueId: uniqueId,
        productId: 'meio-meio',
        name: `Meio a Meio: ${meioMeioFlavor1.name} / ${meioMeioFlavor2.name}`,
        img: meioMeioFlavor1.img,
        size: sizeName,
        price: higherPrice,
        qty: 1,
        crust: crustName,
        freeGift: meioMeioFreeGift,
        doneness: '',
        extras: [],
        notes: notes,
        isPizza: true,
        isMeioMeio: true,
        flavor1: meioMeioFlavor1.name,
        flavor2: meioMeioFlavor2.name
      });

      closeAllModals();
      openCartDrawer();
    });
  }

  const openMeioMeioCardBtn = document.getElementById('btn-open-meio-meio-card');
  if (openMeioMeioCardBtn) {
    openMeioMeioCardBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMeioMeioModal();
    });
  }

  const meioMeioFeaturedCard = document.getElementById('meio-meio-featured-card');
  if (meioMeioFeaturedCard) {
    meioMeioFeaturedCard.addEventListener('click', () => {
      openMeioMeioModal();
    });
  }

  if (openMeioMeioBannerBtn) {
    openMeioMeioBannerBtn.addEventListener('click', () => openMeioMeioModal());
  }

  if (closeMeioMeioModalBtn) {
    closeMeioMeioModalBtn.addEventListener('click', () => closeAllModals());
  }

  /* ==================== 5. CARRINHO & DRAWER ==================== */
  function addToCart(item) {
    const existingIndex = cart.findIndex(c => c.uniqueId === item.uniqueId);
    if (existingIndex > -1) {
      cart[existingIndex].qty += item.qty;
    } else {
      cart.push(item);
    }
    saveCart();
    updateCartUI();
  }

  function updateCartQty(uniqueId, delta) {
    const itemIndex = cart.findIndex(c => c.uniqueId === uniqueId);
    if (itemIndex > -1) {
      cart[itemIndex].qty += delta;
      if (cart[itemIndex].qty <= 0) {
        cart.splice(itemIndex, 1);
      }
      saveCart();
      updateCartUI();
    }
  }

  function removeFromCart(uniqueId) {
    cart = cart.filter(c => c.uniqueId !== uniqueId);
    saveCart();
    updateCartUI();
  }

  function saveCart() {
    try {
      localStorage.setItem('bingen_delivery_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Erro ao salvar carrinho:', e);
    }
  }

  function calculateTotals() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let deliveryFee = data.config.deliveryFee;

    if (subtotal >= data.config.freeDeliveryThreshold || deliveryType === 'retirada' || subtotal === 0) {
      deliveryFee = 0;
    }

    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total };
  }

  function updateCartUI() {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const { subtotal, deliveryFee, total } = calculateTotals();

    if (cartCounterBadge) cartCounterBadge.textContent = totalQty;
    if (cartBtnPrice) cartBtnPrice.textContent = formatBRL(subtotal);

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatBRL(subtotal);
    if (cartDeliveryFeeEl) {
      cartDeliveryFeeEl.textContent = deliveryFee === 0 ? 'GRÁTIS' : formatBRL(deliveryFee);
    }
    if (cartTotalAmountEl) cartTotalAmountEl.textContent = formatBRL(total);

    if (freeDeliveryProgressText) {
      const threshold = data.config.freeDeliveryThreshold;
      if (subtotal >= threshold) {
        freeDeliveryProgressText.textContent = 'VOCÊ GANHOU ENTREGA GRÁTIS!';
      } else {
        const diff = threshold - subtotal;
        freeDeliveryProgressText.textContent = `FALTAM ${formatBRL(diff)} PARA ENTREGA GRÁTIS!`;
      }
    }

    if (cartItemsListEl) {
      if (cart.length === 0) {
        cartItemsListEl.innerHTML = `
          <div class="cart-empty-notice">
            SEU CARRINHO ESTÁ VAZIO.<br>ESCOLHA UMA PIZZA OU BURGER PARA COMEÇAR.
          </div>
        `;
        if (btnProceedCheckout) btnProceedCheckout.disabled = true;
      } else {
        if (btnProceedCheckout) btnProceedCheckout.disabled = false;
        cartItemsListEl.innerHTML = cart.map(item => {
          const itemTotal = item.price * item.qty;
          let detailsHTML = '';
          if (item.crust) detailsHTML += `<div>↳ Borda: ${escapeHTML(item.crust)}</div>`;
          if (item.freeGift) detailsHTML += `<div>↳ Brinde: ${escapeHTML(item.freeGift)}</div>`;
          if (item.doneness) detailsHTML += `<div>↳ Ponto: ${escapeHTML(item.doneness)}</div>`;
          if (item.extras && item.extras.length > 0) detailsHTML += `<div>↳ Extras: ${item.extras.map(e => escapeHTML(e)).join(', ')}</div>`;
          if (item.notes) detailsHTML += `<div>↳ Obs: "${escapeHTML(item.notes)}"</div>`;

          return `
            <div class="cart-item-block">
              <div class="cart-item-top-row">
                <h4 class="cart-item-heading">${escapeHTML(item.name)}</h4>
                <button class="cart-item-remove-btn" data-id="${item.uniqueId}" title="Remover">✕</button>
              </div>
              <div class="cart-item-size-tag">${escapeHTML(item.size)}</div>
              ${detailsHTML ? `<div class="cart-item-detail-line">${detailsHTML}</div>` : ''}
              <div class="cart-item-bottom-row">
                <div class="qty-control-sharp">
                  <button class="qty-sharp-btn btn-cart-qty-minus" data-id="${item.uniqueId}">−</button>
                  <span class="qty-sharp-value">${item.qty}</span>
                  <button class="qty-sharp-btn btn-cart-qty-plus" data-id="${item.uniqueId}">+</button>
                </div>
                <span class="cart-item-total-price">${formatBRL(itemTotal)}</span>
              </div>
            </div>
          `;
        }).join('');

        cartItemsListEl.querySelectorAll('.btn-cart-qty-minus').forEach(b => {
          b.addEventListener('click', () => updateCartQty(b.getAttribute('data-id'), -1));
        });
        cartItemsListEl.querySelectorAll('.btn-cart-qty-plus').forEach(b => {
          b.addEventListener('click', () => updateCartQty(b.getAttribute('data-id'), 1));
        });
        cartItemsListEl.querySelectorAll('.cart-item-remove-btn').forEach(b => {
          b.addEventListener('click', () => removeFromCart(b.getAttribute('data-id')));
        });
      }
    }
  }

  function openCartDrawer() {
    if (cartBackdrop && cartDrawer) {
      cartBackdrop.classList.add('active', 'open');
      cartDrawer.classList.add('active', 'open');
      document.body.classList.add('modal-open');
      if (window.lenis) window.lenis.stop();
      pushModalState('cart-drawer');
    }
  }

  function closeCartDrawer() {
    if (cartBackdrop && cartDrawer) {
      cartBackdrop.classList.remove('active', 'open');
      cartDrawer.classList.remove('active', 'open');
      const anyModalOpen = document.querySelector('.modal-dim-overlay.open, .modal-dim-overlay.active');
      if (!anyModalOpen) {
        document.body.classList.remove('modal-open');
        if (window.lenis) window.lenis.start();
      }
    }
  }

  if (headerCartBtn) {
    headerCartBtn.addEventListener('click', () => openCartDrawer());
  }

  if (closeCartDrawerBtn) {
    closeCartDrawerBtn.addEventListener('click', () => closeCartDrawer());
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', () => closeCartDrawer());
  }

  /* ==================== 6. CHECKOUT & VIACEP ==================== */
  if (btnProceedCheckout) {
    btnProceedCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  function openCheckoutModal() {
    updateCheckoutSummary();
    if (checkoutModalOverlay) {
      checkoutModalOverlay.classList.add('active', 'open');
      pushModalState('checkout-modal');
    }
  }

  function updateCheckoutSummary() {
    const { subtotal, deliveryFee, total } = calculateTotals();
    if (checkoutFinalSubtotal) checkoutFinalSubtotal.textContent = formatBRL(subtotal);
    if (checkoutFinalDelivery) checkoutFinalDelivery.textContent = deliveryFee === 0 ? 'GRÁTIS' : formatBRL(deliveryFee);
    if (checkoutFinalTotal) checkoutFinalTotal.textContent = formatBRL(total);

    if (checkoutSummaryItemsList) {
      checkoutSummaryItemsList.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; font-family:var(--font-condensed); font-size:1rem; color:var(--color-white);">
          <span>${item.qty}x ${escapeHTML(item.name)} (${escapeHTML(item.size)})</span>
          <span style="color:var(--teal-light);">${formatBRL(item.price * item.qty)}</span>
        </div>
      `).join('');
    }
  }

  if (typeDeliveryBtn && typeRetiradaBtn) {
    typeDeliveryBtn.addEventListener('click', () => {
      deliveryType = 'delivery';
      typeDeliveryBtn.classList.add('active');
      typeRetiradaBtn.classList.remove('active');
      if (deliveryAddressFields) deliveryAddressFields.style.display = 'block';
      updateCheckoutSummary();
      updateCartUI();
    });

    typeRetiradaBtn.addEventListener('click', () => {
      deliveryType = 'retirada';
      typeRetiradaBtn.classList.add('active');
      typeDeliveryBtn.classList.remove('active');
      if (deliveryAddressFields) deliveryAddressFields.style.display = 'none';
      updateCheckoutSummary();
      updateCartUI();
    });
  }

  if (clientCepInput) {
    clientCepInput.addEventListener('blur', async () => {
      const cepClean = clientCepInput.value.replace(/\D/g, '');
      if (cepClean.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
          const addressData = await res.json();
          if (!addressData.erro) {
            if (clientRuaInput) clientRuaInput.value = addressData.logradouro || '';
            if (clientBairroInput) clientBairroInput.value = addressData.bairro || '';
            if (clientNumeroInput) clientNumeroInput.focus();
          } else {
            alert('CEP não encontrado. Por favor, preencha manualmente.');
          }
        } catch (err) {
          console.warn('Erro ViaCEP:', err);
        }
      }
    });

    clientCepInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 5) {
        v = v.replace(/^(\d{5})(\d)/, '$1-$2');
      }
      e.target.value = v.substring(0, 9);
    });
  }

  const paymentCards = document.querySelectorAll('.payment-sharp-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPaymentMethod = card.getAttribute('data-method');
      if (trocoContainer) {
        trocoContainer.style.display = selectedPaymentMethod === 'dinheiro' ? 'block' : 'none';
      }
    });
  });

  if (btnDispatchWhatsapp) {
    btnDispatchWhatsapp.addEventListener('click', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
      }

      const nome = clientNameInput ? clientNameInput.value.trim() : '';
      const whatsapp = clientWhatsappInput ? clientWhatsappInput.value.trim() : '';

      if (!nome) {
        alert('Por favor, digite seu nome completo.');
        if (clientNameInput) clientNameInput.focus();
        return;
      }

      if (!whatsapp) {
        alert('Por favor, informe seu WhatsApp.');
        if (clientWhatsappInput) clientWhatsappInput.focus();
        return;
      }

      let enderecoTexto = '';
      if (deliveryType === 'delivery') {
        const rua = clientRuaInput ? clientRuaInput.value.trim() : '';
        const numero = clientNumeroInput ? clientNumeroInput.value.trim() : '';
        const bairro = clientBairroInput ? clientBairroInput.value.trim() : '';
        const complemento = clientComplementoInput ? clientComplementoInput.value.trim() : '';

        if (!rua || !numero || !bairro) {
          alert('Por favor, preencha o endereço completo para entrega.');
          return;
        }

        enderecoTexto = `${rua}, Nº ${numero} - ${bairro}${complemento ? ' (' + complemento + ')' : ''}`;
      } else {
        enderecoTexto = 'Retirada no Balcão (Rua Bingen, 2076)';
      }

      let pagamentoTexto = '';
      if (selectedPaymentMethod === 'pix') {
        pagamentoTexto = 'Pix';
      } else if (selectedPaymentMethod === 'cartao_credito') {
        pagamentoTexto = 'Cartão de Crédito na Entrega';
      } else if (selectedPaymentMethod === 'cartao_debito') {
        pagamentoTexto = 'Cartão de Débito na Entrega';
      } else if (selectedPaymentMethod === 'dinheiro') {
        const troco = clientTrocoInput ? clientTrocoInput.value.trim() : '';
        pagamentoTexto = `Dinheiro ${troco ? '(Troco para ' + troco + ')' : '(Sem troco)'}`;
      }

      const { subtotal, deliveryFee, total } = calculateTotals();
      const obsGerais = clientNotesInput ? clientNotesInput.value.trim() : '';

      let msg = `*NOVO PEDIDO - ${data.config.restaurantName.toUpperCase()}*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      msg += `*ITENS DO PEDIDO:*\n`;

      cart.forEach(item => {
        msg += `• ${item.qty}x *${item.name}* (${item.size})\n`;
        if (item.crust) msg += `  ↳ Borda: ${item.crust}\n`;
        if (item.freeGift) msg += `  ↳ Brinde: ${item.freeGift}\n`;
        if (item.doneness) msg += `  ↳ Ponto: ${item.doneness}\n`;
        if (item.extras && item.extras.length > 0) msg += `  ↳ Extras: ${item.extras.join(', ')}\n`;
        if (item.notes) msg += `  ↳ Obs: "${item.notes}"\n`;
        msg += `  ↳ Valor: ${formatBRL(item.price * item.qty)}\n\n`;
      });

      msg += `━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `*RESUMO FINANCEIRO:*\n`;
      msg += `• Subtotal: ${formatBRL(subtotal)}\n`;
      msg += `• Taxa de Entrega: ${deliveryFee === 0 ? 'GRÁTIS' : formatBRL(deliveryFee)}\n`;
      msg += `• *TOTAL DO PEDIDO: ${formatBRL(total)}*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

      msg += `*DADOS DO CLIENTE & ENTREGA:*\n`;
      msg += `• *Cliente:* ${nome}\n`;
      msg += `• *WhatsApp:* ${whatsapp}\n`;
      msg += `• *Tipo:* ${deliveryType === 'delivery' ? 'Entrega Delivery' : 'Retirada no Balcão'}\n`;
      msg += `• *Endereço:* ${enderecoTexto}\n`;
      msg += `• *Pagamento:* ${pagamentoTexto}\n`;
      if (obsGerais) {
        msg += `• *Observações:* ${obsGerais}\n`;
      }

      msg += `\n_Pedido gerado pelo cardápio digital Bingen._`;

      const zapUrl = `https://wa.me/${data.config.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      
      cart = [];
      saveCart();
      updateCartUI();
      closeAllModals();

      window.open(zapUrl, '_blank');
    });
  }

  if (closeCheckoutModalBtn) {
    closeCheckoutModalBtn.addEventListener('click', () => closeAllModals());
  }

  /* ==================== 7. FECHAMENTO DE MODAIS ==================== */
  function closeAllModals() {
    if (productModalOverlay) productModalOverlay.classList.remove('active', 'open');
    if (meioMeioModalOverlay) meioMeioModalOverlay.classList.remove('active', 'open');
    if (checkoutModalOverlay) checkoutModalOverlay.classList.remove('active', 'open');
    closeCartDrawer();
    document.body.classList.remove('modal-open');
    if (window.lenis) window.lenis.start();
  }

  [productModalOverlay, meioMeioModalOverlay, checkoutModalOverlay].forEach(overlay => {
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeAllModals();
        }
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  /* ==================== INICIALIZAÇÃO ==================== */
  renderCategoryPills();
  renderProducts();
  updateCartUI();
});
