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
import { UspRow, CategoryIcons } from "@/components/HomeBands";
import { SampleNote } from "@/components/SampleNote";
import { PromoBanner, ClosingBanner } from "@/components/Bands";
import { SocialGrid } from "@/components/SocialGrid";


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

      <UspRow />
      <CategoryIcons />

      <Showcase />

      <section className="section container cats-stack" aria-labelledby="cats" data-tint="sage">
        <div className="section-head" data-reveal>
          <h2 id="cats" className="h2">Shop by category</h2>
        </div>
        <div className="cat-grid" data-stagger>
          {categories.map((c) => (
            <MorphLink key={c.slug} href={`/c/${c.slug}`} className="cat-tile" morph=".cat-img" data-cursor="View" style={{ "--sm": c.shade?.m ?? 0.75, "--z": c.zoom?.s ?? 1, "--zo": c.zoom?.o ?? "50% 50%" } as React.CSSProperties}>
              <span className="cat-img"><Pic name={c.banner} alt="" sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw" position={c.tile} /></span>
              <span className="cat-shade" aria-hidden="true" />
              <span className="cat-meta">
                <span className="cat-name">{c.name}</span>
                <span className="cat-tag">{c.tagline}</span>
              </span>
              <span className="cat-chip" aria-hidden="true"><ArrowIcon /></span>
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

      <PromoBanner />

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

      <SocialGrid />
      <ClosingBanner />
    </>
  );
}
