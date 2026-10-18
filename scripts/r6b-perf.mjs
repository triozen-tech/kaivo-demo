// CLS + LCP via PerformanceObserver (production server). Motion ON, intro skipped off so real first visit is measured.
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3019";
const b = await chromium.launch({ channel: "chrome" });
for (const [w, h, touch] of [[390, 844, true], [1440, 900, false]]) for (const path of ["/", "/shop", "/p/retro-kettle"]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch, deviceScaleFactor: touch ? 3 : 1 });
  await ctx.addInitScript(() => {
    window.__cls = 0; window.__lcp = 0; window.__lcpEl = "";
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__lcp = e.startTime; window.__lcpEl = (e.element?.tagName || "") + " " + (e.url || "").slice(-45); } }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  const p = await ctx.newPage();
  await p.goto(U + path, { waitUntil: "load" }); await p.waitForTimeout(4500);
  // scroll the page through so lazy content can shift
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) { await p.mouse.wheel(0, 500); await p.waitForTimeout(120); }
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp, el: window.__lcpEl }));
  console.log(w, path.padEnd(16), "CLS", r.cls.toFixed(4), "LCP", Math.round(r.lcp) + "ms", r.el);
  await ctx.close();
}
await b.close();
