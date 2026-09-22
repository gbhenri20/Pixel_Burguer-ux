import { useState, useMemo } from "react";
import { products, categoryLabels, type Category, type Product } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

const categories: Category[] = ["burgers", "sides", "sandwiches", "drinks", "desserts", "combos"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "all") list = list.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, search, sort]);

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      {/* Fixed header inside page */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4" style={{ background: "#080812", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div>
              <p className="font-pixel text-[9px] neon-text-cyan mb-1">// CARDÁPIO COMPLETO</p>
              <h1 className="font-display font-black text-2xl text-white">
                Escolha sua <span className="neon-text-pink">missão</span>
              </h1>
            </div>
            <div className="flex gap-2 sm:ml-auto flex-wrap sm:flex-nowrap">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 py-2 text-xs w-40" />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} className="py-2 text-xs w-36">
                <option value="default">Padrão</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="rating">Mais bem avaliados</option>
              </select>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <button onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 px-3 py-1.5 rounded text-[11px] font-display font-semibold tracking-wide transition-all
                ${activeCategory === "all" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
              style={{
                background: activeCategory === "all" ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.03)",
                border: activeCategory === "all" ? "1px solid rgba(0,245,255,0.3)" : "1px solid rgba(255,255,255,0.07)",
              }}>
              🎮 Todos ({products.length})
            </button>
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat).length;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded text-[11px] font-display font-semibold tracking-wide transition-all
                    ${activeCategory === cat ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                  style={{
                    background: activeCategory === cat ? "rgba(255,0,110,0.1)" : "rgba(255,255,255,0.03)",
                    border: activeCategory === cat ? "1px solid rgba(255,0,110,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  }}>
                  {categoryLabels[cat]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable product grid */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-white text-lg mb-2">Nenhum resultado</h3>
              <p className="text-slate-500 text-sm">Tente outro termo ou categoria.</p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 text-xs mb-4">
                <span className="text-white">{filtered.length}</span> {filtered.length === 1 ? "item" : "itens"} encontrados
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onDetails={setSelectedProduct} compact />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
