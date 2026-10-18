"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { inr } from "@/lib/format";
import { ORDER_KEY, type Order } from "@/lib/order";

export function OrderSummary() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_KEY);
      setOrder(raw ? (JSON.parse(raw) as Order) : null);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) return <div className="skeleton" aria-hidden="true" />;
  if (!order)
    return (
      <div className="center">
        <h1 className="h1">No recent order.</h1>
        <p className="lead">Place a demo order and its summary will show here.</p>
        <Link href="/" className="btn btn-solid">Back to the shop</Link>
      </div>
    );

  return (
    <div className="success">
      <p className="label">Demo order placed</p>
      <h1 className="h1">Thank you, {order.name.split(" ")[0]}.</h1>
      <p className="lead">Your order number is <strong className="ordno">{order.number}</strong>. This is a concept store, so nothing was charged and nothing will ship.</p>
      <div className="summary summary-flat">
        <h2 className="h4">Summary</h2>
        <ul className="mini mini-text">
          {order.lines.map((l) => (
            <li key={l.name}><span>{l.qty} × {l.name}</span><span>{inr(l.price * l.qty)}</span></li>
          ))}
        </ul>
        <div className="sum-row"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
        <div className="sum-row"><span>Shipping ({order.delivery})</span><span>{order.shipping === 0 ? "Free" : inr(order.shipping)}</span></div>
        <div className="sum-row sum-total"><span>Total</span><strong>{inr(order.total)}</strong></div>
        <p className="fine">All prices are sample prices. Delivery to {order.city}.</p>
      </div>
      <Link href="/" className="btn btn-solid">Back to the shop</Link>
    </div>
  );
}
