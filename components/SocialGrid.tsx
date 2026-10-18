"use client";

import { useState } from "react";
import { Pic } from "./ProductImage";
import { HeartIcon } from "./Icons";

/** Crop variations of our own pictures only (no people). Tap or hover shows a SAMPLE heart count. */
const tiles = [
  { img: "l-1", pos: "30% 40%", z: 1.9, o: "20% 30%", n: "1,240" },
  { img: "p-tumbler-1", pos: "50% 50%", z: 1.25, o: "50% 40%", n: "862" },
  { img: "l-3", pos: "50% 50%", z: 2.4, o: "24% 52%", n: "2,031" },
  { img: "b-retro", pos: "80% 50%", z: 1.5, o: "80% 70%", n: "540" },
  { img: "l-2", pos: "50% 50%", z: 1.8, o: "60% 40%", n: "1,018" },
  { img: "b-beauty", pos: "50% 60%", z: 1.6, o: "50% 70%", n: "3,402" },
];

export function SocialGrid() {
  const [on, setOn] = useState<number | null>(null);
  return (
    <section className="section container social" aria-labelledby="soc" data-tint="sage">
      <div className="section-head" data-reveal>
        <h2 id="soc" className="h2">Follow @ontrend.oman</h2>
        <p className="muted">Concept social grid · sample counts</p>
      </div>
      <ul className="soc-grid" data-stagger>
        {tiles.map((t, i) => (
          <li key={i}>
            <button type="button" className={`soc-tile${on === i ? " is-on" : ""}`} aria-pressed={on === i} aria-label={`Sample post ${i + 1}, ${t.n} sample likes`} onClick={() => setOn(on === i ? null : i)}>
              <span className="soc-img" style={{ transform: `scale(${t.z})`, transformOrigin: t.o }}><Pic name={t.img} alt="" sizes="(max-width: 700px) 34vw, 200px" position={t.pos} /></span>
              <span className="soc-over" aria-hidden="true"><HeartIcon />{t.n}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
