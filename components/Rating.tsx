const star = "M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.2 6.1L12 17l-5.5 2.9 1.2-6.1L3.2 9.6l6.1-.8L12 3.2Z";

/** Clay stars (filled to the decimal), the number and the count. SAMPLE data: always shown next to a "Sample ratings" label. */
export function Rating({ value, count, className = "" }: { value: number; count?: number; className?: string }) {
  return (
    <span className={`rating ${className}`} role="img" aria-label={`Sample rating ${value.toFixed(1)} out of 5${count ? `, ${count} sample reviews` : ""}`}>
      <span className="stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24">
              <defs><clipPath id={`s${i}-${Math.round(value * 10)}`}><rect x="0" y="0" width={24 * fill} height="24" /></clipPath></defs>
              <path d={star} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.45" />
              <path d={star} fill="currentColor" clipPath={`url(#s${i}-${Math.round(value * 10)})`} />
            </svg>
          );
        })}
      </span>
      <span className="rating-num" aria-hidden="true">{value.toFixed(1)}</span>
      {count != null && <span className="rating-count" aria-hidden="true">({count})</span>}
    </span>
  );
}
