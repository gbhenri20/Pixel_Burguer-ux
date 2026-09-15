import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useApp } from "../contexts/AppContext";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/cardapio", label: "Cardápio" },
  { to: "/combos", label: "Combos" },
  { to: "/promocoes", label: "Promoções" },
  { to: "/sobre", label: "Sobre nós" },
  { to: "/contato", label: "Contato" },
];

export default function Navbar() {
  const { cartCount, user } = useApp();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl border-b border-white/5" : ""}`}
      style={{ background: scrolled ? "rgba(8,8,18,0.92)" : "rgba(8,8,18,0.6)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-pixel neon-text-pink"
              style={{ background: "rgba(255,0,110,0.15)", border: "1px solid rgba(255,0,110,0.4)" }}>
              P
            </div>
            <span className="font-display font-bold text-white text-sm tracking-widest hidden sm:block">
              PIXEL <span className="neon-text-pink">BURGUER</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-1.5 rounded text-xs font-display font-medium tracking-wider transition-all duration-200
                  ${isActive(link.to)
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/carrinho" className="relative p-2 rounded transition-all hover:bg-white/5 group">
              <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6m1 7v4a1 1 0 001 1h9a1 1 0 001-1v-4M9 21h.01M15 21h.01" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-pulse-neon"
                  style={{ background: "#ff006e", boxShadow: "0 0 8px rgba(255,0,110,0.8)" }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <Link to="/perfil" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded text-xs font-display font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #ff006e, #a855f7)" }}>
                  {user.avatar}
                </div>
                <span className="hidden md:block">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary hidden sm:block text-xs py-2 px-4">
                Entrar
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/5 animate-fade-in"
          style={{ background: "rgba(8,8,18,0.97)" }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2.5 rounded text-sm font-display font-medium tracking-wider transition-all
                  ${isActive(link.to) ? "text-cyan-400 bg-cyan-400/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/5 mt-2 pt-2">
              {user ? (
                <Link to="/perfil" className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #ff006e, #a855f7)" }}>
                    {user.avatar}
                  </div>
                  Minha Conta
                </Link>
              ) : (
                <Link to="/login" className="btn-primary block text-center text-sm py-2.5">
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
