"use client";

import { useWish } from "./WishProvider";

/** Heart toggle. The 44 px button holds a smaller round chip; filling it plays a small pop (.mo only). */
export function HeartButton({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const { has, toggle } = useWish();
  const on = has(slug);
  return (
    <button type="button" className={`heart ${className}${on ? " is-on" : ""}`} aria-pressed={on} aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`} onClick={() => toggle(slug)}>
      <span className="heart-chip" key={on ? "on" : "off"}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S4 15.1 4 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.4c0 5.700-8 10.800-8 10.800Z" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      </span>
    </button>
  );
}
