"use client";

import { useRef } from "react";
import { useCart } from "./CartProvider";
import { flyToCart } from "@/lib/fly";

/** Round cart button in the price row: adds 1 with the fly animation (the badge bumps on landing). Lives outside the card link. */
export function QuickAdd({ slug, name }: { slug: string; name: string }) {
  const { add } = useCart();
  const busy = useRef(false);
  return (
    <button type="button" className="quick-add" data-cursor="Add" aria-label={`Add ${name} to cart`} onClick={async (e) => {
      if (busy.current) return;
      busy.current = true;
      const card = e.currentTarget.closest<HTMLElement>(".pcard");
      await flyToCart(card?.querySelector<HTMLElement>(".pcard-img") ?? null);
      add(slug, 1, false);
      busy.current = false;
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 8V6.500a3 3 0 0 1 6 0V8M12 11.500v5M9.500 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    </button>
  );
}
