import { Rating } from "./Rating";
import { breakdown, reviewsFor } from "@/data/reviews";
import type { Product } from "@/data/products";

/** Rating summary (average, 5-to-1 bars) and three SAMPLE reviews. */
export function ReviewsPanel({ product }: { product: Product }) {
  const rows = breakdown(product.rating, product.reviewCount);
  const reviews = reviewsFor(product);
  return (
    <div className="reviews">
      <p className="sample-note sample-note-inline reviews-note">Sample reviews for this concept demo</p>
      <div className="rsum">
        <div className="rsum-score">
          <b>{product.rating.toFixed(1)}</b>
          <Rating value={product.rating} />
          <small>Based on {product.reviewCount} sample reviews</small>
        </div>
        <ul className="rbars" aria-label="Sample rating breakdown">
          {rows.map((r) => (
            <li key={r.star}>
              <span className="rbar-k">{r.star} star</span>
              <span className="rbar"><i style={{ "--p": r.pct / 100 } as React.CSSProperties} /></span>
              <span className="rbar-n">{r.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="rlist">
        {reviews.map((r) => (
          <li key={r.who} className="review">
            <div className="review-top"><Rating value={r.stars} /><span className="review-who">{r.who}</span></div>
            <h3 className="review-title">{r.title}</h3>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
