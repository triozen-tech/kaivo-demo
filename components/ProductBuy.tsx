"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { Stepper } from "./Stepper";
import { flyToCart } from "@/lib/fly";

export function ProductBuy({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  const { add, setDrawerOpen } = useCart();
  const flying = useRef(false);
  const router = useRouter();

  return (
    <div className="buy">
      <div className="buy-row">
        <span className="label">Quantity</span>
        <Stepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label="Quantity" />
      </div>
      <div className="buy-actions">
        <button type="button" className="btn btn-solid" onClick={async () => {
          if (flying.current) return;
          flying.current = true;
          await flyToCart(document.querySelector<HTMLElement>(".pdp-media"));
          add(slug, qty, false); // the badge bumps as the picture lands
          setTimeout(() => { setDrawerOpen(true); flying.current = false; }, document.documentElement.classList.contains("mo") ? 380 : 0);
        }}>Add to cart</button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            add(slug, qty, false);
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
