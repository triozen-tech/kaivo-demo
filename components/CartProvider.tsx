"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct } from "@/data/products";

export type CartLine = { slug: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  menuOpen: boolean;
  add: (slug: string, qty?: number, openDrawer?: boolean) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setDrawerOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
};

const KEY = "kaivo-cart";
const MAX_QTY = 10;
const Ctx = createContext<CartCtx | null>(null);

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l && typeof l.slug === "string" && Number.isInteger(l.qty) && l.qty > 0 && getProduct(l.slug))
      .map((l) => ({ slug: l.slug, qty: Math.min(l.qty, MAX_QTY) }));
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage blocked: the cart still works for this visit */
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setLines(read());
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (loaded.current) write(lines);
  }, [lines]);

  const add = useCallback((slug: string, qty = 1, openDrawer = true) => {
    setLines((cur) => {
      const found = cur.find((l) => l.slug === slug);
      if (found) return cur.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l));
      return [...cur, { slug, qty: Math.min(qty, MAX_QTY) }];
    });
    if (openDrawer) setDrawerOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((cur) =>
      qty <= 0 ? cur.filter((l) => l.slug !== slug) : cur.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, MAX_QTY) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => setLines((cur) => cur.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
    return { lines, ready, count, subtotal, drawerOpen, menuOpen, add, setQty, remove, clear, setDrawerOpen, setMenuOpen };
  }, [lines, ready, drawerOpen, menuOpen, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export { MAX_QTY };
