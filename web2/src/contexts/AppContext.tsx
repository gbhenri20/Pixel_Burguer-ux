import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import type { Product } from "../data/products";
import { orderStep, request, setToken, getToken, toCartProduct } from "../api/client";
import type { ApiCart, ApiOrder, PlaceOrderPayload, User } from "../api/types";

export type { User };

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  discount: number;
}

type CartAction =
  | { type: "SET"; cart: CartState }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET":
      return action.cart;
    case "CLEAR":
      return { items: [], coupon: null, discount: 0 };
    default:
      return state;
  }
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface LastOrder {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  payment: string;
  status: number;
  statusKey: ApiOrder["status"];
  estimatedTime: number;
  createdAt: Date;
}

interface AppContextType {
  cart: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (coupon: string) => Promise<void>;
  removeCoupon: () => void;
  cartTotal: number;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  lastOrder: LastOrder | null;
  placeOrder: (details: PlaceOrderPayload) => Promise<string>;
  trackOrder: (code: string) => Promise<void>;
  refreshLastOrder: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);
const EMPTY_CART: CartState = { items: [], coupon: null, discount: 0 };

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const cartItem = item as CartItem;
  return (
    typeof cartItem.quantity === "number" &&
    cartItem.quantity > 0 &&
    !!cartItem.product &&
    typeof cartItem.product.id === "string" &&
    typeof cartItem.product.price === "number" &&
    typeof cartItem.product.name === "string"
  );
}

function loadCart(): CartState {
  try {
    const saved = localStorage.getItem("pixel_cart");
    if (!saved) return EMPTY_CART;
    const parsed = JSON.parse(saved) as Partial<CartState>;
    if (!parsed || !Array.isArray(parsed.items)) return EMPTY_CART;
    return {
      items: parsed.items.filter(isValidCartItem),
      coupon: typeof parsed.coupon === "string" ? parsed.coupon : null,
      discount: typeof parsed.discount === "number" ? parsed.discount : 0,
    };
  } catch {
    return EMPTY_CART;
  }
}

function readCachedUser(): User | null {
  try {
    const saved = localStorage.getItem("pixel_user");
    return saved ? JSON.parse(saved) as User : null;
  } catch {
    return null;
  }
}

export function toLastOrder(order: ApiOrder): LastOrder {
  return {
    id: order.code,
    items: order.items.map((item) => ({ product: toCartProduct(item), quantity: item.quantity })),
    total: order.total,
    address: order.address,
    payment: order.paymentMethod,
    status: orderStep(order.status),
    statusKey: order.status,
    estimatedTime: order.estimatedMinutes,
    createdAt: new Date(order.createdAt),
  };
}

