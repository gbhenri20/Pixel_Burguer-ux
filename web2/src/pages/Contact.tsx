import { useState } from "react";
import { useApp } from "../contexts/AppContext";

export default function Contact() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Mensagem enviada! Entraremos em contato em breve. 📩");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-cyan mb-1">// FALE CONOSCO</p>
          <h1 className="font-display font-black text-2xl text-white">Contato</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card-glow rounded-xl p-4">
                <h3 className="font-display font-bold text-white text-xs mb-3">Informações</h3>
                <div className="space-y-3">
                  {[
                    { icon: "📍", label: "Endereço", value: "Av. dos Games, 404\nPixel District, SP" },
                    { icon: "📞", label: "Telefone", value: "(11) 3000-0404" },
                    { icon: "✉️", label: "E-mail", value: "ola@pixelburguer.com" },
                    { icon: "🕐", label: "Horário", value: "Seg–Sex: 11h–23h\nSáb–Dom: 11h–00h" },
                  ].map(item => (
                    <div key={item.label} className="flex gap-3">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <p className="text-[10px] font-display font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-slate-300 text-xs whitespace-pre-line leading-relaxed">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-glow rounded-xl p-4">
                <h3 className="font-display font-bold text-white text-xs mb-3">Redes Sociais</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Instagram", "TikTok", "Twitter", "YouTube"].map(s => (
                    <a key={s} href="#"
                      className="flex items-center gap-2 p-2 rounded text-xs text-slate-400 hover:text-white transition-all hover:bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="w-4 h-4 rounded-full" style={{ background: "rgba(0,245,255,0.15)" }} />
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card-glow rounded-xl p-5">
                <h3 className="font-display font-bold text-white text-sm mb-4">Enviar Mensagem</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-display text-slate-400 mb-1">Nome</label>
                      <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Seu nome" /></div>
                    <div><label className="block text-xs font-display text-slate-400 mb-1">E-mail</label>
                      <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="seu@email.com" /></div>
                  </div>
                  <div><label className="block text-xs font-display text-slate-400 mb-1">Assunto</label>
                    <input required value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="Como podemos ajudar?" /></div>
                  <div><label className="block text-xs font-display text-slate-400 mb-1">Mensagem</label>
                    <textarea required rows={4} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Descreva sua mensagem..." /></div>
                  <button type="submit" className="btn-primary w-full py-2.5 text-sm">
                    Enviar Mensagem →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
