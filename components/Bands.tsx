import Link from "next/link";
import { Pic } from "./ProductImage";
import { ArrowIcon } from "./Icons";

type BandProps = { img: string; alt: string; position?: string; shade?: number; id: string; eyebrow?: string; title: string; text?: string; code?: string; href: string; cta: string; tint?: string };

function Band({ img, alt, position, shade = 0.78, id, eyebrow, title, text, code, href, cta, tint }: BandProps) {
  return (
    <section className="band-wrap container" aria-labelledby={id} data-tint={tint}>
      <div className="band" style={{ "--sm": shade } as React.CSSProperties} data-reveal>
        <div className="band-img"><Pic name={img} alt={alt} sizes="(max-width: 1400px) 100vw, 1360px" position={position} /></div>
        <div className="band-shade" aria-hidden="true" />
        <div className="band-copy">
          {eyebrow && <p className="band-eyebrow">{eyebrow}</p>}
          <h2 id={id} className="display">{title}</h2>
          {text && <p className="band-text">{text}</p>}
          {code && <p className="band-code"><span>Use code</span><b>{code}</b><span>(sample)</span></p>}
          <Link href={href} className="btn btn-solid">{cta} <ArrowIcon /></Link>
        </div>
      </div>
    </section>
  );
}

/** Mid-page offer on home, over a lifestyle picture. */
export function PromoBanner() {
  return <Band id="promo" tint="clay" img="l-2" alt="A shaker bottle and a folded towel in a canvas tote on a wooden bench" position="75% 50%" eyebrow="This season" title="Your everyday companion" text="From the morning commute to the evening walk." code="KAIVO10" href="/shop" cta="Shop" />;
}

/** Last band before the footer on home and /shop. */
export function ClosingBanner({ href = "/shop", cta = "Shop" }: { href?: string; cta?: string }) {
  return <Band id="closing" tint="cream" img="b-jars" alt="Glass jars and a steel flask on a light wooden table" position="90% 50%" title="Better mornings start here" text="Small, well-made things for the way the day begins." href={href} cta={cta} />;
}
