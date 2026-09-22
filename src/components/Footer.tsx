import { Link } from "react-router";

export default function Footer() {
  return (
    <footer style={{ background: "#05050f", borderTop: "1px solid rgba(255,255,255,0.06)" }} className="pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-pixel neon-text-pink"
                style={{ background: "rgba(255,0,110,0.15)", border: "1px solid rgba(255,0,110,0.4)" }}>
                P
              </div>
              <span className="font-display font-bold text-white text-sm tracking-widest">
                PIXEL <span className="neon-text-pink">BURGUER</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Transformando cada pedido em uma experiência épica desde 2024. Onde o sabor encontra o game.
            </p>
            <div className="flex gap-2">
              {["Instagram", "TikTok", "Twitter", "YouTube"].map(s => (
                <a key={s} href="#" title={s}
                  className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-display text-xs font-semibold text-white tracking-widest uppercase mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Início" },
                { to: "/cardapio", label: "Cardápio" },
                { to: "/combos", label: "Combos" },
                { to: "/promocoes", label: "Promoções" },
                { to: "/sobre", label: "Sobre nós" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cardápio */}
          <div>
            <h4 className="font-display text-xs font-semibold text-white tracking-widest uppercase mb-4">Cardápio</h4>
            <ul className="space-y-2">
              {["🍔 Hambúrgueres", "🍟 Porções", "🌭 Lanches", "🥤 Bebidas", "🍰 Sobremesas", "🎮 Combos"].map(cat => (
                <li key={cat}>
                  <Link to="/cardapio" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display text-xs font-semibold text-white tracking-widest uppercase mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 text-xs mt-0.5">📍</span>
                <span className="text-slate-500 text-xs">Av. dos Games, 404<br />São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-500 text-xs">📞</span>
                <span className="text-slate-500 text-xs">(11) 3000-0404</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-500 text-xs">✉️</span>
                <span className="text-slate-500 text-xs">ola@pixelburguer.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 text-xs mt-0.5">🕐</span>
                <span className="text-slate-500 text-xs">Seg–Sex: 11h–23h<br />Sáb–Dom: 11h–00h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-[11px]">
            © 2024 Pixel Burguer. Todos os direitos reservados.
          </p>
          <p className="text-slate-700 text-[11px] font-pixel">
            INSERT COIN TO CONTINUE
          </p>
        </div>
      </div>
    </footer>
  );
}
