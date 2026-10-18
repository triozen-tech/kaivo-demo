import Link from "next/link";
import { categories } from "@/data/categories";
import { featuredProducts } from "@/data/products";
import { Pic } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { ArrowIcon } from "@/components/Icons";
import { lifestyle } from "@/data/lifestyle";
import { Marquee } from "@/components/Marquee";
import { MorphLink } from "@/components/MorphLink";
import { Showcase } from "@/components/Showcase";
import { SampleNote } from "@/components/SampleNote";


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
          <div className="hero-pic" data-hero-pic><Pic name="hero" alt="Frosted bottles, a cup and a jar arranged on curved cream steps in soft light" sizes="100vw" position="70% 50%" priority /></div>
        </div>
        <div className="container hero-copy">
          <p className="hero-pill" data-hero="kicker"><i aria-hidden="true" />New season · Free sample shipping</p>
          <h1 className="display" data-hero="title">Quiet things for the way you live.</h1>
          <p className="lead" data-hero="lead">Tumblers, retro kitchen, jars and daily rituals. Made to be used, and to be looked at.</p>
          <Link href="/c/tumblers" className="btn btn-solid" data-hero="cta">Shop the collection <ArrowIcon /></Link>
        </div>
      </section>

      <Showcase />

      <section className="section container cats-stack" aria-labelledby="cats" data-tint="sage">
        <div className="section-head" data-reveal>
          <h2 id="cats" className="h2">Shop by category</h2>
        </div>
        <div className="cat-grid" data-stagger>
          {categories.map((c) => (
            <MorphLink key={c.slug} href={`/c/${c.slug}`} className="cat-tile" morph=".cat-img" data-cursor="View">
              <span className="cat-img"><Pic name={c.banner} alt="" sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw" position={c.tile} /></span>
              <span className="cat-meta">
                <span className="cat-name">{c.name}</span>
                <span className="cat-tag">{c.tagline}</span>
              </span>
            </MorphLink>
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="feat" data-tint="cream">
        <div className="section-head" data-reveal>
          <h2 id="feat" className="h2">Featured</h2>
          <p className="muted">A few things we reach for every day.</p>
        </div>
        <div className="grid" data-stagger>
          {feat.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
        <SampleNote />
      </section>

      <Marquee />

      <section className="section container" aria-labelledby="life" data-tint="clay">
        <div className="section-head" data-reveal>
          <h2 id="life" className="h2">Made for everyday</h2>
        </div>
        <div className="life-grid" data-stagger>
          {lifestyle.map((l) => (
            <figure key={l.img} className="life-item">
              <div className="life-img"><div className="life-pic" data-parallax="7"><Pic name={l.img} alt={l.alt} sizes="(max-width: 800px) 100vw, 40vw" position={l.pos} /></div></div>
              <figcaption>{l.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="trust" aria-label="Why shop with Kaivo">
        <div className="container trust-grid" data-stagger>
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
