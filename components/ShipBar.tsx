"use client";

import { useCart } from "./CartProvider";
import { inr } from "@/lib/format";
import { FREE_EXPRESS_AT } from "@/lib/promo";

/** Free-express progress. The fill is a scaleX transform, so it grows smoothly as items are added. */
export function ShipBar() {
  const { subtotal } = useCart();
  const done = subtotal >= FREE_EXPRESS_AT;
  const p = Math.min(1, subtotal / FREE_EXPRESS_AT);
  return (
    <div className={`shipbar${done ? " is-done" : ""}`}>
      <p className="shipbar-text" aria-live="polite">
        {done ? (
          <><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> You unlocked free express delivery</>
        ) : (
          <>Add <strong>{inr(FREE_EXPRESS_AT - subtotal)}</strong> more for free express</>
        )}
      </p>
      <div className="shipbar-track" role="progressbar" aria-valuemin={0} aria-valuemax={FREE_EXPRESS_AT} aria-valuenow={Math.min(subtotal, FREE_EXPRESS_AT)} aria-label="Progress to free express delivery">
        <span className="shipbar-fill" style={{ transform: `scaleX(${p})` }} />
      </div>
    </div>
  );
}
