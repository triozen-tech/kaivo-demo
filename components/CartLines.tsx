"use client";

import Link from "next/link";
import { getProduct } from "@/data/products";
import { useCart } from "./CartProvider";
import { Pic } from "./ProductImage";
import { Stepper } from "./Stepper";
import { Price } from "./Price";
import { inr } from "@/lib/format";

export function CartLines({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { lines, setQty, remove } = useCart();
  return (
    <ul className={`lines${compact ? " lines-compact" : ""}`}>
      {lines.map((l) => {
        const p = getProduct(l.slug);
        if (!p) return null;
        return (
          <li key={l.slug} className="line">
            <Link href={`/p/${p.slug}`} className="line-img" onClick={onNavigate}>
              <Pic name={p.image} alt={p.name} sizes="120px" />
            </Link>
            <div className="line-main">
              <Link href={`/p/${p.slug}`} className="line-name" onClick={onNavigate}>{p.name}</Link>
              <Price value={p.price} />
              <div className="line-ctrl">
                <Stepper small value={l.qty} onChange={(n) => setQty(l.slug, n)} label={`Quantity of ${p.name}`} />
                <button type="button" className="textlink" onClick={() => remove(l.slug)} aria-label={`Remove ${p.name}`}>Remove</button>
              </div>
            </div>
            <strong className="line-total">{inr(p.price * l.qty)}</strong>
          </li>
        );
      })}
    </ul>
  );
}
