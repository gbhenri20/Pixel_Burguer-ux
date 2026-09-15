import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

const MOCK_ORDERS = [
  { id: "PB12345", date: "08/09/2024", total: 54.9, items: ["Combo Gamer", "Milkshake Level Up"] },
  { id: "PB12280", date: "02/09/2024", total: 32.9, items: ["Pixel Burger"] },
  { id: "PB12100", date: "25/08/2024", total: 89.9, items: ["Combo Player 2"] },
];

const TABS = ["Visão Geral", "Pedidos", "Endereços", "Config."] as const;
type Tab = typeof TABS[number];

export default function Profile() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Visão Geral");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: "100%", background: "#080812" }}>
        <div className="text-5xl mb-4">🎮</div>
        <h2 className="font-display font-bold text-xl text-white mb-2">Acesso restrito</h2>
        <p className="text-slate-500 text-sm mb-6">Faça login para acessar seu perfil.</p>
        <Link to="/login" className="btn-primary text-sm py-2.5 px-8">Entrar</Link>
      </div>
    );
  }

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                style={{ background: "linear-gradient(135deg, #ff006e, #a855f7)", boxShadow: "0 0 16px rgba(255,0,110,0.3)" }}>
                {user.avatar}
              </div>
              <div>
                <p className="font-pixel text-[9px] neon-text-cyan mb-0.5">// MINHA CONTA</p>
                <h1 className="font-display font-black text-xl text-white leading-tight">{user.name}</h1>
                <p className="text-slate-500 text-xs">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition-colors font-display flex items-center gap-1.5 px-3 py-1.5 rounded"
              style={{ border: "1px solid rgba(255,0,110,0.15)", background: "rgba(255,0,110,0.05)" }}>
              🚪 Sair
            </button>
          </div>
          {/* Tab bar */}
          <div className="flex gap-1.5 mt-4">
            {TABS.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded text-xs font-display font-semibold transition-all
                  ${activeTab === t ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                style={{
                  background: activeTab === t ? "rgba(255,0,110,0.1)" : "rgba(255,255,255,0.03)",
                  border: activeTab === t ? "1px solid rgba(255,0,110,0.3)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-5xl mx-auto px-6 py-5">
          {activeTab === "Visão Geral" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[["Pedidos", MOCK_ORDERS.length], ["Total gasto", `R$ ${MOCK_ORDERS.reduce((s, o) => s + o.total, 0).toFixed(0)}`], ["Avaliação", "4.9★"]].map(([l, v]) => (
                  <div key={l as string} className="card-glow rounded-xl p-4 text-center">
                    <p className="font-display font-black text-xl text-white mb-1">{v}</p>
                    <p className="text-slate-500 text-xs">{l}</p>
                  </div>
                ))}
              </div>
              <div className="card-glow rounded-xl p-4">
                <h3 className="font-display font-bold text-white text-sm mb-3">Dados Pessoais</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[["Nome", user.name], ["E-mail", user.email], ["Telefone", user.phone || "Não cadastrado"], ["Membro desde", "Setembro 2024"]].map(([l, v]) => (
                    <div key={l}><p className="text-xs text-slate-500 font-display mb-0.5">{l}</p><p className="text-white text-sm">{v}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Pedidos" && (
            <div className="space-y-3">
              {MOCK_ORDERS.map(order => (
                <div key={order.id} className="card-glow rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold text-white text-sm">#{order.id}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">{order.date}</span>
                      <span className="tag tag-new">Entregue</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mb-2">{order.items.join(", ")}</p>
                  <span className="font-display font-bold neon-text-cyan text-sm">R$ {order.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Endereços" && (
            <div className="space-y-3">
              <div className="card-glow rounded-xl p-4">
                <div className="flex justify-between mb-1">
                  <span className="text-white text-sm font-display font-semibold">Casa</span>
                  <span className="tag tag-new">Principal</span>
                </div>
                <p className="text-slate-400 text-xs">Av. dos Games, 404 — Pixel District</p>
                <p className="text-slate-400 text-xs">São Paulo - SP, 01234-567</p>
              </div>
              <button className="btn-outline text-xs py-2 px-4">+ Adicionar endereço</button>
            </div>
          )}

          {activeTab === "Config." && (
            <div className="card-glow rounded-xl p-4 space-y-3">
              {[
                { label: "Notificações por e-mail", on: true },
                { label: "Notificações push", on: false },
                { label: "Newsletter semanal", on: false },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <p className="text-white text-xs font-display">{item.label}</p>
                  <div className={`w-9 h-5 rounded-full relative cursor-pointer ${item.on ? "bg-pink-600" : "bg-slate-700"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.on ? "left-4" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
