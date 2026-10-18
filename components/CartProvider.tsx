"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct } from "@/data/products";
import { discountFor, isKnownCode, normaliseCode, codeNote as noteFor } from "@/lib/promo";

export type CartLine = { slug: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  code: string | null;
  discount: number;
  codeNote: string | null;
  net: number;
  applyCode: (raw: string) => { ok: boolean; message?: string };
  removeCode: () => void;
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
const CODE_KEY = "kaivo-code";
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
  const [code, setCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setLines(read());
    try { const c = localStorage.getItem(CODE_KEY); if (c && isKnownCode(c)) setCode(c); } catch { /* no saved code */ }
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (loaded.current) write(lines);
  }, [lines]);

  useEffect(() => {
    if (!loaded.current) return;
    try { if (code) localStorage.setItem(CODE_KEY, code); else localStorage.removeItem(CODE_KEY); } catch { /* storage blocked */ }
  }, [code]);

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
  const removeCode = useCallback(() => setCode(null), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
    const discount = discountFor(code, subtotal);
    const applyCode = (raw: string) => {
      const c = normaliseCode(raw);
      if (!isKnownCode(c)) return { ok: false, message: "That code isn't valid" };
      const note = noteFor(c, subtotal);
      if (note) return { ok: false, message: `${c} ${note}` };
      setCode(c);
      return { ok: true };
    };
    return { lines, ready, count, subtotal, code, discount, codeNote: noteFor(code, subtotal), net: subtotal - discount, applyCode, removeCode, drawerOpen, menuOpen, add, setQty, remove, clear, setDrawerOpen, setMenuOpen };
  }, [lines, ready, code, drawerOpen, menuOpen, add, setQty, remove, clear, removeCode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export { MAX_QTY };
