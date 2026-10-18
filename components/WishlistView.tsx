"use client";

import Link from "next/link";
import { useRef } from "react";
import { getProduct } from "@/data/products";
import { useWish } from "./WishProvider";
import { useCart } from "./CartProvider";
import { Pic } from "./ProductImage";
import { Price } from "./Price";
import { Rating } from "./Rating";
import { SampleNote } from "./SampleNote";
import { flyToCart } from "@/lib/fly";

export function WishlistView() {
  const { slugs, toggle } = useWish();
  const { add } = useCart();
  const busy = useRef(false);
  const items = slugs.map(getProduct).filter((p) => !!p);

  if (items.length === 0) {
    return (
      <div className="empty">
        <p className="serif" style={{ fontSize: "1.8rem" }}>Nothing saved yet.</p>
        <p className="muted">Tap the heart on any product to keep it here.</p>
        <Link href="/shop" className="btn btn-solid">Browse the shop</Link>
      </div>
    );
  }
  return (
    <>
      <ul className="wish-list">
        {items.map((p) => (
          <li key={p!.slug} className="wish-item">
            <Link href={`/p/${p!.slug}`} className="wish-img" aria-label={p!.name}><Pic name={p!.image} alt="" sizes="120px" /></Link>
            <div className="wish-main">
              <Link href={`/p/${p!.slug}`} className="wish-name">{p!.name}</Link>
              <Rating value={p!.rating} count={p!.reviewCount} />
              <Price value={p!.price} />
              <div className="wish-actions">
                <button type="button" className="btn btn-solid" data-cursor="Add" onClick={async (e) => {
                  if (busy.current) return;
                  busy.current = true;
                  await flyToCart(e.currentTarget.closest<HTMLElement>(".wish-item")?.querySelector<HTMLElement>(".wish-img") ?? null);
                  add(p!.slug, 1, false);
                  busy.current = false;
                }}>Add to cart</button>
                <button type="button" className="textlink wish-remove" onClick={() => toggle(p!.slug)} aria-label={`Remove ${p!.name} from wishlist`}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <SampleNote />
    </>
  );
}
