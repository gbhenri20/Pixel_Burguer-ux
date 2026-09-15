import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { featuredProducts, promotions, products, HOUSE_SPECIAL_ID } from "../data/products";
import ProductCard, { ProductSkeleton } from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useApp } from "../contexts/AppContext";
import type { Product } from "../data/products";

const houseSpecial = products.find(p => p.id === HOUSE_SPECIAL_ID)!;

/* ── Section 1: Hero ── */
function HeroSection() {
  const { addToCart } = useApp();
  return (
    <section className="snap-section hero-gradient relative flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 grid-scanlines opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ff006e, transparent)" }} />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #00f5ff, transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div className="animate-float-up">
            <span className="tag tag-hot mb-4 inline-flex">🎮 Level Up Edition</span>
            <h1 className="font-display font-black text-4xl sm:text-5xl xl:text-6xl leading-tight text-white mb-4">
              Seu Próximo<br />
              <span className="neon-text-pink">Nível de</span><br />
              <span className="neon-text-cyan">Sabor</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              Na Pixel Burguer, cada pedido é uma missão épica.
              Ingredientes premium, receitas exclusivas.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/cardapio" className="btn-primary text-sm py-3 px-6">🍔 Ver Cardápio</Link>
              <Link to="/cardapio" className="btn-outline text-sm py-3 px-6">🎮 Montar Pedido</Link>
            </div>
            <div className="flex gap-8 pt-6 border-t border-white/5">
              {[["4.9★", "Avaliação"], ["50k+", "Pedidos"], ["35min", "Entrega média"]].map(([v, l]) => (
                <div key={l}><p className="font-display font-bold text-lg text-white">{v}</p><p className="text-slate-500 text-xs">{l}</p></div>
              ))}
            </div>
          </div>

          {/* MODO DEUS highlight card */}
          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-25 pointer-events-none"
              style={{ background: "radial-gradient(circle, #ff006e 0%, #a855f7 50%, transparent 80%)" }} />
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ border: "1px solid rgba(255,0,110,0.3)" }}
              onClick={() => addToCart(houseSpecial)}>
              <img src={houseSpecial.image} alt={houseSpecial.name}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ height: 380 }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,18,0.96) 0%, rgba(8,8,18,0.3) 55%, transparent 100%)" }} />

              {/* Badge */}
              <div className="absolute top-4 right-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-center"
                  style={{ background: "rgba(255,0,110,0.15)", border: "2px solid rgba(255,0,110,0.5)", boxShadow: "0 0 20px rgba(255,0,110,0.4)" }}>
                  <span className="font-pixel text-[6px] leading-tight neon-text-pink text-center">ITEM<br/>RARO</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-pixel text-[10px] neon-text-green mb-1 animate-pulse-neon">// SABOR DA CASA</p>
                <h3 className="font-display font-black text-2xl text-white mb-1">{houseSpecial.name}</h3>
                <div className="stars text-sm mb-3">★★★★★</div>
                <div className="flex items-center justify-between">
                  <p className="font-display font-black text-2xl neon-text-cyan">R$ {houseSpecial.price.toFixed(2)}</p>
                  <div className="btn-primary text-xs py-2 px-4 pointer-events-none">Adicionar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <svg className="w-4 h-4 text-slate-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

/* ── Section 2: MODO DEUS — House Special ── */
function HouseSpecialSection() {
  const { addToCart } = useApp();
  return (
    <section className="snap-section relative flex flex-col justify-center overflow-hidden"
      style={{ background: "#05050e" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,0,110,0.08) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 grid-scanlines opacity-15" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-8 blur-3xl opacity-30 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, #ff006e, #a855f7)" }} />
            <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,0,110,0.25)", boxShadow: "0 0 60px rgba(255,0,110,0.12)" }}>
              <img src={houseSpecial.image} alt={houseSpecial.name} className="w-full object-cover" style={{ height: 340 }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,0,110,0.08) 0%, transparent 60%)" }} />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,0,110,0.5))" }} />
              <p className="font-pixel text-[9px] neon-text-pink tracking-widest">SABOR DA CASA</p>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(255,0,110,0.5), transparent)" }} />
            </div>

            <h2 className="font-display font-black text-5xl sm:text-6xl text-white mb-2 tracking-tight">
              MODO
            </h2>
            <h2 className="font-display font-black text-5xl sm:text-6xl mb-4 tracking-tight"
              style={{ color: "#ff006e", textShadow: "0 0 30px rgba(255,0,110,0.7), 0 0 60px rgba(255,0,110,0.3)" }}>
              DEUS
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <span className="stars text-base">★★★★★</span>
              <span className="text-slate-400 text-xs">5.0 ({houseSpecial.reviews.toLocaleString()} avaliações)</span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">{houseSpecial.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {houseSpecial.ingredients.map(ing => (
                <span key={ing} className="text-[11px] text-slate-400 px-2 py-1 rounded"
                  style={{ background: "rgba(255,0,110,0.07)", border: "1px solid rgba(255,0,110,0.15)" }}>
                  {ing}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <p className="font-display font-black text-3xl neon-text-cyan">R$ {houseSpecial.price.toFixed(2)}</p>
              <button onClick={() => addToCart(houseSpecial)} className="btn-primary text-sm py-3 px-6">
                🏆 Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section 3: Featured carousel ── */
