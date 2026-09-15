import { useState } from "react";
import { products } from "../data/products";
import type { Product } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useApp } from "../contexts/AppContext";

const promoProducts = products.filter(p => p.promo);

export default function Promotions() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useApp();
  const featured = promoProducts[0];
  const rest = promoProducts.slice(1);

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-green mb-1">// OFERTAS ESPECIAIS</p>
          <h1 className="font-display font-black text-2xl text-white">Promoções <span className="neon-text-green">Ativas</span></h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          {/* Featured */}
          {featured && (
            <div className="rounded-xl overflow-hidden mb-6 relative" style={{ border: "1px solid rgba(57,255,20,0.2)" }}>
              <img src={featured.image} alt={featured.name} className="w-full object-cover" style={{ height: 220 }} />
              <div className="absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: "linear-gradient(to top, rgba(8,8,18,0.95) 0%, rgba(8,8,18,0.4) 60%, transparent 100%)" }}>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="tag tag-promo">DESTAQUE</span>
                  <span className="tag tag-promo">−{featured.promo!.discount}% OFF</span>
                </div>
                <h2 className="font-display font-black text-xl text-white mb-1">{featured.name}</h2>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-slate-600 text-xs line-through">R$ {featured.promo!.originalPrice.toFixed(2)}</p>
                    <p className="font-display font-black text-xl" style={{ color: "#39ff14" }}>R$ {featured.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => addToCart(featured)} className="btn-primary text-xs py-2 px-4">Adicionar</button>
                </div>
              </div>
            </div>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {rest.map(p => (
                <ProductCard key={p.id} product={p} onDetails={setSelectedProduct} compact />
              ))}
            </div>
          )}

          {/* Coupons */}
          <div className="rounded-xl p-4" style={{ background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.1)" }}>
            <h3 className="font-display font-bold text-white text-sm mb-1">🎮 Cupons de desconto</h3>
            <p className="text-slate-500 text-xs mb-3">Aplique no carrinho durante o checkout:</p>
            <div className="flex flex-wrap gap-2">
              {[["PIXEL10", "10%"], ["GAMER20", "20%"], ["LEVEL50", "50%"]].map(([code, val]) => (
                <div key={code} className="flex items-center gap-2 px-3 py-1.5 rounded"
                  style={{ background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)" }}>
                  <span className="font-pixel text-[10px]" style={{ color: "#39ff14" }}>{code}</span>
                  <span className="text-slate-400 text-xs">{val} de desconto</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
