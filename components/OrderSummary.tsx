"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { isStatic } from "@/lib/motion";
import Link from "next/link";
import { omr } from "@/lib/format";
import { ORDER_KEY, type Order } from "@/lib/order";

export function OrderSummary() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_KEY);
      const o = raw ? (JSON.parse(raw) as Order) : null;
      setOrder(o && typeof o.number === "string" && o.number.startsWith("OT-") && Array.isArray(o.lines) ? o : null);
    } catch {
      setOrder(null);
    }
  }, []);

  // draw-in check, a soft burst of clay/sage circles, then the summary rows stagger in (nothing runs in ?static=1)
  useEffect(() => {
    if (!order || isStatic() || !root.current) return;
    const ctx = gsap.context(() => {
      const path = root.current!.querySelector<SVGPathElement>(".ok-check path");
      const ring = root.current!.querySelector<SVGCircleElement>(".ok-check circle");
      const len = (el: SVGGeometryElement | null) => el?.getTotalLength() ?? 0;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      if (ring) tl.fromTo(ring, { strokeDasharray: len(ring), strokeDashoffset: len(ring) }, { strokeDashoffset: 0, duration: 0.7 }, 0);
      if (path) tl.fromTo(path, { strokeDasharray: len(path), strokeDashoffset: len(path) }, { strokeDashoffset: 0, duration: 0.45 }, 0.55);
      const dots = gsap.utils.toArray<HTMLElement>(".ok-dot");
      dots.forEach((d, i) => {
        const a = (i / dots.length) * Math.PI * 2 + 0.3, r = 70 + (i % 3) * 26;
        tl.fromTo(d, { x: 0, y: 0, scale: 0.3, opacity: 0 }, { x: Math.cos(a) * r, y: Math.sin(a) * r, scale: 1, opacity: 0.9, duration: 0.55 }, 0.85)
          .to(d, { opacity: 0, scale: 0.6, duration: 0.7, ease: "power1.in" }, 1.25);
      });
      tl.from(".ok-rise", { opacity: 0, y: 22, duration: 0.7, stagger: 0.09, clearProps: "transform,opacity" }, 0.7)
        .from(".success .mini li, .success .sum-row", { opacity: 0, y: 16, duration: 0.55, stagger: 0.07, clearProps: "transform,opacity" }, 1.0);
    }, root);
    return () => ctx.revert();
  }, [order]);

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
    <div className="success" ref={root}>
      <div className="ok" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <i key={i} className={`ok-dot ${i % 2 ? "ok-sage" : "ok-clay"}`} style={{ width: 8 + (i % 4) * 4, height: 8 + (i % 4) * 4 }} />)}
        <svg className="ok-check" width="96" height="96" viewBox="0 0 96 96" fill="none"><circle cx="48" cy="48" r="44" stroke="var(--clay)" strokeWidth="3" /><path d="M29 49l13 13 26-28" stroke="var(--clay)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <p className="label ok-rise">Demo order placed</p>
      <h1 className="h1 ok-rise">Thank you, {order.name.split(" ")[0]}.</h1>
      <p className="lead ok-rise">Your order number is <strong className="ordno">{order.number}</strong>. This is a concept store, so nothing was charged and nothing will ship.</p>
      <div className="summary summary-flat ok-rise">
        <h2 className="h4">Summary</h2>
        <ul className="mini mini-text">
          {order.lines.map((l) => (
            <li key={l.name}><span>{l.qty} × {l.name}</span><span>{omr(l.price * l.qty)}</span></li>
          ))}
        </ul>
        <div className="sum-row"><span>Subtotal</span><span>{omr(order.subtotal)}</span></div>
        {order.discount ? <div className="sum-row sum-disc"><span>Discount ({order.code})</span><span>−{omr(order.discount)}</span></div> : null}
        <div className="sum-row"><span>Shipping ({order.delivery})</span><span>{order.shipping === 0 ? "Free" : omr(order.shipping)}</span></div>
        <div className="sum-row sum-total"><span>Total</span><strong>{omr(order.total)}</strong></div>
        <p className="fine">All prices are sample prices. Delivery to {order.city}.</p>
      </div>
      <Link href="/" className="btn btn-solid">Back to the shop</Link>
    </div>
  );
}
