import { useState } from "react";

const TABS = ["História", "Missão", "Equipe"] as const;
type Tab = typeof TABS[number];

const team = [
  { name: "Ricardo 'Pixel' Santos", role: "Chef & Fundador", emoji: "👨‍🍳" },
  { name: "Ana 'Controller' Ferreira", role: "Operações", emoji: "👩‍💼" },
  { name: "Bruno 'Level99' Costa", role: "Chefe de Cozinha", emoji: "🧑‍🍳" },
  { name: "Carla 'XP' Lima", role: "Atendimento", emoji: "👩‍💻" },
];

export default function About() {
  const [tab, setTab] = useState<Tab>("História");

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      {/* Header + tabs */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-cyan mb-1">// NOSSA HISTÓRIA</p>
          <h1 className="font-display font-black text-2xl text-white mb-4">
            Sobre a <span className="neon-text-pink">Pixel Burguer</span>
          </h1>
          <div className="flex gap-1.5">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded text-xs font-display font-semibold transition-all
                  ${tab === t ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                style={{
                  background: tab === t ? "rgba(255,0,110,0.1)" : "rgba(255,255,255,0.03)",
                  border: tab === t ? "1px solid rgba(255,0,110,0.3)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          {tab === "História" && (
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-xs font-pixel neon-text-pink mb-3">// 2024 — ORIGEM</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  A Pixel Burguer nasceu em 2024 da fusão de duas paixões: gastronomia de alto nível e a cultura gamer. Ricardo Santos, chef por vocação e gamer desde criança, criou um espaço onde cada detalhe conta uma história.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  O cardápio é tratado como um inventário de itens raros. Cada produto tem seu próprio lore, ingredientes selecionados a dedo e um sabor desenvolvido durante meses.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Em menos de um ano: referência em São Paulo, +50k pedidos entregues, e avaliação 4.9 estrelas. O MODO DEUS — nosso sabor da casa — virou lenda.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,245,255,0.12)" }}>
                <img src="https://images.unsplash.com/photo-1533236897111-3e94666b2edf?w=600&h=380&fit=crop&auto=format"
                  alt="Arcade" className="w-full object-cover" style={{ height: 280 }} />
              </div>
            </div>
          )}

          {tab === "Missão" && (
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { icon: "🎯", title: "Missão", desc: "Transformar cada pedido em uma experiência memorável, unindo ingredientes premium com a paixão pelos games." },
                { icon: "⚡", title: "Visão", desc: "Ser a lanchonete mais inovadora do Brasil, onde gastronomia e cultura gamer se encontram de forma única e autêntica." },
                { icon: "💎", title: "Valores", desc: "Qualidade sem concessão, criatividade constante, respeito pelo cliente e compromisso com a autenticidade de cada receita." },
              ].map(v => (
                <div key={v.title} className="card-glow rounded-xl p-5">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-display font-bold text-white text-sm mb-2">{v.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
                </div>
              ))}
              <div className="sm:col-span-3 rounded-xl p-5" style={{ background: "rgba(255,0,110,0.05)", border: "1px solid rgba(255,0,110,0.12)" }}>
                <h3 className="font-display font-bold text-white text-sm mb-3">Diferenciais</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {["🥩 Carnes artesanais moídas diariamente", "🍞 Pães frescos assados na própria cozinha", "🧪 Molhos exclusivos do chef", "🎮 Interface de pedido gamificada", "⚡ Entrega em até 45 minutos", "♻️ Embalagens sustentáveis"].map(d => (
                    <div key={d} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#00f5ff" }} />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "Equipe" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {team.map(member => (
                <div key={member.name} className="card-glow rounded-xl p-5 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
                    style={{ background: "rgba(255,0,110,0.1)", border: "1px solid rgba(255,0,110,0.2)" }}>
                    {member.emoji}
                  </div>
                  <h3 className="font-display font-semibold text-white text-xs leading-tight mb-1">{member.name}</h3>
                  <p className="text-slate-500 text-[11px]">{member.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