function FeaturedSection() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const intervalRef = useRef<number>(0);
  const others = featuredProducts.filter(p => p.id !== HOUSE_SPECIAL_ID);

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    intervalRef.current = window.setInterval(() => setIndex(i => (i + 1) % Math.max(1, others.length - 2)), 4500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const visibleCount = 3;

  return (
    <section className="snap-section flex flex-col justify-center section-gradient overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-pixel text-[9px] neon-text-cyan mb-1">// DESTAQUES</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Produtos em <span className="neon-text-cyan">Destaque</span></h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {Array.from({ length: Math.max(1, others.length - visibleCount + 1) }).map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ width: i === index ? 20 : 6, background: i === index ? "#00f5ff" : "rgba(255,255,255,0.15)" }} />
              ))}
            </div>
            <div className="flex gap-1">
              {[{ dir: -1, icon: "‹" }, { dir: 1, icon: "›" }].map(b => (
                <button key={b.dir} onClick={() => { clearInterval(intervalRef.current); setIndex(i => Math.max(0, Math.min(others.length - visibleCount, i + b.dir))); }}
                  className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-white transition-all text-lg"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {b.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.slice(index, index + visibleCount).map(p => (
              <ProductCard key={p.id} product={p} onDetails={setSelectedProduct} compact />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Link to="/cardapio" className="btn-outline text-xs py-2 px-6">
            Ver cardápio completo →
          </Link>
        </div>
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}

/* ── Section 4: Promos + CTA ── */
function PromoSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const promos = promotions.filter(p => p.id !== HOUSE_SPECIAL_ID).slice(0, 3);
  return (
    <section className="snap-section flex flex-col justify-center overflow-hidden" style={{ background: "#080812" }}>
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Promos */}
          <div className="lg:col-span-3">
            <p className="font-pixel text-[9px] neon-text-green mb-1">// OFERTAS ATIVAS</p>
            <h2 className="font-display font-bold text-2xl text-white mb-5">Promoções <span className="neon-text-green">do Dia</span></h2>
            <div className="space-y-3">
              {promos.map(p => (
                <div key={p.id} className="card-glow rounded-lg p-3 flex items-center gap-4">
                  <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-white text-sm truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-slate-600 text-xs line-through">R$ {p.promo!.originalPrice.toFixed(2)}</span>
                      <span className="tag tag-promo">-{p.promo!.discount}%</span>
                    </div>
                  </div>
                  <p className="font-display font-bold text-sm whitespace-nowrap" style={{ color: "#39ff14" }}>
                    R$ {p.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/promocoes" className="inline-block mt-4 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-display">
              Ver todas as promoções →
            </Link>
          </div>

          {/* CTA arcade */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden relative" style={{ border: "1px solid rgba(255,0,110,0.2)" }}>
              <img src="https://images.unsplash.com/photo-1757444838044-d9dcb1bb3017?w=600&h=400&fit=crop&auto=format"
                alt="Arcade" className="w-full object-cover opacity-20" style={{ height: 300 }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                style={{ background: "linear-gradient(135deg, rgba(255,0,110,0.25) 0%, rgba(8,8,18,0.7) 100%)" }}>
                <p className="font-pixel text-[9px] neon-text-green mb-3 animate-pulse-neon">INSERT COIN</p>
                <h3 className="font-display font-black text-2xl text-white mb-3">
                  Faça seu<br /><span className="neon-text-pink">pedido agora</span>
                </h3>
                <Link to="/cardapio" className="btn-primary text-xs py-2.5 px-5">
                  🕹️ JOGAR AGORA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}

export default function Home() {
  return (
    <div className="snap-container" style={{ height: "100%" }}>
      <HeroSection />
      <HouseSpecialSection />
      <FeaturedSection />
      <PromoSection />
    </div>
  );
}
