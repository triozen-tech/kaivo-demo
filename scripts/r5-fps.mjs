import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
const p = await ctx.newPage();
for (const path of ["/", "/shop"]) {
  await p.goto("http://localhost:3018" + path, { waitUntil: "load" }); await p.waitForTimeout(2000);
  const r = await p.evaluate(async () => {
    const total = document.documentElement.scrollHeight - innerHeight; const dts = []; let last = performance.now(); let y = 0; const step = total / 360; // ~6 s of steady scroll
    await new Promise((res) => { const f = (t) => { dts.push(t - last); last = t; y += step; window.scrollTo(0, y); if (y < total) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
    dts.shift(); const avg = dts.reduce((a, c) => a + c, 0) / dts.length; return { frames: dts.length, avgMs: avg, fps: 1000 / avg, worstMs: Math.max(...dts), over33: dts.filter((d) => d > 33.4).length };
  });
  console.log(path.padEnd(6), `avg ${r.avgMs.toFixed(1)} ms (${r.fps.toFixed(0)} fps) | worst ${r.worstMs.toFixed(1)} ms | frames >33 ms: ${r.over33}/${r.frames}`);
}
await b.close();
