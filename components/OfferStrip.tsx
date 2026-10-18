const messages = [
  "Free sample shipping on every demo order",
  "Use code ONTREND10 for 10% off (sample)",
  "New season is here",
  "Easy 30-day returns",
];

/** Slim ink strip under the header. Two identical halves slide by exactly one half (CSS transform, `.mo` only). */
export function OfferStrip() {
  const half = (hidden: boolean) => (
    <ul className="offer-half" aria-hidden={hidden || undefined}>
      {messages.map((m) => <li key={m}>{m}</li>)}
    </ul>
  );
  return (
    <div className="offer" role="region" aria-label="Offers">
      <div className="offer-track">
        {half(false)}
        <div className="offer-dup">{half(true)}</div>
      </div>
    </div>
  );
}
