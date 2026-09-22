import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    login(email, password);
    navigate("/perfil");
  };

  return (
    <div className="flex items-center justify-center px-4" style={{ height: "100%", background: "#080812" }}>
      <div className="w-full max-w-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-pixel neon-text-pink mx-auto mb-3"
            style={{ background: "rgba(255,0,110,0.12)", border: "1px solid rgba(255,0,110,0.35)", boxShadow: "0 0 18px rgba(255,0,110,0.2)" }}>
            P
          </div>
          <h1 className="font-display font-black text-xl text-white mb-1">Entre para continuar</h1>
          <p className="text-slate-500 text-sm">sua jornada</p>
        </div>

        <div className="card-glow rounded-xl p-5">
          {error && (
            <div className="mb-3 p-2.5 rounded text-xs text-red-400" style={{ background: "rgba(255,0,110,0.07)", border: "1px solid rgba(255,0,110,0.18)" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-display text-slate-400 mb-1.5">E-mail</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="player@email.com" />
            </div>
            <div>
              <label className="block text-xs font-display text-slate-400 mb-1.5">Senha</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" />
            </div>
            <div className="text-right">
              <a href="#" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">Esqueci minha senha</a>
            </div>
            <button type="submit" className="btn-primary w-full py-2.5 text-sm">🎮 Entrar</button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-slate-600" style={{ background: "#0f0f1e" }}>ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <Link to="/cadastro" className="btn-outline block text-center text-sm py-2">Criar conta</Link>
            <button onClick={() => navigate("/")} className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors py-1.5">
              Continuar como visitante →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
