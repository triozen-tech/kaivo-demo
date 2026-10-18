"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { Stepper } from "./Stepper";

export function ProductBuy({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const router = useRouter();

  return (
    <div className="buy">
      <div className="buy-row">
        <span className="label">Quantity</span>
        <Stepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label="Quantity" />
      </div>
      <div className="buy-actions">
        <button type="button" className="btn btn-solid" onClick={() => add(slug, qty)}>Add to cart</button>
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
