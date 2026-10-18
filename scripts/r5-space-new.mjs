// New Round 5 elements: >=16px clear below every button inside its container, nothing clipped or overflowing.
import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const checks = [
  ["/", [[".band-copy", ".btn"], [".news", ".news-form .btn"], [".trustband", ".tb-item"]]],
  ["/shop", [[".band-copy", ".btn"], [".footer", ".news-form .btn"]]],
  ["/p/retro-kettle", [[".pdp-info", ".buy-actions .btn"], [".pdp-info", ".trustbox"]]],
];
let fails = 0;
for (const w of [360, 390, 1440]) {
  const touch = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 800 : 900 }, ...(touch ? { isMobile: true, hasTouch: true } : {}) });
  const p = await ctx.newPage(); const bad = []; let n = 0, min = 1e9;
  for (const [path, list] of checks) {
    await p.goto("http://localhost:3018" + path + "?static=1", { waitUntil: "load" }); await p.waitForTimeout(900);
    for (const [boxSel, btnSel] of list) {
      const r = await p.evaluate(([bs, ts]) => [...document.querySelectorAll(bs)].flatMap((box) => [...box.querySelectorAll(ts)].map((t) => {
        const cb = box.getBoundingClientRect(), tb = t.getBoundingClientRect();
        // the container's own padding box (band/footer/news/pdp): clear space = container bottom - button bottom
        return { gap: cb.bottom - tb.bottom, clipped: tb.left < -0.5 || tb.right > innerWidth + 0.5 || tb.left < cb.left - 0.5 || tb.right > cb.right + 0.5, w: tb.width, h: tb.height };
      })), [boxSel, btnSel]);
      for (const o of r) { n++; min = Math.min(min, o.gap); if (o.gap < 16 || o.clipped || o.h < 44) bad.push(`${path} ${boxSel}>${btnSel} gap=${o.gap.toFixed(1)} h=${o.h.toFixed(0)} clipped=${o.clipped}`); }
    }
    if (path === "/") {
      const g = await p.evaluate(() => { const grid = document.querySelector(".soc-grid"), sec = grid.closest("section"); const nxt = sec.nextElementSibling; const cs = getComputedStyle(grid); return { row: parseFloat(cs.rowGap), below: nxt.getBoundingClientRect().top - grid.getBoundingClientRect().bottom, tile: grid.querySelector(".soc-tile").getBoundingClientRect().height }; });
      n++; min = Math.min(min, g.row, g.below); if (g.row < 16 || g.below < 16 || g.tile < 44) bad.push(`social grid row-gap=${g.row} below=${g.below.toFixed(0)} tile=${g.tile.toFixed(0)}`);
    }
    if (path.startsWith("/p/")) {
      const a = await p.evaluate(() => { const bd = document.querySelector(".acc-body"); return { pb: parseFloat(getComputedStyle(bd).paddingBottom), buyGap: document.querySelector(".trustbox").getBoundingClientRect().top - document.querySelector(".buy-actions").getBoundingClientRect().bottom }; });
      n++; min = Math.min(min, a.pb, a.buyGap); if (a.pb < 16 || a.buyGap < 16) bad.push(`pdp acc padding-bottom=${a.pb} buy→trust gap=${a.buyGap.toFixed(0)}`);
    }
    if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) bad.push(path + " horizontal overflow");
  }
  fails += bad.length; console.log(w, "checked", n, "min gap", min.toFixed(1), bad.length ? "FAIL " + bad.slice(0, 8).join(" | ") : "PASS");
  await ctx.close();
}
await b.close(); process.exit(fails ? 1 : 0);
