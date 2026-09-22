import { useState } from "react";
import { products } from "../data/products";
import type { Product } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

const combos = products.filter(p => p.category === "combos");

export default function Combos() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-purple mb-1">// COMBOS ESPECIAIS</p>
          <h1 className="font-display font-black text-2xl text-white">
            🎮 <span className="neon-text-cyan">Combos</span> Gamer
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {combos.map(p => (
              <ProductCard key={p.id} product={p} onDetails={setSelectedProduct} />
            ))}
          </div>

          <div className="rounded-xl p-5 text-center"
            style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
            <p className="font-pixel text-[9px] neon-text-purple mb-2">DICA DE PLAYER</p>
            <h3 className="font-display font-bold text-white text-base mb-2">Monte seu próprio combo</h3>
            <p className="text-slate-400 text-sm mb-3">Use cupons no carrinho para economizar na combinação que você quiser.</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {[["PIXEL10", "10%"], ["GAMER20", "20%"], ["LEVEL50", "50%"]].map(([code, val]) => (
                <span key={code} className="font-pixel text-[10px] px-2 py-1 rounded" style={{ color: "#39ff14", background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)" }}>
                  {code} — {val}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
