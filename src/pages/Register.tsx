import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof form, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) { setError("Preencha todos os campos."); return; }
    if (form.password !== form.confirm) { setError("As senhas não coincidem."); return; }
    if (form.password.length < 6) { setError("Senha deve ter pelo menos 6 caracteres."); return; }
    register(form.name, form.email, form.phone, form.password);
    navigate("/perfil");
  };

  return (
    <div className="flex items-center justify-center px-4" style={{ height: "100%", background: "#080812" }}>
      <div className="w-full max-w-xs">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-pixel neon-text-cyan mx-auto mb-2"
            style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.25)", boxShadow: "0 0 16px rgba(0,245,255,0.12)" }}>
            +
          </div>
          <h1 className="font-display font-black text-xl text-white mb-1">Criar sua conta</h1>
          <p className="text-slate-500 text-sm">Junte-se ao universo Pixel Burguer</p>
        </div>

        <div className="card-glow rounded-xl p-5">
          {error && (
            <div className="mb-3 p-2.5 rounded text-xs text-red-400" style={{ background: "rgba(255,0,110,0.07)", border: "1px solid rgba(255,0,110,0.18)" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div><label className="block text-xs font-display text-slate-400 mb-1">Nome</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Player One" /></div>
            <div><label className="block text-xs font-display text-slate-400 mb-1">E-mail</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="player@email.com" /></div>
            <div><label className="block text-xs font-display text-slate-400 mb-1">Telefone</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(11) 99999-0000" /></div>
            <div><label className="block text-xs font-display text-slate-400 mb-1">Senha</label>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" /></div>
            <div><label className="block text-xs font-display text-slate-400 mb-1">Confirmar senha</label>
              <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="••••••••" /></div>
            <button type="submit" className="btn-primary w-full py-2.5 text-sm">🎮 Criar conta</button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-3">
            Já tem conta?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
