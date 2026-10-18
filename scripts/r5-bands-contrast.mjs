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


const targets = [
  ["promo", "[aria-labelledby=promo]", ".band-eyebrow,.band-copy h2,.band-text,.band-code span,.band-code b"],
  ["closing", "[aria-labelledby=closing]", ".band-copy h2,.band-text"],
  ["trust band", ".trustband", ".tb-item h3,.tb-item p"],
  ["newsletter", ".news", ".news-h,.news-copy p,.news-msg"],
  ["social", ".social", ".section-head h2,.section-head p"],
];
for (const [w, h, mobile] of [[390, 844, true], [1440, 900, false]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const page = await ctx.newPage();
  await page.goto(URL + "/?static=1", { waitUntil: "load" }); await page.waitForTimeout(1500);
  for (const [name, box, sel] of targets) {
    const loc = page.locator(box).first();
    await loc.evaluate(e => { const r = e.getBoundingClientRect(); window.scrollTo(0, scrollY + r.top - Math.max(100, (innerHeight - r.height) / 2)); });
    await page.waitForTimeout(900);
    const scope = box === ".band-wrap:nth-of-type(1)" ? ".band-wrap:first-of-type" : box;
    const r = await measure(page, sel.split(",").map(x => box + " " + x).join(","), "x");
    console.log(String(w).padEnd(5), name.padEnd(11), r.map(x => x ? x.min.toFixed(1) : "-").join(" | "));
  }
  await ctx.close();
}
await b.close();
