import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useApp } from "../contexts/AppContext";

const STEPS = [
  { icon: "🎮", label: "Pedido Recebido", desc: "Confirmado" },
  { icon: "👨‍🍳", label: "Preparando", desc: "Na cozinha" },
  { icon: "📦", label: "Pronto", desc: "Embalado" },
  { icon: "🛵", label: "A Caminho", desc: "Saiu" },
  { icon: "🏆", label: "Entregue", desc: "Bom apetite!" },
];

export default function OrderTracking() {
  const { lastOrder } = useApp();
  const [currentStep, setCurrentStep] = useState(lastOrder?.status ?? 1);

  useEffect(() => {
    if (!lastOrder) return;
    const interval = setInterval(() => {
      setCurrentStep(s => { if (s < STEPS.length - 1) return s + 1; clearInterval(interval); return s; });
    }, 8000);
    return () => clearInterval(interval);
  }, [lastOrder]);

  if (!lastOrder) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: "100%", background: "#080812" }}>
        <div className="text-5xl mb-4">🎮</div>
        <h2 className="font-display font-bold text-xl text-white mb-2">Nenhum pedido ativo</h2>
        <p className="text-slate-500 text-sm mb-6 text-center px-4">Faça um pedido para acompanhar em tempo real.</p>
        <Link to="/cardapio" className="btn-primary text-sm py-2.5 px-8">Ver cardápio</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-cyan mb-1">// ACOMPANHAR PEDIDO</p>
          <div className="flex items-center justify-between">
            <h1 className="font-display font-black text-2xl text-white">Pedido <span className="neon-text-pink">#{lastOrder.id}</span></h1>
            <p className="text-slate-400 text-xs">~{lastOrder.estimatedTime} min</p>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                background: "linear-gradient(90deg, #ff006e, #a855f7, #00f5ff)",
                boxShadow: "0 0 8px rgba(0,245,255,0.4)",
              }} />
          </div>
          <p className="text-right text-xs mt-1 font-display" style={{ color: "#39ff14" }}>
            {Math.round((currentStep / (STEPS.length - 1)) * 100)}% concluído
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-xl mx-auto px-6 py-5">
          {/* Steps */}
          <div className="card-glow rounded-xl p-5 mb-4">
            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all duration-500 ${i <= currentStep ? "opacity-100" : "opacity-30"}`}
                    style={{
                      background: i < currentStep ? "rgba(57,255,20,0.12)" : i === currentStep ? "rgba(255,0,110,0.12)" : "rgba(255,255,255,0.04)",
                      border: i < currentStep ? "1px solid rgba(57,255,20,0.3)" : i === currentStep ? "1px solid rgba(255,0,110,0.5)" : "1px solid rgba(255,255,255,0.07)",
                      boxShadow: i === currentStep ? "0 0 14px rgba(255,0,110,0.35)" : "none",
                    }}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-display font-semibold text-sm transition-colors ${i <= currentStep ? "text-white" : "text-slate-600"}`}>
                      {step.label}
                      {i === currentStep && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full animate-pulse-neon" style={{ background: "#ff006e" }} />}
                    </p>
                    <p className={`text-xs ${i <= currentStep ? "text-slate-400" : "text-slate-700"}`}>{step.desc}</p>
                  </div>
                  {i < currentStep && <span className="text-[10px] font-display" style={{ color: "#39ff14" }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="card-glow rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-slate-500 mb-0.5">Endereço</p><p className="text-white leading-relaxed">{lastOrder.address}</p></div>
              <div><p className="text-slate-500 mb-0.5">Pagamento</p><p className="text-white">{lastOrder.payment === "pix" ? "💠 Pix" : lastOrder.payment === "card" ? "💳 Cartão" : "💵 Dinheiro"}</p></div>
              <div><p className="text-slate-500 mb-0.5">Total</p><p className="font-display font-bold neon-text-cyan text-sm">R$ {lastOrder.total.toFixed(2)}</p></div>
            </div>
          </div>

          <Link to="/" className="btn-outline block text-center text-sm py-2.5">Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}
