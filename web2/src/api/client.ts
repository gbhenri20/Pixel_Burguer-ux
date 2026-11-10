import type { Product } from "../data/products";
import type { ApiOrder, ApiOrderItem } from "./types";

const STATUS_INDEX = {
  RECEIVED: 0,
  PREPARING: 1,
  READY: 2,
  ON_THE_WAY: 3,
  DELIVERED: 4,
  CANCELLED: -1,
} as const;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  return localStorage.getItem("pixel_token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("pixel_token", token);
  else localStorage.removeItem("pixel_token");
}

export function getSessionId() {
  let id = localStorage.getItem("pixel_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("pixel_session", id);
  }
  return id;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  headers.set("X-Session-Id", getSessionId());
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`/api${path}`, { ...options, headers });
  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) {
    if (response.status === 401 && token && !path.startsWith("/auth/")) setToken(null);
    throw new ApiError(response.status, data.error || "Falha na requisição.");
  }
  return data as T;
}

export function toCartProduct(item: ApiOrderItem): Product {
  return {
    id: item.productId,
    name: item.name,
    category: "burgers",
    description: "",
    ingredients: [],
    price: item.price,
    image: item.image,
    rating: 0,
    reviews: 0,
    featured: false,
  };
}

export function orderStep(status: ApiOrder["status"]) {
  return STATUS_INDEX[status] ?? 0;
}
