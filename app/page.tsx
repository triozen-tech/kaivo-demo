import Link from "next/link";
import { categories } from "@/data/categories";
import { featuredProducts } from "@/data/products";
import { Pic } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { ArrowIcon } from "@/components/Icons";

const lifestyle = [
  { img: "l-1", alt: "A cream kettle steaming on a wooden counter beside a cup and a plant", pos: "40% 50%", caption: "Slow mornings" },
  { img: "l-2", alt: "A shaker bottle and a folded towel in a canvas tote on a wooden bench", pos: "55% 50%", caption: "Out the door" },
  { img: "l-3", alt: "Serum and cream bottles on a wooden shelf in window light", pos: "30% 50%", caption: "Evening rituals" },
];

const trust = [
  { title: "Free sample shipping", text: "Standard delivery is free on every demo order.", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01" },
  { title: "Easy returns", text: "Changed your mind? Send it back within 30 days.", d: "M4 12a8 8 0 1 0 3-6.2M4 4v4h4" },
  { title: "Secure demo checkout", text: "A concept store: no payment is ever taken.", d: "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z" },
];

export default function Home() {
  const feat = featuredProducts();
  return (
    <>
      <section className="hero">
        <div className="hero-img">
          <Pic name="hero" alt="Frosted bottles, a cup and a jar arranged on curved cream steps in soft light" sizes="100vw" position="70% 50%" priority />
        </div>
        <div className="container hero-copy">
          <p className="label">New season</p>
          <h1 className="display">Quiet things for the way you live.</h1>
          <p className="lead">Tumblers, retro kitchen, jars and daily rituals. Made to be used, and to be looked at.</p>
          <Link href="/c/tumblers" className="btn btn-solid">Shop the collection <ArrowIcon /></Link>
        </div>
      </section>

      <section className="section container" aria-labelledby="cats">
        <div className="section-head">
          <h2 id="cats" className="h2">Shop by category</h2>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="cat-tile">
              <span className="cat-img"><Pic name={c.banner} alt="" sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw" position={c.focal} /></span>
              <span className="cat-meta">
                <span className="cat-name">{c.name}</span>
                <span className="cat-tag">{c.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="feat">
        <div className="section-head">
          <h2 id="feat" className="h2">Featured</h2>
          <p className="muted">A few things we reach for every day.</p>
        </div>
        <div className="grid">
          {feat.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      <section className="section container" aria-labelledby="life">
        <div className="section-head">
          <h2 id="life" className="h2">Made for everyday</h2>
        </div>
        <div className="life-grid">
          {lifestyle.map((l) => (
            <figure key={l.img} className="life-item">
              <div className="life-img"><Pic name={l.img} alt={l.alt} sizes="(max-width: 800px) 100vw, 40vw" position={l.pos} /></div>
              <figcaption>{l.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="trust" aria-label="Why shop with Kaivo">
        <div className="container trust-grid">
          {trust.map((t) => (
            <div key={t.title} className="trust-item">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={t.d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
