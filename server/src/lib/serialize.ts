import type { Prisma } from "@prisma/client";
import { round2 } from "../lib/errors";

export const DELIVERY_FEE = 5.99;
export const PICKUP_FEE = 0;
export const MAX_ITEM_QUANTITY = 20;
export const STORE_ADDRESS = "Retirada no estabelecimento — Av. dos Games, 404, Pixel District, São Paulo";

export const cartInclude = {
  coupon: true,
  items: {
    include: { product: true },
    orderBy: { id: "asc" },
  },
} satisfies Prisma.CartInclude;

export type CartWithRelations = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export function serializeProduct(product: {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  featured: boolean;
  popular: boolean;
  isNew: boolean;
  active: boolean;
  stock: number;
  promoOriginalPrice: number | null;
  promoDiscount: number | null;
}) {
  let ingredients: string[] = [];
  try {
    const parsed = JSON.parse(product.ingredients);
    if (Array.isArray(parsed)) ingredients = parsed.filter((item) => typeof item === "string");
  } catch {
    ingredients = [];
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    ingredients,
    price: product.price,
    image: product.image,
    rating: product.rating,
    reviews: product.reviews,
    featured: product.featured,
    popular: product.popular,
    isNew: product.isNew,
    active: product.active,
    stock: product.stock,
    promo:
      product.promoOriginalPrice != null && product.promoDiscount != null
        ? { originalPrice: product.promoOriginalPrice, discount: product.promoDiscount }
        : undefined,
  };
}

export function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.name.trim().charAt(0).toUpperCase() || "P",
    createdAt: user.createdAt.toISOString(),
  };
}

export function quoteCart(cart: CartWithRelations) {
  const activeItems = cart.items.filter((item) => item.product.active);
  const subtotal = round2(
    activeItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  const discount = cart.coupon?.active ? cart.coupon.discountPercent : 0;
  const discountAmount = round2((subtotal * discount) / 100);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const pickupFee = subtotal > 0 ? PICKUP_FEE : 0;

  return {
    items: activeItems.map((item) => ({
      product: serializeProduct(item.product),
      quantity: item.quantity,
    })),
    coupon: cart.coupon?.code ?? null,
    discount,
    subtotal,
    discountAmount,
    fees: {
      delivery: deliveryFee,
      pickup: pickupFee,
    },
    totals: {
      delivery: round2(subtotal - discountAmount + deliveryFee),
      pickup: round2(subtotal - discountAmount + pickupFee),
    },
  };
}

const PAYMENT_TO_API = {
  PIX: "pix",
  CARD: "card",
  CASH: "cash",
} as const;

const DELIVERY_TO_API = {
  DELIVERY: "delivery",
  PICKUP: "pickup",
} as const;

export function serializeOrder(order: {
  code: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: keyof typeof DELIVERY_TO_API;
  address: string;
  paymentMethod: keyof typeof PAYMENT_TO_API;
  status: string;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  couponCode: string | null;
  estimatedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  userId?: string | null;
}) {
  return {
    code: order.code,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    deliveryType: DELIVERY_TO_API[order.deliveryType],
    address: order.address,
    paymentMethod: PAYMENT_TO_API[order.paymentMethod],
    status: order.status,
    subtotal: order.subtotal,
    discountPercent: order.discountPercent,
    discountAmount: order.discountAmount,
    deliveryFee: order.deliveryFee,
    total: order.total,
    couponCode: order.couponCode,
    estimatedMinutes: order.estimatedMinutes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    userId: order.userId ?? null,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
  };
}
