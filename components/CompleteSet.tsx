"use client";

import { useRef } from "react";
import { categories } from "@/data/categories";
import { products, getProduct, type Product } from "@/data/products";
import { useCart } from "./CartProvider";
import { Pic } from "./ProductImage";
import { Price } from "./Price";
import { flyToCart } from "@/lib/fly";

/** Two picks from categories that are not in the cart yet. */
export function CompleteSet() {
  const { lines, add } = useCart();
  const have = new Set(lines.map((l) => l.slug));
  const haveCats = new Set(lines.map((l) => getProduct(l.slug)?.category));
  const picks: Product[] = [];
  for (const c of categories) {
    if (picks.length === 2) break;
    if (haveCats.has(c.slug)) continue;
    const p = products.find((x) => x.category === c.slug && !have.has(x.slug));
    if (p) picks.push(p);
  }
  if (picks.length < 2) for (const p of products) if (picks.length < 2 && !have.has(p.slug) && !picks.includes(p)) picks.push(p);
  if (!lines.length) return null;
  return (
    <div className="cset">
      <h3 className="h4">Complete the set</h3>
      <ul>{picks.map((p) => <SetRow key={p.slug} p={p} onAdd={() => add(p.slug, 1, false)} />)}</ul>
    </div>
  );
}

function SetRow({ p, onAdd }: { p: Product; onAdd: () => void }) {
  const img = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  return (
    <li className="cset-row">
      <span className="cset-img" ref={img}><Pic name={p.image} alt="" sizes="64px" /></span>
      <span className="cset-main"><span className="cset-name">{p.name}</span><Price value={p.price} /></span>
      <button type="button" className="btn btn-outline btn-sm" data-cursor="Add" aria-label={`Add ${p.name} to cart`} onClick={async () => {
        if (busy.current) return;
        busy.current = true;
        await flyToCart(img.current);
        onAdd();
        busy.current = false;
      }}>Add</button>
    </li>
  );
}
