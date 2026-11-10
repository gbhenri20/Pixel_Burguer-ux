import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useCatalog } from "../contexts/CatalogContext";
import { request } from "../api/client";
import type { ApiOrder, ApiProduct, ContactMessage, ManagedCoupon, User } from "../api/types";

const STATUS_LABEL: Record<ApiOrder["status"], string> = {
  RECEIVED: "Recebido",
  PREPARING: "Preparando",
  READY: "Pronto",
  ON_THE_WAY: "A caminho",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

function nextAction(order: ApiOrder) {
  if (order.status === "RECEIVED") return "Iniciar preparo";
  if (order.status === "PREPARING") return "Marcar pronto";
  if (order.status === "READY") return order.deliveryType === "pickup" ? "Marcar retirado" : "Saiu para entrega";
  if (order.status === "ON_THE_WAY") return "Marcar entregue";
  return null;
}

const emptyProduct = {
  name: "",
  category: "burgers",
  description: "",
  price: "",
  stock: "100",
  image: "https://images.unsplash.com/photo-1611309454921-16cef3438ee0?w=600&h=400&fit=crop&auto=format",
};

export default function Admin() {
  const { user } = useApp();
  const { refresh } = useCatalog();
  const staff = user?.role === "ADMIN" || user?.role === "KITCHEN";
  const isAdmin = user?.role === "ADMIN";
  const [tab, setTab] = useState<"Pedidos" | "Produtos" | "Cupons" | "Usuários" | "Mensagens">("Pedidos");
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [coupons, setCoupons] = useState<ManagedCoupon[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [error, setError] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [couponForm, setCouponForm] = useState({ code: "", discountPercent: "10", minSubtotal: "0", maxUses: "" });

  const loadOrders = () => request<ApiOrder[]>("/orders/manage").then(setOrders);
  const loadProducts = () => request<ApiProduct[]>("/products?includeInactive=1").then(setProducts);
  const loadCoupons = () => request<ManagedCoupon[]>("/coupons/manage").then(setCoupons);
  const loadUsers = () => request<User[]>("/users").then(setUsers);
  const loadMessages = () => request<ContactMessage[]>("/messages").then(setMessages);

  useEffect(() => {
    if (!staff) return;
    loadOrders().catch((err) => setError(err instanceof Error ? err.message : "Falha ao carregar pedidos."));
    if (!isAdmin) return;
    Promise.all([loadProducts(), loadCoupons(), loadUsers(), loadMessages()]).catch((err) => {
      setError(err instanceof Error ? err.message : "Falha ao carregar o painel.");
    });
  }, [staff, isAdmin]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: "100%", background: "#080812" }}>
        <p className="text-slate-400 text-sm mb-4">Entre com uma conta da operação para abrir o painel.</p>
        <Link to="/login" className="btn-primary text-sm py-2 px-6">Entrar</Link>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ height: "100%", background: "#080812" }}>
        <h2 className="font-display font-bold text-xl text-white mb-2">Acesso restrito</h2>
        <p className="text-slate-500 text-sm">Esta área é da cozinha e da administração.</p>
      </div>
    );
  }

  const tabs = isAdmin ? ["Pedidos", "Produtos", "Cupons", "Usuários", "Mensagens"] as const : ["Pedidos"] as const;

  const advance = async (code: string) => {
    setError("");
    try {
      await request(`/orders/code/${code}/advance`, { method: "POST" });
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível avançar o pedido.");
    }
  };

  const cancel = async (code: string) => {
    setError("");
    try {
      await request(`/orders/code/${code}/cancel`, { method: "POST" });
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível cancelar o pedido.");
    }
  };

  const saveProduct = async (product: ApiProduct, patch: { price?: number; stock?: number; active?: boolean }) => {
    setError("");
    try {
      await request(`/products/${product.id}`, { method: "PATCH", body: JSON.stringify(patch) });
      await loadProducts();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o produto.");
    }
  };

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await request("/products", {
        method: "POST",
        body: JSON.stringify({
          name: productForm.name,
          category: productForm.category,
          description: productForm.description,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          image: productForm.image,
          ingredients: [],
        }),
      });
      setProductForm(emptyProduct);
      await loadProducts();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o produto.");
    }
  };

  const removeProduct = async (id: string) => {
    if (!window.confirm("Excluir este produto do cardápio?")) return;
    await request(`/products/${id}`, { method: "DELETE" });
    await loadProducts();
    await refresh();
  };

  const createCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await request("/coupons", {
        method: "POST",
        body: JSON.stringify({
          code: couponForm.code,
          discountPercent: Number(couponForm.discountPercent),
          minSubtotal: Number(couponForm.minSubtotal || 0),
          maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : null,
          active: true,
        }),
      });
      setCouponForm({ code: "", discountPercent: "10", minSubtotal: "0", maxUses: "" });
      await loadCoupons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o cupom.");
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "100%", background: "#080812" }}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="font-pixel text-[9px] neon-text-cyan mb-1">// OPERAÇÃO LOCAL</p>
          <h1 className="font-display font-black text-2xl text-white mb-3">Painel</h1>
          <div className="flex gap-1.5 flex-wrap">
            {tabs.map((item) => (
              <button key={item} onClick={() => setTab(item)}
                className={`px-3 py-1.5 rounded text-xs font-display font-semibold ${tab === item ? "text-white" : "text-slate-500"}`}
                style={{
                  background: tab === item ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: tab === item ? "1px solid rgba(0,245,255,0.3)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 space-y-3">
          {error && <p className="text-xs text-red-400">{error}</p>}

          {tab === "Pedidos" && orders.map((order) => {
            const action = nextAction(order);
            return (
              <div key={order.code} className="card-glow rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <p className="font-display font-bold text-white text-sm">#{order.code} · {order.customerName}</p>
                    <p className="text-slate-500 text-xs">{order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</p>
                  </div>
                  <span className="tag tag-new">{STATUS_LABEL[order.status]}</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">{order.address}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sm neon-text-cyan">R$ {order.total.toFixed(2)}</span>
                  <div className="flex gap-2">
                    {action && <button onClick={() => void advance(order.code)} className="btn-primary text-[11px] py-1.5 px-3">{action}</button>}
                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <button onClick={() => void cancel(order.code)} className="btn-outline text-[11px] py-1.5 px-3">Cancelar</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {tab === "Pedidos" && orders.length === 0 && <p className="text-slate-500 text-sm">Nenhum pedido gravado ainda.</p>}

          {tab === "Produtos" && isAdmin && (
            <>
              <form onSubmit={createProduct} className="card-glow rounded-xl p-4 grid sm:grid-cols-2 gap-2">
                <input required value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome" />
                <select value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                  {["burgers", "sides", "sandwiches", "drinks", "desserts", "combos"].map(category => <option key={category} value={category}>{category}</option>)}
                </select>
                <input required value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição" />
                <input required type="number" step="0.1" min="0.1" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="Preço" />
                <input required type="number" min="0" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} placeholder="Estoque" />
                <button className="btn-primary text-xs py-2">Cadastrar produto</button>
              </form>
              {products.map((product) => (
                <ProductRow key={product.id} product={product} onSave={saveProduct} onDelete={removeProduct} />
              ))}
            </>
          )}

          {tab === "Cupons" && isAdmin && (
            <>
              <form onSubmit={createCoupon} className="card-glow rounded-xl p-4 grid sm:grid-cols-4 gap-2">
                <input required value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value }))} placeholder="Código" />
                <input required type="number" min="1" max="90" value={couponForm.discountPercent} onChange={e => setCouponForm(f => ({ ...f, discountPercent: e.target.value }))} placeholder="%" />
                <input type="number" min="0" value={couponForm.minSubtotal} onChange={e => setCouponForm(f => ({ ...f, minSubtotal: e.target.value }))} placeholder="Mínimo" />
                <button className="btn-primary text-xs py-2">Criar cupom</button>
              </form>
              {coupons.map((coupon) => (
                <div key={coupon.id} className="card-glow rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-white text-sm font-display">{coupon.code} · {coupon.discountPercent}%</p>
                    <p className="text-slate-500 text-xs">Mín. R$ {coupon.minSubtotal.toFixed(2)} · usos {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ""} · {coupon.active ? "ativo" : "inativo"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => void request(`/coupons/${coupon.id}`, { method: "PATCH", body: JSON.stringify({ active: !coupon.active }) }).then(loadCoupons)} className="btn-outline text-[11px] py-1.5 px-3">
                      {coupon.active ? "Desativar" : "Ativar"}
                    </button>
                    <button onClick={() => void request(`/coupons/${coupon.id}`, { method: "DELETE" }).then(loadCoupons)} className="text-xs text-red-400">Excluir</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === "Usuários" && isAdmin && users.map((account) => (
            <div key={account.id} className="card-glow rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-white text-sm">{account.name}</p>
                <p className="text-slate-500 text-xs">{account.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={account.role} onChange={e => void request(`/users/${account.id}`, { method: "PATCH", body: JSON.stringify({ role: e.target.value }) }).then(loadUsers)} className="text-xs py-1">
                  <option value="CUSTOMER">Cliente</option>
                  <option value="KITCHEN">Cozinha</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {account.id !== user.id && (
                  <button onClick={() => { if (window.confirm("Excluir este usuário?")) void request(`/users/${account.id}`, { method: "DELETE" }).then(loadUsers); }} className="text-xs text-red-400">Excluir</button>
                )}
              </div>
            </div>
          ))}

          {tab === "Mensagens" && isAdmin && messages.map((message) => (
            <div key={message.id} className="card-glow rounded-xl p-4">
              <p className="text-white text-sm font-display">{message.subject}</p>
              <p className="text-slate-500 text-xs mb-2">{message.name} · {message.email} · {new Date(message.createdAt).toLocaleString("pt-BR")}</p>
              <p className="text-slate-300 text-sm">{message.message}</p>
            </div>
          ))}
          {tab === "Mensagens" && isAdmin && messages.length === 0 && <p className="text-slate-500 text-sm">Nenhuma mensagem recebida.</p>}
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onSave,
  onDelete,
}: {
  product: ApiProduct;
  onSave: (product: ApiProduct, patch: { price?: number; stock?: number; active?: boolean }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock ?? 0));

  return (
    <div className="card-glow rounded-xl p-4 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-40">
        <p className="text-white text-sm">{product.name}</p>
        <p className="text-slate-500 text-xs">{product.category} · {product.active === false ? "inativo" : "ativo"}</p>
      </div>
      <input className="w-24 text-xs" type="number" step="0.1" value={price} onChange={e => setPrice(e.target.value)} />
      <input className="w-20 text-xs" type="number" value={stock} onChange={e => setStock(e.target.value)} />
      <button onClick={() => void onSave(product, { price: Number(price), stock: Number(stock) })} className="btn-primary text-[11px] py-1.5 px-3">Salvar</button>
      <button onClick={() => void onSave(product, { active: product.active === false })} className="btn-outline text-[11px] py-1.5 px-3">{product.active === false ? "Ativar" : "Ocultar"}</button>
      <button onClick={() => void onDelete(product.id)} className="text-xs text-red-400">Excluir</button>
    </div>
  );
}
