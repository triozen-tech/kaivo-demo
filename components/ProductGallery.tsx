"use client";

import { useRef, useState } from "react";
import { Pic } from "./ProductImage";

export type GalleryItem = { name: string; alt: string; position?: string; zoom?: number; label: string };

/** Three views of one product: cross-fading frame, thumbnails, swipe on touch. `.pdp-media` stays the element the fly-to-cart reads. */
export function ProductGallery({ items }: { items: GalleryItem[] }) {
  const [i, setI] = useState(0);
  const x0 = useRef<number | null>(null);
  const go = (n: number) => setI((n + items.length) % items.length);

  return (
    <div className="pdp-gallery">
      <div
        className="pdp-media"
        data-img-reveal
        onTouchStart={(e) => { x0.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (x0.current == null) return;
          const dx = e.changedTouches[0].clientX - x0.current;
          x0.current = null;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        }}
      >
        {items.map((it, n) => (
          <div key={it.name} className={`pdp-slide${n === i ? " is-active" : ""}`} aria-hidden={n === i ? undefined : true}>
            <div className="pdp-zoom" style={it.zoom ? { transform: `scale(${it.zoom})`, transformOrigin: it.position } : undefined}>
              <Pic name={it.name} alt={it.alt} sizes="(max-width: 900px) 100vw, 50vw" position={it.position} priority={n === 0} />
            </div>
          </div>
        ))}
      </div>
      <div className="thumbs" role="group" aria-label="Product pictures">
        {items.map((it, n) => (
          <button key={it.name} type="button" className="thumb" aria-pressed={n === i} aria-label={it.label} onClick={() => setI(n)}>
            <span className="thumb-img"><Pic name={it.name} alt="" sizes="120px" position={it.position} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}
