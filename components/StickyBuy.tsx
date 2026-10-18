"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Pic } from "./ProductImage";
import { Price } from "./Price";
import { flyToCart } from "@/lib/fly";

/** Slim bar with name, price and Add to cart. It slides up once the main Add to cart button has scrolled out above the viewport. */
export function StickyBuy({ slug, name, price, image }: { slug: string; name: string; price: number; image: string }) {
  const { add, setDrawerOpen } = useCart();
  const [show, setShow] = useState(false);
  const thumb = useRef<HTMLSpanElement>(null);
  const flying = useRef(false);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(".buy-actions .btn-solid");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && (e.boundingClientRect.bottom < 0 || window.innerWidth < 700)), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-buy${show ? " is-on" : ""}`} aria-hidden={show ? undefined : true} inert={!show}>
      <div className="container sticky-in">
        <span className="sticky-thumb" ref={thumb}><Pic name={image} alt="" sizes="48px" /></span>
        <span className="sticky-name">{name}</span>
        <Price value={price} className="sticky-price" />
        <button type="button" className="btn btn-solid" data-cursor="Add" onClick={async () => {
          if (flying.current) return;
          flying.current = true;
          await flyToCart(thumb.current);
          add(slug, 1, false);
          setTimeout(() => { setDrawerOpen(true); flying.current = false; }, document.documentElement.classList.contains("mo") ? 380 : 0);
        }}>Add to cart</button>
      </div>
    </div>
  );
}