function fromApiCart(data: ApiCart): CartState {
  return {
    items: data.items.map((item) => ({ product: item.product, quantity: item.quantity })),
    coupon: data.coupon,
    discount: data.discount,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [fees, setFees] = useState({ delivery: 5.99, pickup: 0 });
  const [user, setUser] = useState<User | null>(readCachedUser);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);
  const pending = useRef<Promise<unknown>>(Promise.resolve());
  const lastOrderId = useRef<string | null>(null);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3500);
  }, []);

  const removeToast = (id: string) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const applyServerCart = useCallback((data: ApiCart) => {
    dispatch({ type: "SET", cart: fromApiCart(data) });
    setFees(data.fees);
  }, []);

  const enqueue = useCallback(<T,>(task: () => Promise<T>) => {
    const run = pending.current.then(task, task);
    pending.current = run.then(() => undefined, () => undefined);
    return run;
  }, []);

  const fail = useCallback((error: unknown, fallback: string) => {
    showToast(error instanceof Error ? error.message : fallback, "error");
  }, [showToast]);

  useEffect(() => {
    if (user) localStorage.setItem("pixel_user", JSON.stringify(user));
    else localStorage.removeItem("pixel_user");
  }, [user]);

  useEffect(() => {
    lastOrderId.current = lastOrder?.id ?? null;
  }, [lastOrder]);

  useEffect(() => {
    let cancelled = false;
    void enqueue(async () => {
      if (cancelled) return;
      try {
        if (getToken()) {
          try {
            const me = await request<User>("/auth/me");
            if (!cancelled) setUser(me);
          } catch {
            setToken(null);
            if (!cancelled) setUser(null);
          }
        } else if (!cancelled) {
          setUser(null);
        }

        const local = loadCart();
        let data = await request<ApiCart>("/cart");
        if (data.items.length === 0 && local.items.length > 0) {
          for (const item of local.items) {
            data = await request<ApiCart>("/cart/items", {
              method: "POST",
              body: JSON.stringify({ productId: item.product.id, quantity: item.quantity }),
            });
          }
          if (local.coupon) {
            try {
              data = await request<ApiCart>("/cart/coupon", {
                method: "POST",
                body: JSON.stringify({ code: local.coupon }),
              });
            } catch {
              /* cupom antigo pode não atender mais às regras */
            }
          }
        }
        localStorage.removeItem("pixel_cart");
        if (!cancelled) applyServerCart(data);

        const code = localStorage.getItem("pixel_last_order");
        if (code) {
          try {
            const order = await request<ApiOrder>(`/orders/code/${encodeURIComponent(code)}`);
            if (!cancelled) setLastOrder(toLastOrder(order));
          } catch {
            localStorage.removeItem("pixel_last_order");
          }
        }
      } catch {
        if (!cancelled) showToast("Servidor local indisponível. Inicie a API para salvar carrinho e pedidos.", "error");
      }
    });
    return () => { cancelled = true; };
  }, [applyServerCart, enqueue, showToast]);

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * cart.discount) / 100;
  const deliveryFee = subtotal > 0 ? fees.delivery : 0;
  const cartTotal = subtotal - discountAmount + deliveryFee;

  const addToCart = (product: Product) => {
    void enqueue(async () => {
      try {
        applyServerCart(await request<ApiCart>("/cart/items", {
          method: "POST",
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        }));
        showToast(`🍔 ${product.name} adicionado ao carrinho!`);
      } catch (error) {
        fail(error, "Não foi possível adicionar o item.");
      }
    });
  };

  const incrementItem = (id: string) => {
    void enqueue(async () => {
      try {
        applyServerCart(await request<ApiCart>("/cart/items", {
          method: "POST",
          body: JSON.stringify({ productId: id, quantity: 1 }),
        }));
      } catch (error) {
        fail(error, "Não foi possível atualizar a quantidade.");
      }
    });
  };

  const decrementItem = (id: string) => {
    void enqueue(async () => {
      try {
        const current = await request<ApiCart>("/cart");
        const item = current.items.find((entry) => entry.product.id === id);
        if (!item) {
          applyServerCart(current);
          return;
        }
        applyServerCart(await request<ApiCart>(`/cart/items/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: JSON.stringify({ quantity: item.quantity - 1 }),
        }));
      } catch (error) {
        fail(error, "Não foi possível atualizar a quantidade.");
      }
    });
  };

  const removeFromCart = (id: string) => {
    void enqueue(async () => {
      try {
        applyServerCart(await request<ApiCart>(`/cart/items/${encodeURIComponent(id)}`, { method: "DELETE" }));
      } catch (error) {
        fail(error, "Não foi possível remover o item.");
      }
    });
  };

  const clearCart = () => {
    void enqueue(async () => {
      try {
        applyServerCart(await request<ApiCart>("/cart", { method: "DELETE" }));
      } catch (error) {
        fail(error, "Não foi possível esvaziar o carrinho.");
      }
    });
  };

  const applyCoupon = (coupon: string) => enqueue(async () => {
    applyServerCart(await request<ApiCart>("/cart/coupon", {
      method: "POST",
      body: JSON.stringify({ code: coupon }),
    }));
  });

  const removeCoupon = () => {
    void enqueue(async () => {
      try {
        applyServerCart(await request<ApiCart>("/cart/coupon", { method: "DELETE" }));
      } catch (error) {
        fail(error, "Não foi possível remover o cupom.");
      }
    });
  };

  const login = (email: string, password: string) => enqueue(async () => {
    const result = await request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(result.token);
    setUser(result.user);
    applyServerCart(await request<ApiCart>("/cart"));
    showToast("Login realizado com sucesso! Bem-vindo de volta, Player!");
  });

  const register = (name: string, email: string, phone: string, password: string) => enqueue(async () => {
    const result = await request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password }),
    });
    setToken(result.token);
    setUser(result.user);
    applyServerCart(await request<ApiCart>("/cart"));
    showToast("Conta criada! Bem-vindo à Pixel Burguer!");
  });

  const logout = () => {
    setToken(null);
    setUser(null);
    showToast("Até a próxima, Player!", "info");
    void request<ApiCart>("/cart").then(applyServerCart).catch(() => dispatch({ type: "CLEAR" }));
  };

  const updateProfile = async (patch: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }) => {
    const updated = await request<User>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    setUser(updated);
    showToast("Dados atualizados.");
  };

  const rememberOrder = (order: ApiOrder) => {
    setLastOrder(toLastOrder(order));
    localStorage.setItem("pixel_last_order", order.code);
  };

  const placeOrder = (details: PlaceOrderPayload) => enqueue(async () => {
    const order = await request<ApiOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(details),
    });
    rememberOrder(order);
    dispatch({ type: "CLEAR" });
    return order.code;
  });

  const trackOrder = async (code: string) => {
    const order = await request<ApiOrder>(`/orders/code/${encodeURIComponent(code.trim().toUpperCase())}`);
    rememberOrder(order);
  };

  const refreshLastOrder = useCallback(async () => {
    const code = lastOrderId.current;
    if (!code) return;
    const order = await request<ApiOrder>(`/orders/code/${encodeURIComponent(code)}`);
    setLastOrder(toLastOrder(order));
  }, []);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, incrementItem, decrementItem, clearCart, applyCoupon, removeCoupon,
      cartTotal, cartCount, subtotal, deliveryFee, discountAmount,
      user, login, register, logout, updateProfile,
      toasts, showToast, removeToast,
      lastOrder, placeOrder, trackOrder, refreshLastOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
