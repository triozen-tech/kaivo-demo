import { categories } from "@/data/categories";

/** Slow strip of the five category names. The track holds two identical halves and slides by exactly one half (CSS transform, `.mo` only). */
export function Marquee() {
  const half = (hidden: boolean) => (
    <ul className="marquee-half" aria-hidden={hidden || undefined}>
      {categories.map((c) => (
        <li key={c.slug}><span className="serif">{c.name}</span><i aria-hidden="true" /></li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="region" aria-label="Our categories">
      <div className="marquee-track">
        {half(false)}
        <div className="marquee-dup">{half(true)}</div>
      </div>
    </div>
  );
}
