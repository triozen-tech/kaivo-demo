"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct } from "@/data/products";

const KEY = "kaivo-wish";
type Ctx = { slugs: string[]; count: number; has: (slug: string) => boolean; toggle: (slug: string) => void };
const WishCtx = createContext<Ctx | null>(null);

function read(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string" && getProduct(s)) : [];
  } catch { return []; }
}

/** Saved items live in localStorage only (try/catch: if storage is blocked the hearts still work for this visit). */
export function WishProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const loaded = useRef(false);
  useEffect(() => { setSlugs(read()); loaded.current = true; }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(slugs)); } catch { /* storage blocked */ }
  }, [slugs]);
  const toggle = useCallback((slug: string) => setSlugs((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : [...c, slug])), []);
  const value = useMemo<Ctx>(() => ({ slugs, count: slugs.length, has: (s) => slugs.includes(s), toggle }), [slugs, toggle]);
  return <WishCtx.Provider value={value}>{children}</WishCtx.Provider>;
}

export function useWish() {
  const c = useContext(WishCtx);
  if (!c) throw new Error("useWish must be used inside WishProvider");
  return c;
}
