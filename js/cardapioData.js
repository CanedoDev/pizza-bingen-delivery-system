/**
 * BINGEN PIZZA & BURGER - CARDÁPIO DATA
 * Base de dados completa desacoplada do client-side.
 * Contém dados para Pizzas Tradicionais, Especiais, Burgers, Entradas, Doces e Bebidas.
 */

const cardapioData = {
  // Configurações do Restaurante & WhatsApp
  config: {
    restaurantName: 'Bingen Pizza & Burger',
    whatsappNumber: '5524988100625', // (24) 99932-3962
    deliveryFee: 7.00,
    freeDeliveryThreshold: 120.00,
    estimatedTime: '35 a 50 min',
    openingHours: 'Terça a Domingo: 18h às 23h30',
    addressDisplay: 'Rua Bingen, 2076 - Bingen, Petrópolis - RJ',
    promoActive: true,
    promoBannerText: 'PROMOÇÃO DA NOITE: Pizzas Super (40cm) ou Max (45cm) ganham 1 Refrigerante 2L Grátis!'
  },

  // Opções de Bordas Recheadas para Pizzas
  crustOptions: [
    { id: 'tradicional', name: 'Borda Tradicional Crocante (Padrão)', price: 0.00 },
    { id: 'catupiry', name: 'Borda Catupiry Original', price: 12.00 },
    { id: 'cheddar', name: 'Borda Cheddar Cremoso Artesanal', price: 12.00 },
    { id: 'vulcao-catupiry', name: 'Borda Vulcão de Catupiry', price: 16.00 },
    { id: 'chocolate', name: 'Borda Doce: Chocolate ao Leite', price: 14.00 }
  ],

  // Opções de Brinde para tamanhos Super (40cm) e Max (45cm)
  freeGiftOptions: [
    'Guaraná Antarctica 2 Litros (Grátis)',
    'Coca-Cola Original 2 Litros (Grátis)',
    'Coca-Cola Sem Açúcar 2 Litros (Grátis)',
    'Fanta Laranja 2 Litros (Grátis)',
    'Não desejo brinde'
  ],

  // Ponto da carne para Burgers
  burgerDoneness: [
    'Ao Ponto (Rosado e muito suculento - Recomendado)',
    'Ao Ponto para Bem',
    'Bem Passado',
    'Ponto Menos (Mais avermelhado)'
  ],

  // Adicionais para Burgers
  burgerExtras: [
    { id: 'extra-bacon', name: 'Bacon Artesanal Defumado Extra (+R$ 6,00)', price: 6.00 },
    { id: 'extra-cheese', name: 'Cheddar Inglês Melt Extra (+R$ 5,00)', price: 5.00 },
    { id: 'extra-patty', name: 'Blend Angus Smash Extra 100g (+R$ 9,00)', price: 9.00 },
    { id: 'extra-aioli', name: 'Maionese de Alho Confitado Trufada (+R$ 4,50)', price: 4.50 }
  ],

  // Lista de Categorias disponíveis para os filtros (100% sem emojis)
  categories: [
    { id: 'todos', name: 'TODOS OS ITENS' },
    { id: 'pizzas-tradicionais', name: 'PIZZAS TRADICIONAIS' },
    { id: 'pizzas-especiais', name: 'PIZZAS ESPECIAIS' },
    { id: 'burgers', name: 'BURGERS ARTESANAIS' },
    { id: 'entradas', name: 'PETISCOS & ENTRADAS' },
    { id: 'pizzas-doces', name: 'PIZZAS DOCES' },
    { id: 'bebidas', name: 'BEBIDAS' }
  ],

  // Produtos do Cardápio
  products: [
    // ==================== PIZZAS TRADICIONAIS ====================
    {
      id: 1,
      category: 'pizzas-tradicionais',
      categoryName: 'Pizzas Tradicionais',
      name: 'Margherita Verace',
      img: 'assets/images/hero-pizza.png',
      description: 'Molho de tomate San Marzano D.O.P., mozzarella de búfala artesanal, azeite extravirgem italiano e folhas frescas de manjericão colhido no dia.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [58.90, 68.90, 79.90, 89.90],
      tags: ['favorita', 'veggie'],
      isPizza: true
    },
    {
      id: 2,
      category: 'pizzas-tradicionais',
      categoryName: 'Pizzas Tradicionais',
      name: 'Calabresa & Cebola Roxa Caramelizada',
      img: 'assets/images/pizza-calabresa.jpg',
      description: 'Molho rústico da casa, generosa cobertura de calabresa artesanal levemente defumada, fatias finas de cebola roxa assada na lenha e orégano fresco.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [56.90, 66.90, 78.90, 88.90],
      tags: ['favorita'],
      isPizza: true
    },
    {
      id: 3,
      category: 'pizzas-tradicionais',
      categoryName: 'Pizzas Tradicionais',
      name: 'Muçarela Clássica Bingen',
      img: 'assets/images/hero-pizza.png',
      description: 'Molho artesanal de tomate pelado, queijo muçarela premium derretido em ponto de gratinação perfeita no forno a lenha, rodelas de tomate e azeitonas pretas.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [54.90, 64.90, 75.90, 85.90],
      tags: ['veggie'],
      isPizza: true
    },
    {
      id: 4,
      category: 'pizzas-tradicionais',
      categoryName: 'Pizzas Tradicionais',
      name: 'Frango Desfiado com Catupiry Original',
      img: 'assets/images/pizza-ingredients.png',
      description: 'Filé de frango cozido lentamente, desfiado e temperado com ervas frescas, coberto por generosa espiral de autêntico requeijão Catupiry® cremoso.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [59.90, 69.90, 82.90, 92.90],
      tags: ['favorita'],
      isPizza: true
    },
    {
      id: 5,
      category: 'pizzas-tradicionais',
      categoryName: 'Pizzas Tradicionais',
      name: 'Quatro Queijos da Serra',
      img: 'assets/images/hero-pizza.png',
      description: 'Blend refinado de Muçarela da serra, Provolone defumado, Parmesão maturado 12 meses e cremoso Catupiry com toque sutil de orégano.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [62.90, 72.90, 84.90, 94.90],
      tags: ['veggie'],
      isPizza: true
    },
    {
      id: 6,
      category: 'pizzas-tradicionais',
      categoryName: 'Pizzas Tradicionais',
      name: 'Portuguesa Bingen',
      img: 'assets/images/pizza-ingredients.png',
      description: 'Presunto cozido fatiado fininho, muçarela, ovos caipiras cozidos, cebola roxa, ervilhas frescas, azeitonas pretas portuguesas e azeite extravirgem.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [59.90, 69.90, 81.90, 91.90],
      tags: [],
      isPizza: true
    },

    // ==================== PIZZAS ESPECIAIS DO CHEF ====================
    {
      id: 101,
      category: 'pizzas-especiais',
      categoryName: 'Pizzas Especiais do Chef',
      name: 'Burrata al Pesto & San Marzano',
      img: 'assets/images/pizza-burrata.jpg',
      description: 'Massa fermentada por 48 horas, molho de tomate San Marzano D.O.P., bola inteira de burrata cremosa fresca ao centro, gotas de pesto genovês artesanal e tomatinhos tostados.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [69.90, 79.90, 92.90, 104.90],
      tags: ['chef', 'veggie', 'favorita'],
      isPizza: true
    },
    {
      id: 102,
      category: 'pizzas-especiais',
      categoryName: 'Pizzas Especiais do Chef',
      name: 'Pepperoni Piccante com Hot Honey',
      img: 'assets/images/pizza-calabresa.jpg',
      description: 'Fatias crocantes de pepperoni artesanal italiano assadas em alta temperatura, queijo fior di latte e finalização com mel silvestre infundido com pimenta habanero da casa.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [66.90, 76.90, 89.90, 99.90],
      tags: ['chef', 'piccante'],
      isPizza: true
    },
    {
      id: 103,
      category: 'pizzas-especiais',
      categoryName: 'Pizzas Especiais do Chef',
      name: 'Funghi & Trufa Negra de Petrópolis',
      img: 'assets/images/pizza-ingredients.png',
      description: 'Mix de cogumelos Paris, Shimeji e Portobello salteados no azeite de alho, queijo taleggio derretido, azeite aromatizado com trufas negras e raspas de parmesão.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [68.90, 78.90, 91.90, 102.90],
      tags: ['chef', 'veggie'],
      isPizza: true
    },
    {
      id: 104,
      category: 'pizzas-especiais',
      categoryName: 'Pizzas Especiais do Chef',
      name: 'Prosciutto di Parma & Rúcula Selvagem',
      img: 'assets/images/hero-pizza.png',
      description: 'Fior di latte assado, lascas de presunto tipo Parma curado por 18 meses, folhas frescas de rúcula selvagem crocante, raspas generosas de grana padano e redução balsâmica.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [72.90, 82.90, 95.90, 107.90],
      tags: ['chef', 'favorita'],
      isPizza: true
    },
    {
      id: 105,
      category: 'pizzas-especiais',
      categoryName: 'Pizzas Especiais do Chef',
      name: 'Gorgonzola Dolce & Geleia de Figo',
      img: 'assets/images/pizza-ingredients.png',
      description: 'Equilíbrio inesquecível entre o queijo gorgonzola cremoso, muçarela especial, geleia de figos frescos cozidos na lenha e nozes tostadas crocantes.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)', 'Super 40 cm (10 fatias)', 'Max 45 cm (12 fatias)'],
      price: [67.90, 77.90, 90.90, 101.90],
      tags: ['chef', 'veggie'],
      isPizza: true
    },

    // ==================== BURGERS ARTESANAIS ====================
    {
      id: 201,
      category: 'burgers',
      categoryName: 'Burgers Artesanais',
      name: 'Bingen Smash Burger Supremo',
      img: 'assets/images/burger-feature.png',
      description: '2x Smash burgers de 100g de blend Black Angus prensados com crostinha caramelizada, queijo cheddar inglês derretido, tiras de bacon crocante e maionese secreta no pão brioche amanteigado tostado.',
      sizes: ['Individual com Fritas Rústicas'],
      price: [42.90],
      tags: ['favorita', 'chef'],
      isBurger: true
    },
    {
      id: 202,
      category: 'burgers',
      categoryName: 'Burgers Artesanais',
      name: 'Trufado Bacon Burger',
      img: 'assets/images/burger-close.png',
      description: 'Hambúrguer alto de 180g de costela angus assado no ponto certo, fatias de queijo gouda, cebola caramelizada no vinho tinto, bacon artesanal e aioli trufado em pão brioche dourado.',
      sizes: ['Individual com Fritas Rústicas'],
      price: [46.90],
      tags: ['chef'],
      isBurger: true
    },
    {
      id: 203,
      category: 'burgers',
      categoryName: 'Burgers Artesanais',
      name: 'Classic Cheeseburger Duplo',
      img: 'assets/images/burger-beer.png',
      description: 'Dois discos de 90g de pura carne bovina, quádruplo queijo prato derretido, picles artesanais crocantes, cebola picadinha, ketchup rústico e mostarda dijon no brioche.',
      sizes: ['Individual com Fritas Rústicas'],
      price: [38.90],
      tags: [],
      isBurger: true
    },
    {
      id: 204,
      category: 'burgers',
      categoryName: 'Burgers Artesanais',
      name: 'Veggie Portobello Burger',
      img: 'assets/images/burger-feature.png',
      description: 'Cogumelo Portobello grelhado na brasa recheado com queijo de cabra e ervas, tomate assado no forno a lenha, rúcula e pesto de manjericão no pão australiano artesanal.',
      sizes: ['Individual com Fritas Rústicas'],
      price: [41.90],
      tags: ['veggie'],
      isBurger: true
    },

    // ==================== ENTRADAS & PETISCOS ====================
    {
      id: 301,
      category: 'entradas',
      categoryName: 'Entradas & Petiscos',
      name: 'Arancini al Taleggio (6 unidades)',
      img: 'assets/images/arancini.jpg',
      description: 'Bolinhos crocantes italianos de risoto de açafrão empanados em farinha panko, recheados com queijo taleggio derretido. Acompanha molho pomodoro rústico da casa.',
      sizes: ['Porção com 6 unidades'],
      price: [36.90],
      tags: ['favorita', 'veggie'],
      isSnack: true
    },
    {
      id: 302,
      category: 'entradas',
      categoryName: 'Entradas & Petiscos',
      name: 'Focaccia Artesanal com Alecrim & Sal Maldon',
      img: 'assets/images/pizza-ingredients.png',
      description: 'Massa alta e aerada de fermentação natural, regada com azeite extravirgem toscano abundante, alecrim fresco e flocos de sal marinho Maldon. Acompanha antepasto de beringela.',
      sizes: ['Porção para compartilhar (4 fatias)'],
      price: [28.90],
      tags: ['veggie'],
      isSnack: true
    },
    {
      id: 303,
      category: 'entradas',
      categoryName: 'Entradas & Petiscos',
      name: 'Batatas Rústicas com Alecrim & Aioli da Casa',
      img: 'assets/images/burger-beer.png',
      description: 'Batatas especiais cortadas rusticamente com casca, assadas e fritas com dentes de alho confitado e alecrim. Acompanha maionese caseira aioli de alho assado.',
      sizes: ['Porção Generosa (400g)'],
      price: [29.90],
      tags: ['veggie'],
      isSnack: true
    },

    // ==================== PIZZAS DOCES ====================
    {
      id: 401,
      category: 'pizzas-doces',
      categoryName: 'Pizzas Doces',
      name: 'Nutella Pura com Morangos Frescos',
      img: 'assets/images/hero-pizza.png',
      description: 'Massa fininha e crocante, camada generosa de autêntica Nutella® de avelã, morangos frescos fatiados e salpicada com lascas de avelãs tostadas.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)'],
      price: [58.90, 68.90],
      tags: ['favorita', 'veggie'],
      isPizza: true
    },
    {
      id: 402,
      category: 'pizzas-doces',
      categoryName: 'Pizzas Doces',
      name: 'Banana com Canela & Doce de Leite Viçosa',
      img: 'assets/images/pizza-ingredients.png',
      description: 'Fatias de banana prata caramelizadas na lenha, o premiado Doce de Leite Viçosa cremoso e perfume de canela em pó com toque de queijo muçarela suave.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)'],
      price: [52.90, 62.90],
      tags: ['veggie'],
      isPizza: true
    },
    {
      id: 403,
      category: 'pizzas-doces',
      categoryName: 'Pizzas Doces',
      name: 'Romeu & Julieta da Serra',
      img: 'assets/images/hero-pizza.png',
      description: 'Goiabada cascão cremosa artesanal derretida sobre camada equilibrada de queijo minas curado e muçarela da serra.',
      sizes: ['Média 30 cm (6 fatias)', 'Grande 35 cm (8 fatias)'],
      price: [49.90, 59.90],
      tags: ['veggie'],
      isPizza: true
    },

    // ==================== BEBIDAS ====================
    {
      id: 501,
      category: 'bebidas',
      categoryName: 'Bebidas & Cervejas',
      name: 'Coca-Cola Original 2 Litros',
      img: 'assets/images/burger-beer.png',
      description: 'Garrafa PET 2L gelada.',
      sizes: ['Garrafa 2 Litros'],
      price: [15.00],
      tags: [],
      isDrink: true
    },
    {
      id: 502,
      category: 'bebidas',
      categoryName: 'Bebidas & Cervejas',
      name: 'Guaraná Antarctica 2 Litros',
      img: 'assets/images/burger-beer.png',
      description: 'Garrafa PET 2L gelada.',
      sizes: ['Garrafa 2 Litros'],
      price: [14.00],
      tags: [],
      isDrink: true
    },
    {
      id: 503,
      category: 'bebidas',
      categoryName: 'Bebidas & Cervejas',
      name: 'Coca-Cola Zero 2 Litros',
      img: 'assets/images/burger-beer.png',
      description: 'Garrafa PET 2L gelada zero açúcar.',
      sizes: ['Garrafa 2 Litros'],
      price: [15.00],
      tags: [],
      isDrink: true
    },
    {
      id: 504,
      category: 'bebidas',
      categoryName: 'Bebidas & Cervejas',
      name: 'Cerveja Artesanal Bingen IPA 500ml',
      img: 'assets/images/burger-beer.png',
      description: 'India Pale Ale local da serra de Petrópolis, amargor marcante e notas cítricas aromáticas. Garrafa 500ml gelada.',
      sizes: ['Garrafa 500ml'],
      price: [24.00],
      tags: ['favorita'],
      isDrink: true
    },
    {
      id: 505,
      category: 'bebidas',
      categoryName: 'Bebidas & Cervejas',
      name: 'Refrigerante Lata 350ml (Coca-Cola / Guaraná)',
      img: 'assets/images/burger-beer.png',
      description: 'Lata 350ml trincando de gelada. Escolha a opção nas observações.',
      sizes: ['Lata 350ml'],
      price: [7.50],
      tags: [],
      isDrink: true
    },
    {
      id: 506,
      category: 'bebidas',
      categoryName: 'Bebidas & Cervejas',
      name: 'Água Mineral San Pellegrino 500ml',
      img: 'assets/images/burger-beer.png',
      description: 'Água mineral gaseificada italiana natural. Garrafa de vidro.',
      sizes: ['Garrafa 500ml'],
      price: [16.00],
      tags: [],
      isDrink: true
    }
  ]
};

// Exporta globalmente para o cardapio.js
window.cardapioData = cardapioData;
