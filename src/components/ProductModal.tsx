import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import type { Product } from "../data/products";

interface Props {
  product: Product | null;
  onClose: () => void;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function ProductModal({ product, onClose }: Props) {
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setQty(1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-lg overflow-hidden animate-float-up"
        style={{ background: "#0f0f1e", border: "1px solid rgba(0,245,255,0.2)", boxShadow: "0 0 40px rgba(0,245,255,0.1), 0 25px 50px rgba(0,0,0,0.6)" }}>
        {/* Image */}
        <div className="relative h-52">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0f0f1e 0%, transparent 60%)" }} />
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(0,0,0,0.5)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {product.promo && (
            <span className="tag tag-promo absolute bottom-3 left-3">-{product.promo.discount}%</span>
          )}
          {product.isNew && (
            <span className="tag tag-new absolute bottom-3 left-3">NEW</span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-display font-bold text-white text-lg">{product.name}</h2>
            <div className="text-right">
              {product.promo && (
                <p className="text-slate-600 text-xs line-through">R$ {product.promo.originalPrice.toFixed(2)}</p>
              )}
              <p className="font-display font-bold text-xl" style={{ color: product.promo ? "#39ff14" : "#00f5ff" }}>
                R$ {product.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Stars rating={product.rating} />
            <span className="text-slate-500 text-xs">{product.rating} ({product.reviews.toLocaleString()} avaliações)</span>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-4">{product.description}</p>

          <div className="mb-5">
            <h4 className="font-display text-xs font-semibold text-slate-400 tracking-widest uppercase mb-2">Ingredientes</h4>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map(ing => (
                <span key={ing} className="text-[11px] text-slate-400 px-2 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">
                −
              </button>
              <span className="w-8 text-center text-white font-display font-bold text-sm">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">
                +
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1 text-sm py-2.5">
              Adicionar • R$ {(product.price * qty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
