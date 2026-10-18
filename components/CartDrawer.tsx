"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { Drawer } from "./Drawer";
import { CartLines } from "./CartLines";
import { inr } from "@/lib/format";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, subtotal, ready } = useCart();
  const close = () => setDrawerOpen(false);
  return (
    <Drawer open={drawerOpen} onClose={close} side="right" title="Your cart">
      {!ready || lines.length === 0 ? (
        <div className="drawer-empty">
          <p className="serif">Your cart is empty.</p>
          <Link href="/" className="btn btn-outline" onClick={close}>Continue shopping</Link>
        </div>
      ) : (
        <>
          <div className="drawer-body"><CartLines compact onNavigate={close} /></div>
          <div className="drawer-foot">
            <div className="sum-row"><span>Subtotal</span><strong>{inr(subtotal)}</strong></div>
            <p className="fine">Sample prices. Shipping is shown at checkout.</p>
            <Link href="/checkout" className="btn btn-solid btn-block" onClick={close}>Checkout</Link>
            <Link href="/cart" className="textlink" onClick={close}>View full cart</Link>
          </div>
        </>
      )}
    </Drawer>
  );
}
