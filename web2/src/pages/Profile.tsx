import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { request } from "../api/client";
import type { Address, ApiOrder } from "../api/types";

const TABS = ["Visão Geral", "Pedidos", "Endereços", "Config."] as const;
type Tab = typeof TABS[number];

const STATUS_LABEL: Record<ApiOrder["status"], string> = {
  RECEIVED: "Recebido",
  PREPARING: "Preparando",
  READY: "Pronto",
  ON_THE_WAY: "A caminho",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const emptyAddress = { label: "Casa", cep: "", street: "", number: "", complement: "", neighborhood: "", city: "" };

export default function Profile() {
  const { user, logout, trackOrder, updateProfile } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Visão Geral");
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profile, setProfile] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setProfile({ name: user.name, phone: user.phone });
    request<ApiOrder[]>("/orders/mine").then(setOrders).catch(() => setOrders([]));
    request<Address[]>("/users/me/addresses").then(setAddresses).catch(() => setAddresses([]));
  }, [user]);

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

  const spent = orders.reduce((sum, order) => sum + order.total, 0);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "—";

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await updateProfile({ name: profile.name, phone: profile.phone });
      setMessage("Perfil salvo.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await updateProfile(password);
      setPassword({ currentPassword: "", newPassword: "" });
      setMessage("Senha alterada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível alterar a senha.");
    }
  };

  const addAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const created = await request<Address>("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(addressForm),
      });
      setAddresses((current) => [created, ...current.map((item) => ({ ...item, isPrimary: created.isPrimary ? false : item.isPrimary }))]);
      setAddressForm(emptyAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o endereço.");
    }
  };

  const removeAddress = async (id: string) => {
    await request(`/users/me/addresses/${id}`, { method: "DELETE" });
    const next = addresses.filter((item) => item.id !== id);
    if (!next.some((item) => item.isPrimary) && next[0]) next[0] = { ...next[0], isPrimary: true };
    setAddresses(next);
  };

  const openOrder = async (code: string) => {
    await trackOrder(code);
    navigate("/acompanhar");
  };

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
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
                <p className="text-slate-500 text-xs">{user.email} · {user.role === "ADMIN" ? "Admin" : user.role === "KITCHEN" ? "Cozinha" : "Cliente"}</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate("/"); }} className="text-xs text-red-400 hover:text-red-300 transition-colors font-display flex items-center gap-1.5 px-3 py-1.5 rounded"
              style={{ border: "1px solid rgba(255,0,110,0.15)", background: "rgba(255,0,110,0.05)" }}>
              🚪 Sair
            </button>
          </div>
          <div className="flex gap-1.5 mt-4">
            {TABS.map(t => (
              <button key={t} onClick={() => { setActiveTab(t); setError(""); setMessage(""); }}
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
          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
          {message && <p className="text-xs mb-3" style={{ color: "#39ff14" }}>{message}</p>}

          {activeTab === "Visão Geral" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[["Pedidos", String(orders.length)], ["Total gasto", `R$ ${spent.toFixed(0)}`], ["Avaliação", "4.9★"]].map(([l, v]) => (
                  <div key={l} className="card-glow rounded-xl p-4 text-center">
                    <p className="font-display font-black text-xl text-white mb-1">{v}</p>
                    <p className="text-slate-500 text-xs">{l}</p>
                  </div>
                ))}
              </div>
              <div className="card-glow rounded-xl p-4">
                <h3 className="font-display font-bold text-white text-sm mb-3">Dados Pessoais</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[["Nome", user.name], ["E-mail", user.email], ["Telefone", user.phone || "Não cadastrado"], ["Membro desde", memberSince]].map(([l, v]) => (
                    <div key={l}><p className="text-xs text-slate-500 font-display mb-0.5">{l}</p><p className="text-white text-sm">{v}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Pedidos" && (
            <div className="space-y-3">
              {orders.length === 0 && <p className="text-slate-500 text-sm">Você ainda não fez pedidos nesta conta.</p>}
              {orders.map(order => (
                <div key={order.code} className="card-glow rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold text-white text-sm">#{order.code}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
                      <span className="tag tag-new">{STATUS_LABEL[order.status]}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mb-2">{order.items.map((item) => item.name).join(", ")}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold neon-text-cyan text-sm">R$ {order.total.toFixed(2)}</span>
                    <button onClick={() => void openOrder(order.code)} className="text-xs text-cyan-400">Acompanhar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Endereços" && (
            <div className="space-y-3">
              {addresses.map(address => (
                <div key={address.id} className="card-glow rounded-xl p-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm font-display font-semibold">{address.label}</span>
                    <div className="flex items-center gap-2">
                      {address.isPrimary && <span className="tag tag-new">Principal</span>}
                      <button onClick={() => void removeAddress(address.id)} className="text-xs text-red-400">Excluir</button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs">{address.street}, {address.number}{address.complement ? ` (${address.complement})` : ""} — {address.neighborhood}</p>
                  <p className="text-slate-400 text-xs">{address.city} — {address.cep}</p>
                </div>
              ))}
              <form onSubmit={addAddress} className="card-glow rounded-xl p-4 space-y-2">
                <h3 className="font-display font-bold text-white text-sm">Novo endereço</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  <input value={addressForm.label} onChange={e => setAddressForm(f => ({ ...f, label: e.target.value }))} placeholder="Apelido" />
                  <input value={addressForm.cep} onChange={e => setAddressForm(f => ({ ...f, cep: e.target.value }))} placeholder="CEP" />
                  <input value={addressForm.street} onChange={e => setAddressForm(f => ({ ...f, street: e.target.value }))} placeholder="Rua" />
                  <input value={addressForm.number} onChange={e => setAddressForm(f => ({ ...f, number: e.target.value }))} placeholder="Número" />
                  <input value={addressForm.neighborhood} onChange={e => setAddressForm(f => ({ ...f, neighborhood: e.target.value }))} placeholder="Bairro" />
                  <input value={addressForm.city} onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))} placeholder="Cidade" />
                </div>
                <button className="btn-outline text-xs py-2 px-4">Salvar endereço</button>
              </form>
            </div>
          )}

          {activeTab === "Config." && (
            <div className="grid md:grid-cols-2 gap-4">
              <form onSubmit={saveProfile} className="card-glow rounded-xl p-4 space-y-3">
                <h3 className="font-display font-bold text-white text-sm">Dados</h3>
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Nome" />
                <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="Telefone" />
                <button className="btn-primary text-xs py-2 px-4">Salvar</button>
              </form>
              <form onSubmit={savePassword} className="card-glow rounded-xl p-4 space-y-3">
                <h3 className="font-display font-bold text-white text-sm">Senha</h3>
                <input type="password" value={password.currentPassword} onChange={e => setPassword(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Senha atual" />
                <input type="password" value={password.newPassword} onChange={e => setPassword(p => ({ ...p, newPassword: e.target.value }))} placeholder="Nova senha" />
                <button className="btn-outline text-xs py-2 px-4">Alterar senha</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
