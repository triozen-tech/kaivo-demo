"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import boxes from "@/data/cutbox.json";
import { finePointer, isStatic } from "@/lib/motion";

type Box = { l: number; r: number; t: number; b: number };

/**
 * Transparent product cut-out on the tinted card/media background, with a soft shadow ellipse underneath.
 * Hover lift and shadow growth are CSS (.cut-host:hover). On a mouse the object also tilts toward the cursor
 * (transform only); touch and ?static=1 skip the tilt. The host is the nearest [data-tilt-host] ancestor.
 */
export function CutPic({ name, alt, sizes, priority = false, tilt = 7, shift = 8 }: { name: string; alt: string; sizes: string; priority?: boolean; tilt?: number; shift?: number }) {
  const obj = useRef<HTMLSpanElement>(null);
  const b = (boxes as Record<string, Box>)[name];

  useEffect(() => {
    const node = obj.current;
    const host = node?.closest<HTMLElement>("[data-tilt-host]");
    if (!node || !host || isStatic() || !finePointer()) return;
    const to = { rotationY: gsap.quickTo(node, "rotationY", { duration: 0.6, ease: "power3.out" }), rotationX: gsap.quickTo(node, "rotationX", { duration: 0.6, ease: "power3.out" }), x: gsap.quickTo(node, "x", { duration: 0.7, ease: "power3.out" }), y: gsap.quickTo(node, "y", { duration: 0.7, ease: "power3.out" }) };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      to.rotationY(nx * tilt); to.rotationX(-ny * tilt); to.x(nx * shift); to.y(ny * shift * 0.6);
    };
    const leave = () => { to.rotationY(0); to.rotationX(0); to.x(0); to.y(0); };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => { host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); gsap.set(node, { clearProps: "transform" }); };
  }, [tilt, shift]);

  return (
    <span className="cut">
      {b && <span className="cut-shadow" aria-hidden="true" style={{ left: `${((b.l + b.r) / 2) * 100}%`, top: `${b.b * 100}%`, width: `${(b.r - b.l) * 92}%` }} />}
      <span className="cut-lift">
        <span className="cut-obj" ref={obj}>
          <Image src={`/images/kaivo/cut/${name}.png`} alt={alt} fill sizes={sizes} quality={92} preload={priority} style={{ objectFit: "cover" }} />
        </span>
      </span>
    </span>
  );
}
