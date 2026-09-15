import { Link, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useEffect } from "react";

export default function OrderConfirmation() {
  const { lastOrder } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lastOrder) navigate("/");
  }, [lastOrder, navigate]);

  if (!lastOrder) return null;

  return (
    <div className="flex items-center justify-center" style={{ height: "100%", background: "#080812" }}>
      <div className="max-w-sm w-full mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse-neon"
          style={{ background: "rgba(57,255,20,0.12)", border: "2px solid rgba(57,255,20,0.4)", boxShadow: "0 0 24px rgba(57,255,20,0.2)" }}>
          <span className="text-2xl">🏆</span>
        </div>

        <p className="font-pixel text-[9px] neon-text-green mb-2">// PEDIDO ENVIADO!</p>
        <h1 className="font-display font-black text-2xl text-white mb-4">
          Pedido Realizado<br />com Sucesso!
        </h1>

        <div className="card-glow rounded-xl p-4 text-left mb-5">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
            <span className="text-slate-400 text-xs">Pedido</span>
            <span className="font-display font-bold neon-text-cyan text-sm">#{lastOrder.id}</span>
          </div>
          <div className="space-y-1.5 mb-3">
            {lastOrder.items.slice(0, 3).map(item => (
              <div key={item.product.id} className="flex justify-between text-xs">
                <span className="text-slate-400">{item.quantity}× {item.product.name}</span>
                <span className="text-white">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t border-white/5 mb-3">
            <span className="text-white font-display font-bold text-xs">Total</span>
            <span className="neon-text-cyan font-display font-bold text-sm">R$ {lastOrder.total.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded" style={{ background: "rgba(255,0,110,0.07)", border: "1px solid rgba(255,0,110,0.13)" }}>
            <span>⏱️</span>
            <div>
              <p className="text-white text-xs font-semibold">Tempo estimado</p>
              <p className="text-slate-400 text-xs">{lastOrder.estimatedTime} minutos</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link to="/acompanhar" className="btn-primary py-2.5 text-sm">🎮 Acompanhar Pedido</Link>
          <Link to="/" className="btn-outline py-2.5 text-sm">Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}
