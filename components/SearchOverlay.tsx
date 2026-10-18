"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { Pic } from "./ProductImage";
import { CloseIcon } from "./Icons";
import { matches } from "./ShopBrowser";
import { omr } from "@/lib/format";
import { getLenis } from "@/lib/motion";

/** Full-screen search: live name and category matches with thumbnails, Esc closes, Enter opens /shop?q=. */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => (q.trim() ? products.filter((p) => matches(p, q)) : []), [q]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const t = setTimeout(() => input.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; getLenis()?.start(); prev?.focus?.(); };
  }, [open, onClose]);

  useEffect(() => { if (!open) setQ(""); }, [open]);

  return (
    <div className={`search${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="search-scrim" onClick={onClose} />
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search">
        <form className="search-form" role="search" onSubmit={(e) => { e.preventDefault(); onClose(); router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop"); }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.500" stroke="currentColor" strokeWidth="1.5" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tumblers, kettles, serum…" aria-label="Search products" enterKeyHint="search" autoComplete="off" />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><CloseIcon /></button>
        </form>
        <div className="search-body" data-lenis-prevent>
          {q.trim() === "" ? (
            <div className="search-hint">
              <p className="label">Popular</p>
              <div className="search-cats">{categories.map((c) => <Link key={c.slug} href={`/c/${c.slug}`} className="fchip" onClick={onClose}>{c.name}</Link>)}</div>
            </div>
          ) : results.length === 0 ? (
            <p className="search-none">No products match “{q.trim()}”.</p>
          ) : (
            <>
              <ul className="search-list">
                {results.slice(0, 6).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/p/${p.slug}`} className="search-item" onClick={onClose}>
                      <span className="search-thumb"><Pic name={p.image} alt="" sizes="64px" /></span>
                      <span className="search-name">{p.name}<small>{categories.find((c) => c.slug === p.category)?.name}</small></span>
                      <span className="search-price">{omr(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/shop?q=${encodeURIComponent(q.trim())}`} className="textlink search-all" onClick={onClose}>See all {results.length} result{results.length === 1 ? "" : "s"}</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
