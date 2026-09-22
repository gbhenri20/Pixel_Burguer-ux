export type Category = "burgers" | "sides" | "sandwiches" | "drinks" | "desserts" | "combos";

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  rating: number;
  reviews: number;
  featured: boolean;
  promo?: { originalPrice: number; discount: number };
  isNew?: boolean;
  popular?: boolean;
}

export const HOUSE_SPECIAL_ID = "pb-000";

export const products: Product[] = [
  {
    id: "pb-000",
    name: "MODO DEUS",
    category: "burgers",
    description: "O item mais raro do cardápio. Três smash patties 180g, queijo brie derretido, bacon de panceta curado 72h, molho trufado negro, cebola roxa confitada e nossa redução secreta de mostarda dijon com mel. Só para quem chegou no level máximo.",
    ingredients: ["3x Smash patty angus 180g", "Queijo brie derretido", "Panceta curada 72h", "Molho trufado negro", "Cebola roxa confitada", "Redução dijon + mel", "Pão brioche preto com gergelim dourado"],
    price: 67.9,
    image: "https://images.unsplash.com/photo-1554306297-0c86e837d24b?w=800&h=600&fit=crop&auto=format",
    rating: 5.0,
    reviews: 412,
    featured: true,
    popular: true,
    isNew: false,
  },
  {
    id: "pb-001",
    name: "Pixel Burger",
    category: "burgers",
    description: "O clássico da casa. Dois smash patties 150g, queijo americano derretido duplo, molho especial pixel, alface crocante e pickles artesanais.",
    ingredients: ["2x Smash patty 150g", "Queijo americano duplo", "Molho pixel especial", "Alface americana", "Pickles artesanais", "Pão brioche tostado"],
    price: 32.9,
    image: "https://images.unsplash.com/photo-1611309454921-16cef3438ee0?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    reviews: 1284,
    featured: true,
    popular: true,
  },
  {
    id: "pb-002",
    name: "Mega Bacon",
    category: "burgers",
    description: "Para os verdadeiros jogadores de nível hard. Patty 200g, bacon crocante duplo, queijo cheddar, onion rings e maionese defumada.",
    ingredients: ["Patty bovino 200g", "Bacon crocante duplo", "Queijo cheddar", "Onion rings", "Maionese defumada", "Pão potato tostado"],
    price: 38.9,
    image: "https://images.unsplash.com/photo-1651993841930-946a700c1524?w=600&h=400&fit=crop&auto=format",
    rating: 4.8,
    reviews: 876,
    featured: true,
    popular: true,
    promo: { originalPrice: 45.9, discount: 15 },
  },
  {
    id: "pb-003",
    name: "Chicken XP",
    category: "sandwiches",
    description: "Filé de frango crocante empanado, molho de parmesão com ervas, queijo suíço, rúcula e tomate confitado. Level up em sabor.",
    ingredients: ["Filé frango empanado crocante", "Molho parmesão com ervas", "Queijo suíço", "Rúcula", "Tomate confitado", "Pão ciabatta"],
    price: 29.9,
    image: "https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=600&h=400&fit=crop&auto=format",
    rating: 4.7,
    reviews: 654,
    featured: true,
    isNew: true,
  },
  {
    id: "pb-004",
    name: "Batata Power",
    category: "sides",
    description: "Batatas fritas rústicas com casca, temperadas com blend de especiarias pixel e servidas com molho ranch da casa.",
    ingredients: ["Batata rústica com casca", "Blend de especiarias pixel", "Molho ranch artesanal"],
    price: 16.9,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop&auto=format",
    rating: 4.6,
    reviews: 432,
    featured: true,
    popular: true,
  },
  {
    id: "pb-005",
    name: "Combo Gamer",
    category: "combos",
    description: "O pacote completo para sua sessão épica: Pixel Burger + Batata Power + Milkshake Level Up. Economia de R$ 12.",
    ingredients: ["Pixel Burger completo", "Batata Power porção média", "Milkshake 400ml sabor à escolha"],
    price: 54.9,
    image: "https://images.unsplash.com/photo-1687764628150-1dc8afa7ba52?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    reviews: 987,
    featured: true,
    popular: true,
    promo: { originalPrice: 66.9, discount: 18 },
  },
  {
    id: "pb-006",
    name: "Milkshake Level Up",
    category: "drinks",
    description: "Milkshake 500ml ultra cremoso em 4 sabores: Morango Neon, Chocolate Dark, Baunilha Retro ou Caramelo Boss.",
    ingredients: ["Sorvete premium 3 bolas", "Leite integral gelado", "Calda especial", "Chantilly"],
    price: 22.9,
    image: "https://images.unsplash.com/photo-1543845805-25c2940b5202?w=600&h=400&fit=crop&auto=format",
    rating: 4.8,
    reviews: 521,
    featured: true,
    isNew: true,
  },
  {
    id: "pb-007",
    name: "Double Dragon",
    category: "burgers",
    description: "Dois patties smash sobrepostos, queijo duplo prato e cheddar, jalapeños, molho sriracha da casa. Para quem não tem medo do fogo.",
    ingredients: ["2x Patty smash 120g", "Queijo prato + cheddar", "Jalapeños", "Molho sriracha", "Cebola caramelizada", "Pão brioche preto"],
    price: 41.9,
    image: "https://images.unsplash.com/photo-1662452883375-9226ea22c765?w=600&h=400&fit=crop&auto=format",
    rating: 4.7,
    reviews: 398,
    featured: false,
    isNew: false,
  },
  {
    id: "pb-008",
    name: "Boss Fight",
    category: "burgers",
    description: "O desafio final: patty artesanal 300g, trio de queijos, cogumelos salteados, bacon artesanal e molho trufado. Raro de se encontrar.",
    ingredients: ["Patty artesanal 300g", "Trio de queijos (gouda, brie, cheddar)", "Cogumelos salteados", "Bacon artesanal", "Molho trufado", "Pão brioche premium"],
    price: 52.9,
    image: "https://images.unsplash.com/photo-1761315413686-8467379d8715?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    reviews: 234,
    featured: false,
    promo: { originalPrice: 62.9, discount: 16 },
  },
  {
    id: "pb-009",
    name: "Onion Rings XL",
    category: "sides",
    description: "Anéis de cebola gigantes, empanamento crocante especial com panko japonês, servidos com molho chipotle.",
    ingredients: ["Cebola roxa grande", "Panko japonês", "Molho chipotle artesanal"],
    price: 18.9,
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&h=400&fit=crop&auto=format",
    rating: 4.5,
    reviews: 287,
    featured: false,
  },
  {
    id: "pb-010",
    name: "Combo Player 2",
    category: "combos",
    description: "Para curtir junto: 2 Chicken XP + 2 Batatas Power + 2 Refrigerantes. Perfeito para co-op.",
    ingredients: ["2x Chicken XP completo", "2x Batata Power média", "2x Refrigerante lata 350ml"],
    price: 89.9,
    image: "https://images.unsplash.com/photo-1692197275931-0793e08efcc1?w=600&h=400&fit=crop&auto=format",
    rating: 4.8,
    reviews: 156,
    featured: false,
    promo: { originalPrice: 109.9, discount: 18 },
  },
  {
    id: "pb-011",
    name: "Pixel Brownie",
    category: "desserts",
    description: "Brownie quente de chocolate belga com calda de caramelo salgado, sorvete de baunilha e granulado especial.",
    ingredients: ["Chocolate belga 70%", "Calda de caramelo salgado", "Sorvete de baunilha artesanal", "Granulado crocante"],
    price: 19.9,
    image: "https://images.unsplash.com/photo-1710915125520-2bb01788996a?w=600&h=400&fit=crop&auto=format",
    rating: 4.7,
    reviews: 312,
    featured: false,
    isNew: true,
  },
  {
    id: "pb-012",
    name: "Refrigerante Lata",
    category: "drinks",
    description: "Coca-Cola, Coca Zero, Guaraná, Fanta Laranja ou Fanta Uva. Geladas e na dose certa.",
    ingredients: ["Refrigerante 350ml"],
    price: 7.9,
    image: "https://images.unsplash.com/photo-1543845805-25c2940b5202?w=600&h=400&fit=crop&auto=format",
    rating: 4.3,
    reviews: 891,
    featured: false,
  },
  {
    id: "pb-013",
    name: "Hot Dog Arcade",
    category: "sandwiches",
    description: "Salsicha frankfurter premium grelhada, pão especial macio, mostarda dijon, ketchup artesanal e queijo derretido.",
    ingredients: ["Salsicha frankfurter premium", "Pão especial macio", "Mostarda dijon", "Ketchup artesanal", "Queijo derretido"],
    price: 24.9,
    image: "https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=600&h=400&fit=crop&auto=format",
    rating: 4.4,
    reviews: 198,
    featured: false,
  },
];

export const promotions = products.filter(p => p.promo);
export const featuredProducts = products.filter(p => p.featured);
export const popularProducts = products.filter(p => p.popular);

export const categoryLabels: Record<Category, string> = {
  burgers: "🍔 Hambúrgueres",
  sides: "🍟 Porções",
  sandwiches: "🌭 Lanches",
  drinks: "🥤 Bebidas",
  desserts: "🍰 Sobremesas",
  combos: "🎮 Combos",
};

export const COUPONS: Record<string, number> = {
  PIXEL10: 10,
  GAMER20: 20,
  LEVEL50: 50,
};
