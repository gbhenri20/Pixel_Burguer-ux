import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { COUPONS } from "../data/products";

export default function Cart() {
  const { cart, incrementItem, decrementItem, removeFromCart, subtotal, deliveryFee, discountAmount, cartTotal, applyCoupon, removeCoupon, showToast } = useApp();
  const [couponInput, setCouponInput] = useState("");
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const discount = COUPONS[code];
    if (discount) {
      applyCoupon(code, discount);
      showToast(`🎮 Cupom ${code} aplicado! ${discount}% de desconto!`);
      setCouponInput("");
    } else {
      showToast("Cupom inválido. Tente PIXEL10, GAMER20 ou LEVEL50", "error");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: "100%", background: "#080812" }}>
        <div className="text-6xl mb-4 animate-pulse-neon">🎮</div>
        <h2 className="font-display font-bold text-2xl text-white mb-2">Seu inventário está vazio!</h2>
        <p className="text-slate-500 text-sm mb-8 text-center max-w-xs px-4">
          Adicione itens do cardápio para começar sua aventura culinária.
        </p>
        <Link to="/cardapio" className="btn-primary text-sm py-3 px-8">🍔 Explorar cardápio</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-cyan mb-1">// INVENTÁRIO</p>
          <h1 className="font-display font-black text-2xl text-white">Meu <span className="neon-text-pink">Carrinho</span></h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map(item => (
                <div key={item.product.id} className="card-glow rounded-lg p-3 flex gap-3">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-white text-sm truncate">{item.product.name}</h3>
                    <p className="text-slate-500 text-xs mb-2 truncate">{item.product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        <button onClick={() => decrementItem(item.product.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">−</button>
                        <span className="w-7 text-center text-white font-display font-bold text-xs">{item.quantity}</span>
                        <button onClick={() => incrementItem(item.product.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">+</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-sm neon-text-cyan">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card-glow rounded-lg p-4 sticky top-0">
                <h3 className="font-display font-bold text-white text-xs mb-4 pb-2 border-b border-white/5">Resumo</h3>
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="text-white">R$ {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Entrega</span><span className="text-white">R$ {deliveryFee.toFixed(2)}</span></div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between"><span style={{ color: "#39ff14" }}>Desconto ({cart.discount}%)</span><span style={{ color: "#39ff14" }}>−R$ {discountAmount.toFixed(2)}</span></div>
                  )}
                </div>

                {cart.coupon ? (
                  <div className="flex items-center justify-between mb-4 p-2 rounded text-xs" style={{ background: "rgba(57,255,20,0.07)", border: "1px solid rgba(57,255,20,0.2)" }}>
                    <span style={{ color: "#39ff14" }}>🎮 {cart.coupon}</span>
                    <button onClick={removeCoupon} className="text-slate-500 hover:text-white">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-1.5 mb-4">
                    <input type="text" placeholder="Cupom" value={couponInput} onChange={e => setCouponInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleApplyCoupon()} className="text-xs py-1.5 px-2 flex-1" />
                    <button onClick={handleApplyCoupon} className="btn-outline text-[11px] py-1.5 px-2 whitespace-nowrap">Aplicar</button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/5 mb-4">
                  <span className="font-display font-bold text-white text-xs">Total</span>
                  <span className="font-display font-bold neon-text-cyan text-lg">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => navigate("/checkout")} className="btn-primary w-full text-xs py-2.5">
                  Ir para Pagamento →
                </button>
                <Link to="/cardapio" className="block text-center text-[11px] text-slate-500 hover:text-slate-300 transition-colors mt-2">
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
