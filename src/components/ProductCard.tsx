import { useApp } from "../contexts/AppContext";
import type { Product } from "../data/products";

interface Props {
  product: Product;
  onDetails?: (product: Product) => void;
  compact?: boolean;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars text-xs">
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function ProductCard({ product, onDetails, compact = false }: Props) {
  const { addToCart } = useApp();

  const discountedPrice = product.promo
    ? product.price
    : null;

  return (
    <div className="card-glow rounded-lg overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: compact ? 160 : 200 }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,15,30,0.7) 0%, transparent 50%)" }} />

        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {product.promo && (
            <span className="tag tag-promo">-{product.promo.discount}%</span>
          )}
          {product.isNew && (
            <span className="tag tag-new">NEW</span>
          )}
          {product.popular && !product.promo && (
            <span className="tag tag-hot">🔥 TOP</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-display font-semibold text-white text-sm leading-tight">{product.name}</h3>
          {!compact && (
            <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Stars rating={product.rating} />
          <span className="text-slate-600 text-[10px]">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            {product.promo && (
              <p className="text-slate-600 text-[11px] line-through">R$ {product.promo.originalPrice.toFixed(2)}</p>
            )}
            <p className="font-display font-bold text-base" style={{ color: product.promo ? "#39ff14" : "#00f5ff" }}>
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-1">
            {onDetails && (
              <button
                onClick={() => onDetails(product)}
                className="p-2 rounded text-slate-400 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                title="Ver detalhes">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => addToCart(product)}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "#0f0f1e", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="loading-skeleton h-48 w-full" />
      <div className="p-4 space-y-2">
        <div className="loading-skeleton h-4 w-3/4" />
        <div className="loading-skeleton h-3 w-full" />
        <div className="loading-skeleton h-3 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="loading-skeleton h-5 w-16" />
          <div className="loading-skeleton h-8 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
