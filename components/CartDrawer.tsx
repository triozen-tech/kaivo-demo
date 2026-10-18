"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { Drawer } from "./Drawer";
import { CartLines } from "./CartLines";
import { ShipBar } from "./ShipBar";
import { Voucher } from "./Voucher";
import { CompleteSet } from "./CompleteSet";
import { Money } from "./Money";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, subtotal, discount, code, net, ready } = useCart();
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
          <div className="drawer-body"><ShipBar /><CartLines compact onNavigate={close} /><CompleteSet /></div>
          <div className="drawer-foot">
            <Voucher />
            <div className="sum-row"><span>Subtotal</span><Money value={subtotal} /></div>
            {discount > 0 && <div className="sum-row sum-disc"><span>Discount ({code})</span><span>−<Money value={discount} /></span></div>}
            <div className="sum-row sum-total"><span>Total</span><strong><Money value={net} /></strong></div>
            <p className="fine">Sample prices. Shipping is shown at checkout.</p>
            <Link href="/checkout" className="btn btn-solid btn-block" onClick={close}>Checkout</Link>
            <Link href="/cart" className="textlink" onClick={close}>View full cart</Link>
          </div>
        </>
      )}
    </Drawer>
  );
}
