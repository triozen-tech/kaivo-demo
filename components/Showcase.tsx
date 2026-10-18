"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { Pic } from "./ProductImage";
import { CutCrop } from "./CutCrop";
import { MorphLink } from "./MorphLink";
import { ArrowIcon } from "./Icons";
import { isStatic } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// where the floating cut-outs sit around the picture, and how far they drift (px) while the panel crosses the screen
const slots = [
  { left: "-7%", bottom: "-5%", h: "34vh", drift: -170 },
  { right: "-4%", top: "-9%", h: "24vh", drift: 120 },
  { right: "9%", bottom: "-7%", h: "20vh", drift: -260 },
] as const;

const two = (n: number) => String(n).padStart(2, "0");

/**
 * Desktop mouse only (CSS shows it, see .showcase): the section pins and the page's vertical scroll slides the five
 * category panels sideways. Below 1000 px, on touch and in ?static=1 the stacked tiles are shown instead and nothing here runs.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || isStatic()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1000px) and (hover: hover) and (pointer: fine)", () => {
      const track = el.querySelector<HTMLElement>(".sc-track")!;
      const panels = gsap.utils.toArray<HTMLElement>(".sc-panel", el);
      const count = el.querySelector<HTMLElement>(".sc-count b")!;
      const fill = el.querySelector<HTMLElement>(".sc-line i")!;
      const dist = () => track.scrollWidth - window.innerWidth;
      let shown = 0;
      const slide = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: el, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (st) => {
            gsap.set(fill, { scaleX: st.progress });
            const n = Math.min(panels.length - 1, Math.round(st.progress * (panels.length - 1)));
            if (n !== shown) { shown = n; count.textContent = two(n + 1); }
          },
        },
      });
      panels.forEach((p) => {
        p.querySelectorAll<HTMLElement>("[data-drift]").forEach((o) => {
          gsap.fromTo(o, { x: -parseFloat(o.dataset.drift!) / 2 }, { x: parseFloat(o.dataset.drift!) / 2, ease: "none", scrollTrigger: { trigger: p, containerAnimation: slide, start: "left right", end: "right left", scrub: true } });
        });
        gsap.fromTo(p.querySelector(".sc-name"), { x: 90 }, { x: -90, ease: "none", scrollTrigger: { trigger: p, containerAnimation: slide, start: "left right", end: "right left", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="showcase" data-tint="sage" aria-labelledby="sc-h">
      <h2 id="sc-h" className="sc-title">Shop by category</h2>
      <p className="sc-count" aria-hidden="true"><b>01</b> / {two(categories.length)}</p>
      <div className="sc-track">
        {categories.map((c, i) => {
          const cuts = products.filter((p) => p.category === c.slug && p.cut).slice(0, 3);
          return (
            <article key={c.slug} className="sc-panel" data-morph-scope>
              <div className="sc-copy">
                <p className="sc-n">{two(i + 1)}</p>
                <h3 className="sc-name">{c.name}</h3>
                <p className="sc-tag">{c.tagline}</p>
                <MorphLink href={`/c/${c.slug}`} className="btn btn-solid" morph=".sc-img">Shop {c.name} <ArrowIcon /></MorphLink>
              </div>
              <div className="sc-art">
                <MorphLink href={`/c/${c.slug}`} className="sc-img" morph=".sc-img" aria-label={`Shop ${c.name}`} data-cursor="View">
                  <Pic name={c.banner} alt="" sizes="60vw" position={c.focal} priority={i === 0} />
                </MorphLink>
                {cuts.map((p, k) => (
                  <span key={p.slug} className="sc-float" data-drift={slots[k].drift} style={{ ...slots[k], height: slots[k].h }}>
                    <CutCrop name={p.image} className="sc-cut" style={{ height: "100%" }} />
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <div className="sc-line" aria-hidden="true"><i /></div>
    </section>
  );
}
