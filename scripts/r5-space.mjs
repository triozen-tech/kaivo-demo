// Spacing check: every card's quick-add + wishlist buttons need >= 16px clear below to the card's bottom edge, and nothing clipped/overflowing.
import { chromium } from "playwright";
const pages = (process.env.PAGES || "/,/c/tumblers,/c/retro-kitchen,/shop,/wishlist,/p/tumbler-halo").split(",");
const b = await chromium.launch({ channel: "chrome" });
let fails = 0;
for (const w of [360, 390, 1440]) {
  const touch = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 800 : 900 }, ...(touch ? { isMobile: true, hasTouch: true } : {}) });
  const p = await ctx.newPage();
  const res = { cards: 0, minGap: 1e9, bad: [] };
  for (const path of pages) {
    await p.goto("http://localhost:3018" + path + "?static=1", { waitUntil: "load" }); await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll(".pcard").forEach((c) => {
        const cb = c.getBoundingClientRect();
        c.querySelectorAll(".quick-add, .heart-card").forEach((btn) => {
          const bb = btn.getBoundingClientRect();
          const chip = btn.querySelector(".heart-chip")?.getBoundingClientRect() ?? bb;
          const gap = cb.bottom - bb.bottom;
          const clipped = bb.left < cb.left - 0.5 || bb.right > cb.right + 0.5 || bb.top < cb.top - 0.5;
          out.push({ cls: btn.className, gap, w: bb.width, h: bb.height, clipped, below: btn.classList.contains("quick-add") });
        });
      });
      return { out, over: document.documentElement.scrollWidth > innerWidth };
    });
    for (const o of r.out) {
      res.cards++;
      if (o.below) res.minGap = Math.min(res.minGap, o.gap);
      if ((o.below && o.gap < 16) || o.clipped || o.w < 44 || o.h < 44) res.bad.push(`${path} ${o.cls} gap=${o.gap.toFixed(1)} ${o.w}x${o.h} clipped=${o.clipped}`);
    }
    if (r.over) res.bad.push(`${path} horizontal overflow`);
  }
  fails += res.bad.length;
  console.log(w, "buttons checked:", res.cards, "min quick-add gap below:", res.minGap.toFixed(1), res.bad.length ? "FAIL " + res.bad.slice(0, 6).join(" | ") : "PASS");
  await ctx.close();
}
await b.close(); process.exit(fails ? 1 : 0);
