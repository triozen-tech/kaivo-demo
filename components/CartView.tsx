"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { CartLines } from "./CartLines";
import { inr } from "@/lib/format";

export function CartView() {
  const { lines, subtotal, ready, count } = useCart();
  if (!ready) return <div className="skeleton" aria-hidden="true" />;
  if (lines.length === 0)
    return (
      <div className="empty">
        <p className="lead">Nothing here yet.</p>
        <Link href="/" className="btn btn-solid">Start shopping</Link>
      </div>
    );
  return (
    <div className="cart-layout">
      <CartLines />
      <aside className="summary" aria-label="Order summary">
        <h2 className="h4">Summary</h2>
        <div className="sum-row"><span>Items ({count})</span><strong>{inr(subtotal)}</strong></div>
        <div className="sum-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <p className="fine">All prices are sample prices.</p>
        <Link href="/checkout" className="btn btn-solid btn-block">Go to checkout</Link>
        <Link href="/" className="textlink">Continue shopping</Link>
      </aside>
    </div>
  );
}
