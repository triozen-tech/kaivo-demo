import { chromium } from "playwright";
import { PNG } from "pngjs";
const b = await chromium.launch({ channel: "chrome" });
const URL = "http://localhost:3018";
const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = (r, g, bl) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
const cr = (a, c) => (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05);
const parse = s => s.match(/[\d.]+/g).map(Number);
const out = [];
async function measure(page, sel, tag) {
  // returns [{name, min, p5}] for each text element matched by sel within the current viewport
  const items = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((e, i) => {
    const cs = getComputedStyle(e); const rng = document.createRange(); rng.selectNodeContents(e);
    return { i, color: cs.color, rects: [...rng.getClientRects()].map(r => [r.left, r.top, r.width, r.height]) };
  }), sel);
  const st = await page.addStyleTag({ content: `${sel}, ${sel} *{color:transparent!important;text-shadow:none!important}` });
  await page.waitForTimeout(150);
  const buf = await page.screenshot(); await st.evaluate(e => e.remove()); const png = PNG.sync.read(buf);
  const dpr = png.width / (await page.evaluate(() => innerWidth));
  const res = [];
  for (const it of items) {
    const [tr, tg, tb, ta = 1] = parse(it.color); const ls = [];
    for (const [x, y, w, h] of it.rects) for (let py = Math.max(0, Math.floor(y * dpr)); py < Math.min(png.height, (y + h) * dpr); py += 2) for (let px = Math.max(0, Math.floor(x * dpr)); px < Math.min(png.width, (x + w) * dpr); px += 2) {
      const k = (py * png.width + px) * 4; const R = png.data[k], G = png.data[k + 1], B = png.data[k + 2];
      const bl = [R, G, B].map((v, j) => tr * ta * (j === 0) + tg * ta * (j === 1) + tb * ta * (j === 2) + v * (1 - ta));
      ls.push(cr(L(tr * ta + R * (1 - ta), tg * ta + G * (1 - ta), tb * ta + B * (1 - ta)), L(R, G, B)));
    }
    ls.sort((a, c) => a - c);
    if (ls.length) res.push({ min: ls[0], p5: ls[Math.floor(ls.length * 0.05)] });
  }
  return res;
}

const out2 = [];
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
const page = await ctx.newPage();
await page.goto(URL + "/", { waitUntil: "load" }); await page.waitForTimeout(1500);
const top = await page.evaluate(() => scrollY + document.querySelector(".showcase").getBoundingClientRect().top);
const h = await page.evaluate(() => document.querySelector(".showcase").closest(".pin-spacer").getBoundingClientRect().height - innerHeight);
for (let i = 0; i < 5; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), top + h * (i / 4)); await page.waitForTimeout(1800);
  // tag the on-screen copy of this panel so the selector is exact
  await page.evaluate(() => { document.querySelectorAll("[data-m]").forEach(e => e.removeAttribute("data-m")); let best, bd = 1e9; document.querySelectorAll(".sc-panel").forEach(p => { const r = p.getBoundingClientRect(); const d = Math.abs(r.left + r.width * 0.2 - innerWidth * 0.2); if (d < bd) { bd = d; best = p; } }); best.querySelectorAll(".sc-n,.sc-name,.sc-tag,.btn").forEach(e => e.setAttribute("data-m", "1")); document.querySelectorAll(".sc-title,.sc-count").forEach(e => e.setAttribute("data-m", "1")); });
  const r = await measure(page, "[data-m]", "p");
  out2.push({ panel: i + 1, r });
}
await b.close();
const names = ["title", "count", "n", "name", "tag", "btn"];
const f = x => x ? `${x.min.toFixed(1)} (p5 ${x.p5.toFixed(1)})` : "-";
for (const o of out2) console.log("panel", o.panel, o.r.map((x, k) => f(x)).join(" | "));
