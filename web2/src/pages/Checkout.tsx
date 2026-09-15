import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

const STEPS = ["Identificação", "Endereço", "Pagamento", "Revisão"];

export default function Checkout() {
  const { cart, subtotal, deliveryFee, discountAmount, cartTotal, user, placeOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "cash">("pix");
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    cep: "", street: "", number: "", complement: "", neighborhood: "", city: "",
  });
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.phone;
    if (step === 1) return deliveryType === "pickup" || (form.cep && form.street && form.number && form.neighborhood && form.city);
    return true;
  };

  const handleFinish = () => {
    const address = deliveryType === "pickup" ? "Retirada no estabelecimento" : `${form.street}, ${form.number} — ${form.neighborhood}, ${form.city}`;
    placeOrder({ address, payment: paymentMethod });
    navigate("/confirmacao");
  };

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      {/* Step header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-cyan mb-2">// FINALIZAR PEDIDO</p>
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-bold transition-all"
                    style={{
                      background: i < step ? "#39ff14" : i === step ? "#ff006e" : "rgba(255,255,255,0.08)",
                      boxShadow: i === step ? "0 0 10px rgba(255,0,110,0.5)" : "none",
                      color: "white",
                    }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-display hidden sm:block ${i === step ? "text-white" : "text-slate-600"}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2" style={{ background: i < step ? "#39ff14" : "rgba(255,255,255,0.07)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="grid md:grid-cols-5 gap-5">
            <div className="md:col-span-3">
              <div className="card-glow rounded-xl p-5">
                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-white text-sm mb-2">Seus dados</h3>
                    <div><label className="block text-xs font-display text-slate-400 mb-1.5">Nome</label>
                      <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Player One" /></div>
                    <div><label className="block text-xs font-display text-slate-400 mb-1.5">E-mail</label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="player@email.com" /></div>
                    <div><label className="block text-xs font-display text-slate-400 mb-1.5">Telefone</label>
                      <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(11) 99999-0000" /></div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-white text-sm mb-2">Entrega</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {(["delivery", "pickup"] as const).map(type => (
                        <button key={type} onClick={() => setDeliveryType(type)}
                          className="p-2.5 rounded text-xs font-display font-semibold transition-all"
                          style={{
                            background: deliveryType === type ? "rgba(0,245,255,0.08)" : "rgba(255,255,255,0.03)",
                            border: deliveryType === type ? "1px solid rgba(0,245,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                            color: deliveryType === type ? "#00f5ff" : "#94a3b8",
                          }}>
                          {type === "delivery" ? "🛵 Entrega" : "🏪 Retirada"}
                        </button>
                      ))}
                    </div>
                    {deliveryType === "delivery" ? (
                      <div className="space-y-3">
                        <div><label className="block text-xs font-display text-slate-400 mb-1">CEP</label><input value={form.cep} onChange={e => set("cep", e.target.value)} placeholder="00000-000" /></div>
                        <div><label className="block text-xs font-display text-slate-400 mb-1">Rua</label><input value={form.street} onChange={e => set("street", e.target.value)} placeholder="Av. dos Games" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="block text-xs font-display text-slate-400 mb-1">Número</label><input value={form.number} onChange={e => set("number", e.target.value)} placeholder="404" /></div>
                          <div><label className="block text-xs font-display text-slate-400 mb-1">Complemento</label><input value={form.complement} onChange={e => set("complement", e.target.value)} placeholder="Apto" /></div>
                        </div>
                        <div><label className="block text-xs font-display text-slate-400 mb-1">Bairro</label><input value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} placeholder="Pixel District" /></div>
                        <div><label className="block text-xs font-display text-slate-400 mb-1">Cidade</label><input value={form.city} onChange={e => set("city", e.target.value)} placeholder="São Paulo" /></div>
                      </div>
                    ) : (
                      <div className="p-3 rounded text-xs text-slate-400"
                        style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.1)" }}>
                        📍 Av. dos Games, 404 — Pixel District, São Paulo<br />
                        <span className="text-slate-600">Pronto em ~20 minutos</span>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-white text-sm mb-2">Pagamento</h3>
                    {[
                      { id: "pix", icon: "💠", label: "Pix", desc: "Instantâneo e sem taxas" },
                      { id: "card", icon: "💳", label: "Cartão", desc: "Crédito ou débito" },
                      { id: "cash", icon: "💵", label: "Dinheiro", desc: "Na entrega" },
                    ].map(method => (
                      <button key={method.id} onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                        className="w-full flex items-center gap-3 p-3 rounded text-left transition-all"
                        style={{
                          background: paymentMethod === method.id ? "rgba(255,0,110,0.07)" : "rgba(255,255,255,0.03)",
                          border: paymentMethod === method.id ? "1px solid rgba(255,0,110,0.3)" : "1px solid rgba(255,255,255,0.07)",
                        }}>
                        <span className="text-lg">{method.icon}</span>
                        <div className="flex-1">
                          <p className={`text-xs font-display font-semibold ${paymentMethod === method.id ? "text-white" : "text-slate-400"}`}>{method.label}</p>
                          <p className="text-[11px] text-slate-600">{method.desc}</p>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: paymentMethod === method.id ? "#ff006e" : "rgba(255,255,255,0.15)" }}>
                          {paymentMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="font-display font-bold text-white text-sm mb-4">Revisão Final</h3>
                    <div className="space-y-2 mb-3">
                      {cart.items.map(item => (
                        <div key={item.product.id} className="flex justify-between text-xs">
                          <span className="text-slate-400">{item.quantity}× {item.product.name}</span>
                          <span className="text-white">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Entrega</span><span className="text-white">R$ {deliveryFee.toFixed(2)}</span></div>
                      {discountAmount > 0 && <div className="flex justify-between"><span style={{ color: "#39ff14" }}>Desconto</span><span style={{ color: "#39ff14" }}>−R$ {discountAmount.toFixed(2)}</span></div>}
                      <div className="flex justify-between font-bold pt-2 border-t border-white/5">
                        <span className="text-white font-display">TOTAL</span>
                        <span className="neon-text-cyan font-display text-sm">R$ {cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-5">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} className="btn-outline text-xs py-2 px-4">← Voltar</button>
                  )}
                  {step < 3 ? (
                    <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary text-xs py-2 flex-1 disabled:opacity-40">
                      Continuar →
                    </button>
                  ) : (
                    <button onClick={handleFinish} className="btn-primary text-sm py-2.5 flex-1">🎮 Finalizar Pedido</button>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="card-glow rounded-xl p-4">
                <h4 className="font-display font-bold text-white text-xs mb-3 pb-2 border-b border-white/5">Pedido</h4>
                <div className="space-y-2 mb-3">
                  {cart.items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-2">
                      <img src={item.product.image} alt={item.product.name} className="w-7 h-7 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[11px] truncate">{item.product.name}</p>
                        <p className="text-slate-600 text-[10px]">×{item.quantity}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 whitespace-nowrap">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white font-display font-bold text-xs">Total</span>
                  <span className="neon-text-cyan font-display font-bold text-sm">R$ {cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
