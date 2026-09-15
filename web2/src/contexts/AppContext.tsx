import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../data/products";

// --- Cart ---
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
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "INCREMENT"; id: string }
  | { type: "DECREMENT"; id: string }
  | { type: "CLEAR" }
  | { type: "APPLY_COUPON"; coupon: string; discount: number }
  | { type: "REMOVE_COUPON" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter(i => i.product.id !== action.id) };
    case "INCREMENT":
      return { ...state, items: state.items.map(i => i.product.id === action.id ? { ...i, quantity: i.quantity + 1 } : i) };
    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map(i => i.product.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0),
      };
    case "CLEAR":
      return { ...state, items: [], coupon: null, discount: 0 };
    case "APPLY_COUPON":
      return { ...state, coupon: action.coupon, discount: action.discount };
    case "REMOVE_COUPON":
      return { ...state, coupon: null, discount: 0 };
    default:
      return state;
  }
}

// --- Auth ---
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const MOCK_USER: User = {
  id: "u001",
  name: "Player One",
  email: "player1@pixelburguer.com",
  phone: "(11) 99999-0001",
  avatar: "P",
};

// --- Toast ---
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// --- Context ---
interface AppContextType {
  // Cart
  cart: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (coupon: string, discount: number) => void;
  removeCoupon: () => void;
  cartTotal: number;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  // Auth
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  // Order
  lastOrder: LastOrder | null;
  placeOrder: (details: OrderDetails) => string;
}

export interface LastOrder {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  payment: string;
  status: number;
  estimatedTime: number;
  createdAt: Date;
}

interface OrderDetails {
  address: string;
  payment: string;
}

const AppContext = createContext<AppContextType | null>(null);

const DELIVERY_FEE = 5.99;

function loadCart(): CartState {
  try {
    const saved = localStorage.getItem("pixel_cart");
    return saved ? JSON.parse(saved) : { items: [], coupon: null, discount: 0 };
  } catch {
    return { items: [], coupon: null, discount: 0 };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("pixel_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    localStorage.setItem("pixel_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) localStorage.setItem("pixel_user", JSON.stringify(user));
    else localStorage.removeItem("pixel_user");
  }, [user]);

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discountAmount = (subtotal * cart.discount) / 100;
  const cartTotal = subtotal - discountAmount + (subtotal > 0 ? DELIVERY_FEE : 0);

  const showToast = (message: string, type: Toast["type"] = "success") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD", product });
    showToast(`🍔 ${product.name} adicionado ao carrinho!`);
  };

  const login = (email: string, _password: string) => {
    const mockUser = { ...MOCK_USER, email };
    setUser(mockUser);
    showToast("Login realizado com sucesso! Bem-vindo de volta, Player!");
    return true;
  };

  const register = (name: string, email: string, phone: string, _password: string) => {
    setUser({ id: "u" + Date.now(), name, email, phone, avatar: name[0].toUpperCase() });
    showToast("Conta criada! Bem-vindo à Pixel Burguer!");
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast("Até a próxima, Player!", "info");
  };

  const placeOrder = (details: OrderDetails) => {
    const orderId = "PB" + Math.floor(Math.random() * 90000 + 10000);
    const order: LastOrder = {
      id: orderId,
      items: [...cart.items],
      total: cartTotal,
      address: details.address,
      payment: details.payment,
      status: 0,
      estimatedTime: 35 + Math.floor(Math.random() * 15),
      createdAt: new Date(),
    };
    setLastOrder(order);
    dispatch({ type: "CLEAR" });
    return orderId;
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart,
      removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
      incrementItem: (id) => dispatch({ type: "INCREMENT", id }),
      decrementItem: (id) => dispatch({ type: "DECREMENT", id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      applyCoupon: (coupon, discount) => dispatch({ type: "APPLY_COUPON", coupon, discount }),
      removeCoupon: () => dispatch({ type: "REMOVE_COUPON" }),
      cartTotal, cartCount, subtotal, deliveryFee: DELIVERY_FEE, discountAmount,
      user, login, register, logout,
      toasts, showToast, removeToast,
      lastOrder, placeOrder,
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
