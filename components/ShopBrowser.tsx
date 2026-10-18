"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "./ProductCard";
import { SampleNote } from "./SampleNote";
import { Sheet } from "./Sheet";

type PriceKey = "u1" | "mid" | "hi";
type Tag = NonNullable<Product["tag"]>;
type Sort = "featured" | "low" | "high" | "top";
type Filters = { price: PriceKey | null; tag: Tag | null; min4: boolean };

const PRICES: { key: PriceKey; label: string; ok: (p: number) => boolean }[] = [
  { key: "u1", label: "Under ₹1,000", ok: (p) => p < 1000 },
  { key: "mid", label: "₹1,000 to ₹2,000", ok: (p) => p >= 1000 && p <= 2000 },
  { key: "hi", label: "Above ₹2,000", ok: (p) => p > 2000 },
];
const TAGS: Tag[] = ["New", "Bestseller", "Sample offer"];
const NONE: Filters = { price: null, tag: null, min4: false };
const PAGE = 9;

const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean);
export function matches(p: Product, q: string) {
  const hay = `${p.name} ${categories.find((c) => c.slug === p.category)?.name ?? ""}`.toLowerCase();
  return words(q).every((w) => hay.includes(w));
}

function Controls({ f, set }: { f: Filters; set: (f: Filters) => void }) {
  return (
    <>
      <div className="fgroup" role="group" aria-label="Price">
        <span className="fgroup-label">Price</span>
        {PRICES.map((p) => <button key={p.key} type="button" className="fchip" aria-pressed={f.price === p.key} onClick={() => set({ ...f, price: f.price === p.key ? null : p.key })}>{p.label}</button>)}
      </div>
      <div className="fgroup" role="group" aria-label="Tag">
        <span className="fgroup-label">Tag</span>
        {TAGS.map((t) => <button key={t} type="button" className="fchip" aria-pressed={f.tag === t} onClick={() => set({ ...f, tag: f.tag === t ? null : t })}>{t}</button>)}
      </div>
      <div className="fgroup" role="group" aria-label="Rating">
        <span className="fgroup-label">Rating</span>
        <button type="button" className="fchip" role="switch" aria-checked={f.min4} onClick={() => set({ ...f, min4: !f.min4 })}>Minimum rating 4+ <small>(sample)</small></button>
      </div>
    </>
  );
}

/** Product grid with filters, sort, result count, "Clear all" and (on /shop) "Load more". Phones get a sticky bar and a bottom sheet with Apply. */
export function ShopBrowser({ products, paged = false }: { products: Product[]; paged?: boolean }) {
  const params = useSearchParams();
  const q = paged ? (params.get("q") ?? "").trim() : "";
  const [f, setF] = useState<Filters>(NONE);
  const [draft, setDraft] = useState<Filters>(NONE);
  const [sheet, setSheet] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");
  const [shown, setShown] = useState(PAGE);

  const list = useMemo(() => {
    let l = products.filter((p) => (!f.price || PRICES.find((x) => x.key === f.price)!.ok(p.price)) && (!f.tag || p.tag === f.tag) && (!f.min4 || p.rating >= 4) && (!q || matches(p, q)));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === "top") l = [...l].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    else l = [...l].sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));
    return l;
  }, [products, f, sort, q]);

  const active = (f.price ? 1 : 0) + (f.tag ? 1 : 0) + (f.min4 ? 1 : 0);
  const visible = paged ? list.slice(0, shown) : list;
  const change = (n: Filters) => { setF(n); setShown(PAGE); };
  const clear = () => { change(NONE); setDraft(NONE); };

  return (
    <>
      <div className="filterbar">
        <div className="fb-in container">
          <div className="fb-inline"><Controls f={f} set={change} /></div>
          <button type="button" className="fb-open" onClick={() => { setDraft(f); setSheet(true); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Filters{active > 0 && <span className="fb-count">{active}</span>}
          </button>
          <label className="fb-sort">
            <span>Sort</span>
            <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); setShown(PAGE); }}>
              <option value="featured">Featured</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
              <option value="top">Top rated</option>
            </select>
          </label>
        </div>
      </div>
      <div className="fb-meta" aria-live="polite">
        <p><strong>{list.length}</strong> {list.length === 1 ? "product" : "products"}{q && <> for “{q}”</>}</p>
        {q && <Link href="/shop" className="textlink">Clear search</Link>}
        {(active > 0 || sort !== "featured") && <button type="button" className="textlink" onClick={() => { clear(); setSort("featured"); }}>Clear all</button>}
      </div>

      {list.length === 0 ? (
        <div className="empty"><p className="serif" style={{ fontSize: "1.8rem" }}>Nothing matches those filters.</p><button type="button" className="btn btn-outline" onClick={clear}>Clear all</button></div>
      ) : (
        <div className="grid" data-stagger key={`${active}-${sort}-${q}`}>{visible.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 4} />)}</div>
      )}
      {paged && list.length > shown && (
        <div className="loadmore"><button type="button" className="btn btn-outline" onClick={() => setShown((n) => n + PAGE)}>Load more <small>({list.length - shown} left)</small></button></div>
      )}
      <SampleNote />

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Filters" footer={
        <div className="sheet-actions">
          <button type="button" className="btn btn-outline" onClick={() => setDraft(NONE)}>Clear</button>
          <button type="button" className="btn btn-solid" onClick={() => { change(draft); setSheet(false); }}>Apply</button>
        </div>
      }>
        <div className="sheet-filters"><Controls f={draft} set={setDraft} /></div>
      </Sheet>
    </>
  );
}
