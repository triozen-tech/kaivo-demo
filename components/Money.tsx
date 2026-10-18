"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { omr } from "@/lib/format";
import { isStatic } from "@/lib/motion";

/** An OMR amount (integer baisa) that counts smoothly to its new value (instantly in ?static=1). */
export function Money({ value, className }: { value: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (isStatic() || shown.current === value) { node.textContent = omr(value); shown.current = value; return; }
    const o = { v: shown.current };
    const tw = gsap.to(o, { v: value, duration: 0.7, ease: "power2.out", onUpdate: () => { shown.current = o.v; node.textContent = omr(Math.round(o.v)); }, onComplete: () => { shown.current = value; node.textContent = omr(value); } });
    return () => { tw.kill(); node.textContent = omr(value); shown.current = value; };
  }, [value]);
  return <span ref={el} className={className}>{omr(value)}</span>;
}
