"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * First visit to the home page in a session: the wordmark rises on clay, then the curtain lifts (1.4 s).
 * The boot script in layout.tsx adds `intro` to <html> only when it applies (not in ?static=1, not on a return visit)
 * and removes it again after 3 s whatever happens. Transform and opacity only.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const d = document.documentElement;
    if (!d.classList.contains("intro") || !root.current || !word.current) return;
    try { sessionStorage.setItem("kaivo-intro", "1"); } catch { /* storage blocked: the intro may play again */ }
    const end = () => d.classList.remove("intro");
    const tl = gsap.timeline({ onComplete: end });
    tl.fromTo(word.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.05)
      .to(word.current, { opacity: 0, y: -14, duration: 0.3, ease: "power2.in" }, 0.7)
      .to(root.current, { yPercent: -100, duration: 0.65, ease: "power3.inOut" }, 0.75);
    return () => { tl.kill(); end(); };
  }, []);

  return <div ref={root} className="intro-curtain" aria-hidden="true"><span ref={word} className="intro-word">Kaivo</span></div>;
}
