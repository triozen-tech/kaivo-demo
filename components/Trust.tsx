const items = [
  { t: "Free sample shipping", p: "Standard delivery is free on every demo order.", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.500 1.500 0 1 0 0-.01M17 19a1.500 1.500 0 1 0 0-.01" },
  { t: "Easy 30-day returns", p: "Changed your mind? Send it back within 30 days.", d: "M4 12a8 8 0 1 0 3-6.200M4 4v4h4" },
  { t: "Secure demo checkout", p: "A concept store: no payment is ever taken.", d: "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z" },
];

const Icon = ({ d, size }: { d: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** Three short rows under the Add to cart box on the product page. */
export function TrustBox() {
  return (
    <ul className="trustbox" aria-label="Shopping promises">
      {items.map((i) => (<li key={i.t}><Icon d={i.d} size={24} /><span><strong>{i.t}</strong><small>{i.p}</small></span></li>))}
    </ul>
  );
}

/** Dark band above the footer on every page. */
export function TrustBand() {
  return (
    <section className="trustband" aria-label="Why shop with OnTrend">
      <div className="container trustband-in">
        {items.map((i) => (
          <div key={i.t} className="tb-item">
            <Icon d={i.d} size={28} />
            <h3>{i.t}</h3>
            <p>{i.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
