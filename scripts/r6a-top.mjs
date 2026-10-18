import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const URL = "http://localhost:3018";
let bad = 0;
const pages = ["/", "/shop", "/c/retro-kitchen", "/p/retro-kettle", "/cart", "/checkout"];
for (const w of [360, 390, 412]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w === 360 ? 740 : 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage(); const errs = [];
  p.on("console", m => m.type() === "error" && errs.push(m.text())); p.on("pageerror", e => errs.push(String(e)));
  const cdp = await ctx.newCDPSession(p);
  for (const path of pages) {
    await p.goto(URL + path, { waitUntil: "load" }); await p.waitForTimeout(1500);
    for (let i = 0; i < 3; i++) { await cdp.send("Input.synthesizeScrollGesture", { x: w / 2, y: 600, yDistance: -500, gestureSourceType: "touch", speed: 1800 }); await p.waitForTimeout(250); }
    await p.waitForTimeout(600);
    const m = await p.evaluate(() => {
      const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), h: Math.round(b.height), bottom: Math.round(b.bottom) }; };
      const fb = r(".filterbar");
      return { y: Math.round(scrollY), header: r(".header"), offer: r(".offer"), filter: fb, ov: document.documentElement.scrollWidth > innerWidth };
    });
    const ok = m.y > 300 && m.header.top === 0 && m.offer.top === m.header.bottom && m.offer.h === 30 && (!m.filter || m.filter.top >= m.offer.bottom - 1) && !m.ov;
    if (!ok) bad++;
    console.log(w, path, ok ? "OK" : "FAIL", JSON.stringify(m));
    await p.screenshot({ path: `shots/r6a/top-${w}-${path === "/" ? "home" : path.slice(1).replace(/\//g, "_")}.png` });
  }
  if (errs.length) { console.log(w, "errors", errs); bad++; }
  await ctx.close();
}
await b.close(); process.exit(bad ? 1 : 0);
