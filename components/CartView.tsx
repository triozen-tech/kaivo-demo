"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { CartLines } from "./CartLines";
import { ShipBar } from "./ShipBar";
import { Voucher } from "./Voucher";
import { CompleteSet } from "./CompleteSet";
import { Money } from "./Money";

export function CartView() {
  const { lines, subtotal, discount, code, net, ready, count } = useCart();
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
      <div className="cart-main"><ShipBar /><CartLines /><CompleteSet /></div>
      <aside className="summary" aria-label="Order summary">
        <h2 className="h4">Summary</h2>
        <Voucher />
        <div className="sum-row"><span>Items ({count})</span><Money value={subtotal} /></div>
        {discount > 0 && <div className="sum-row sum-disc"><span>Discount ({code})</span><span>−<Money value={discount} /></span></div>}
        <div className="sum-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div className="sum-row sum-total"><span>Total</span><strong><Money value={net} /></strong></div>
        <p className="fine">All prices are sample prices.</p>
        <Link href="/checkout" className="btn btn-solid btn-block">Go to checkout</Link>
        <Link href="/" className="textlink">Continue shopping</Link>
      </aside>
    </div>
  );
}
