import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:3018/"); await p.waitForTimeout(3500);
const r = await p.evaluate(async () => {
  const H = document.documentElement.scrollHeight - innerHeight, dts = []; let last = performance.now(), y = 0;
  await new Promise((done) => { const tick = (t) => { dts.push(t - last); last = t; y += 14; window.scrollTo(0, y); y < H ? requestAnimationFrame(tick) : done(); }; requestAnimationFrame(tick); });
  const a = dts.slice(2); return { frames: a.length, avgMs: a.reduce((s, v) => s + v, 0) / a.length, worstMs: Math.max(...a), over33: a.filter((v) => v > 33).length, H };
});
console.log(r, "fps avg", (1000 / r.avgMs).toFixed(1), "errs", errs);
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const q = await b.newPage({ viewport: { width: w, height: h } });
  await q.goto("http://localhost:3018/?static=1", { waitUntil: "networkidle" });
  await q.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } scrollTo(0, 0); });
  await q.waitForTimeout(500);
  await q.screenshot({ path: `shots/r4/static-home-${w}.png`, fullPage: true });
  console.log(w, "overflow", await q.evaluate(() => document.documentElement.scrollWidth > innerWidth), "showcase", await q.evaluate(() => getComputedStyle(document.querySelector(".showcase")).display), "stack", await q.evaluate(() => getComputedStyle(document.querySelector(".cats-stack")).display));
}
await b.close();
