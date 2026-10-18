"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { finePointer, isStatic, setLenis, getLenis } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

const clear = "transform,opacity";
const release = () => document.documentElement.classList.remove("mo-hold");

/**
 * Smooth scroll + every scroll/entrance animation, driven by data attributes in the markup:
 *   data-hero="…"        hero pieces (kicker, title, lead, cta) · data-hero-pic = image (scale-in + parallax)
 *   data-reveal          fade + rise when it scrolls in
 *   data-stagger         children rise in one after another
 *   data-img-reveal      image box fades up while its picture settles from a slight zoom
 *   data-parallax="8"    (mouse/trackpad only) drifts by ±8 % of its own height
 * The default (CSS) state of everything is the final state; `mo-hold` only hides pieces until this runs.
 */
export function Motion() {
  const path = usePathname();

  // One Lenis for the whole session (mouse / trackpad only; touch keeps native scroll).
  useEffect(() => {
    if (isStatic() || !finePointer()) { release(); return; }
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); };
  }, []);

  useLayoutEffect(() => {
    if (isStatic()) { release(); return; }
    let cancelled = false;
    getLenis()?.scrollTo(0, { immediate: true, force: true });

    const ctx = gsap.context(() => {
      const fine = finePointer();
      const wide = window.matchMedia("(min-width: 1000px)").matches;

      // —— hero ——
      const pic = document.querySelector<HTMLElement>("[data-hero-pic]");
      const kicker = document.querySelector<HTMLElement>('[data-hero="kicker"]');
      const title = document.querySelector<HTMLElement>('[data-hero="title"]');
      const lead = document.querySelector<HTMLElement>('[data-hero="lead"]');
      const cta = document.querySelector<HTMLElement>('[data-hero="cta"]');
      if (title) {
        gsap.set(title, { opacity: 0 });
        gsap.set([kicker, lead, cta], { opacity: 0, y: 18 });
        if (pic) gsap.fromTo(pic, { scale: 1.14 }, { scale: 1, duration: 2.6, ease: "power2.out" });
        const play = () => {
          if (cancelled) return;
          ctx.add(() => { // created after the fonts load, still reverted with the rest
            const split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "hero-line" });
            gsap.set(title, { opacity: 1 });
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.to(kicker, { opacity: 1, y: 0, duration: 0.7, clearProps: clear }, 0)
              .from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.13 }, 0.1)
              .to(lead, { opacity: 1, y: 0, duration: 0.8, clearProps: clear }, 0.7)
              .to(cta, { opacity: 1, y: 0, duration: 0.8, clearProps: clear }, 1.15); // button last
          });
        };
        Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(play);
      }
      if (pic && fine && wide) {
        gsap.fromTo(pic, { yPercent: -5 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: pic.parentElement, start: "top top", end: "bottom top", scrub: true } });
      }

      // —— reveals ——
      const trig = (el: Element) => ({ trigger: el, start: "top 90%", once: true });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 28, duration: 0.9, ease: "power3.out", clearProps: clear, scrollTrigger: trig(el) });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(Array.from(el.children), { opacity: 0, y: 38, duration: 0.95, ease: "power3.out", stagger: 0.1, clearProps: clear, scrollTrigger: trig(el) });
      });
      gsap.utils.toArray<HTMLElement>("[data-img-reveal]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: trig(el) });
        tl.from(el, { opacity: 0, y: 30, duration: 1, ease: "power3.out", clearProps: clear }, 0);
        if (img) tl.from(img, { scale: 1.18, duration: 1.8, ease: "power2.out", clearProps: "transform" }, 0);
      });

      // —— parallax (mouse/trackpad only) ——
      if (fine) {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const d = parseFloat(el.dataset.parallax || "8");
          gsap.fromTo(el, { yPercent: -d }, { yPercent: d, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
      }
    });

    release();
    // images and fonts shift the layout: re-measure once they are in
    const refresh = () => { if (!cancelled) ScrollTrigger.refresh(); };
    const t = setTimeout(refresh, 400);
    window.addEventListener("load", refresh);
    document.fonts.ready.then(refresh);

    return () => {
      cancelled = true;
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert(); // kills every ScrollTrigger and puts inline styles back
    };
  }, [path]);

  return null;
}
