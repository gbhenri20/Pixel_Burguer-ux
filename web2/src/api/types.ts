import type { Product } from "../data/products";

export type Role = "CUSTOMER" | "KITCHEN" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  createdAt: string;
}

export interface ApiProduct extends Product {
  stock?: number;
  active?: boolean;
}

export interface ApiCart {
  items: { product: ApiProduct; quantity: number }[];
  coupon: string | null;
  discount: number;
  subtotal: number;
  discountAmount: number;
  fees: { delivery: number; pickup: number };
  totals: { delivery: number; pickup: number };
}

export interface ApiOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ApiOrder {
  code: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup";
  address: string;
  paymentMethod: "pix" | "card" | "cash";
  status: "RECEIVED" | "PREPARING" | "READY" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  couponCode: string | null;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
}

export interface PlaceOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup";
  paymentMethod: "pix" | "card" | "cash";
  address?: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
  };
}

export interface Address {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  isPrimary: boolean;
}

export interface PublicCoupon {
  code: string;
  discountPercent: number;
  minSubtotal: number;
}

export interface ManagedCoupon extends PublicCoupon {
  id: string;
  active: boolean;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
