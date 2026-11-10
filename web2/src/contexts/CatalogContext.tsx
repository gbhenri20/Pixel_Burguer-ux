import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { products as staticProducts, type Product } from "../data/products";
import { request } from "../api/client";
import type { ApiProduct } from "../api/types";

interface CatalogContextType {
  products: Product[];
  loading: boolean;
  fromApi: boolean;
  refresh: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  const refresh = useCallback(async () => {
    const list = await request<ApiProduct[]>("/products");
    if (list.length > 0) {
      setProducts(list);
      setFromApi(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    refresh()
      .catch(() => {
        if (!cancelled) setFromApi(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [refresh]);

  return (
    <CatalogContext.Provider value={{ products, loading, fromApi, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
