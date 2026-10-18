"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { finePointer, isStatic } from "@/lib/motion";

/**
 * Mouse desktops only: a dot plus a softly trailing ring. The ring grows and shows the label of the nearest
 * [data-cursor] ("View" on cards and tiles, "Add" on add-to-cart buttons). Also drives the magnetic pull on solid buttons.
 * Touch and ?static=1: nothing is added and the normal cursor stays.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const d = dot.current, r = ring.current, l = label.current;
    if (!d || !r || !l || isStatic() || !finePointer()) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const dx = gsap.quickTo(d, "x", { duration: 0.05, ease: "none" }), dy = gsap.quickTo(d, "y", { duration: 0.05, ease: "none" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" }), ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
    const magnets = new WeakMap<HTMLElement, { x: (v: number) => void; y: (v: number) => void }>();
    let magnet: HTMLElement | null = null;
    let current = "";

    const setLabel = (text: string) => {
      if (text === current) return;
      current = text;
      l.textContent = text || l.textContent; // keep the old word while the ring shrinks
      r.classList.toggle("is-label", !!text);
      d.classList.toggle("is-hidden", !!text);
    };
    const release = () => { if (magnet) { const m = magnets.get(magnet); m?.x(0); m?.y(0); magnet = null; } };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      root.classList.add("cursor-on");
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as Element | null;
      setLabel(t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "");
      r.classList.toggle("is-link", !current && !!t?.closest("a, button, [role=button], summary, label"));
      const b = t?.closest<HTMLElement>(".btn-solid:not(:disabled)") ?? null;
      if (b !== magnet) release();
      if (b) {
        magnet = b;
        let m = magnets.get(b);
        if (!m) { m = { x: gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" }), y: gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" }) }; magnets.set(b, m); }
        const box = b.getBoundingClientRect();
        m.x((e.clientX - (box.left + box.width / 2)) * 0.22);
        m.y((e.clientY - (box.top + box.height / 2)) * 0.3);
      }
    };
    const leave = () => { root.classList.remove("cursor-on"); release(); };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      release();
      root.classList.remove("has-cursor", "cursor-on");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cur-ring" aria-hidden="true"><i className="cur-bg" /><span ref={label} className="cur-label">View</span></div>
      <div ref={dot} className="cur-dot" aria-hidden="true" />
    </>
  );
}
