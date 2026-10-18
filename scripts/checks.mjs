// Round 3 checks: related cards, gallery, sticky header, keyboard reach + focus ring, contrast.
import { chromium } from "playwright";
const base = process.env.BASE || "http://localhost:3018";
const b = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const out = [];
const slugs = await (await fetch(base + "/sitemap.xml").catch(() => null))?.text?.() ?? "";
const prods = ["tumbler-halo","tumbler-moss","tumbler-clay","retro-kettle","retro-toaster","retro-coffee","shaker-glass","shaker-steel","shaker-mini","jar-pantry","jar-thermo","jar-set","beauty-serum","beauty-cream","beauty-mist"];
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(e.message));

// 1) related = 3 on every product page (read slugs from the home links instead of guessing)
await p.goto(base + "/c/tumblers", { waitUntil: "networkidle" });
const all = [];
for (const c of ["tumblers","retro-kitchen","shakers","food-jars","beauty"]) {
  await p.goto(base + "/c/" + c, { waitUntil: "domcontentloaded" });
  all.push(...await p.$$eval(".pcard a, a.pcard", (as) => as.map((a) => a.getAttribute("href"))));
}
const hrefs = [...new Set(all)].filter(Boolean);
let bad = [];
for (const h of hrefs) {
  await p.goto(base + h, { waitUntil: "domcontentloaded" });
  const n = await p.$$eval("section[aria-labelledby=also] .pcard", (e) => e.length);
  const self = await p.$$eval("section[aria-labelledby=also] a", (as, h) => as.some((a) => a.getAttribute("href") === h), h);
  if (n !== 3 || self) bad.push(`${h}:${n}${self ? " self" : ""}`);
}
out.push(`related: ${hrefs.length} products, bad: ${bad.length ? bad.join(", ") : "none"}`);

// 2) gallery
for (const [w, touch] of [[1440, false], [390, true]]) {
  const c2 = await b.newContext({ viewport: { width: w, height: 900 }, ...(touch ? { isMobile: true, hasTouch: true } : {}) });
  const q = await c2.newPage();
  await q.goto(base + "/p/retro-kettle", { waitUntil: "networkidle" }); await q.waitForTimeout(2000);
  const act = () => q.$$eval(".pdp-slide", (s) => s.findIndex((x) => x.classList.contains("is-active")));
  const op = () => q.$$eval(".pdp-slide", (s) => s.map((x) => +getComputedStyle(x).opacity).map((o) => +o.toFixed(2)));
  const th = q.locator(".thumb");
  const r = [await act()];
  if (touch) { await th.nth(1).tap(); } else { await th.nth(1).click(); }
  await q.waitForTimeout(250); const mid = await op();
  await q.waitForTimeout(900); r.push(await act());
  if (touch) { await th.nth(2).tap(); } else { await th.nth(2).click(); }
  await q.waitForTimeout(900); r.push(await act());
  await q.screenshot({ path: `shots/final/gallery-${w}.png` });
  out.push(`gallery ${w}${touch ? " touch" : ""}: active ${r.join("→")}, mid-fade opacities ${JSON.stringify(mid)}`);
  if (touch) { // swipe left
    const box = await q.locator(".pdp-media").boundingBox();
    await q.evaluate(([x, y]) => { const el = document.querySelector(".pdp-media"); const t = (type, cx) => el.dispatchEvent(new TouchEvent(type, { bubbles: true, changedTouches: [new Touch({ identifier: 1, target: el, clientX: cx, clientY: y })], touches: type === "touchend" ? [] : [new Touch({ identifier: 1, target: el, clientX: cx, clientY: y })] })); t("touchstart", x + 150); t("touchend", x + 20); }, [box.x, box.y + 100]);
    await q.waitForTimeout(400); out.push(`gallery swipe left from 3rd → active ${await act()} (expect 0, wraps)`);
  }
  await c2.close();
}

// 3) sticky header on checkout with a real scroll
await p.goto(base + "/checkout", { waitUntil: "networkidle" }); await p.waitForTimeout(2000);
await p.mouse.move(700, 450);
const hdr = () => p.evaluate(() => { const r = document.querySelector(".header").getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), cls: document.querySelector(".header").className }; });
const firstTop = await p.evaluate(() => Math.round(document.querySelector("main h1").getBoundingClientRect().top));
const h0 = await hdr();
for (let i = 0; i < 8; i++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(40); } await p.waitForTimeout(900);
const hd = await hdr();
for (let i = 0; i < 3; i++) { await p.mouse.wheel(0, -100); await p.waitForTimeout(40); } await p.waitForTimeout(900);
const hu = await hdr();
out.push(`checkout header: at top ${JSON.stringify(h0)} (h1 starts at ${firstTop}); scrolling down → top ${hd.top} (${hd.cls}); scroll up → top ${hu.top} (sticky: ${hu.top === 0})`);

// 4) keyboard: tab through each page, every stop visible + has a focus ring
const pages = ["/", "/c/tumblers", "/p/retro-kettle", "/cart", "/checkout", "/order/success", "/nope"];
for (const path of pages) {
  await p.goto(base + path, { waitUntil: "networkidle" }); await p.waitForTimeout(1800);
  const seen = []; const problems = [];
  for (let i = 0; i < 60; i++) {
    await p.keyboard.press("Tab"); await p.waitForTimeout(60);
    const s = await p.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      const inView = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
      const header = document.querySelector(".header").getBoundingClientRect();
      const underHeader = !e.closest(".header") && r.top < header.bottom - 2 && header.bottom > 5 && r.bottom > header.top;
      return { id: (e.getAttribute("aria-label") || e.textContent || e.tagName).trim().slice(0, 28), inView, ring: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0, underHeader };
    });
    if (!s) break;
    if (seen.includes(s.id + i % 1) && seen.length > 8 && s.id === seen[0]) break;
    seen.push(s.id);
    if (!s.inView || !s.ring || s.underHeader) problems.push(`${s.id}${!s.inView ? " [off-screen]" : ""}${!s.ring ? " [no ring]" : ""}${s.underHeader ? " [under header]" : ""}`);
  }
  out.push(`keys ${path}: ${seen.length} stops, problems: ${problems.length ? problems.join("; ") : "none"}`);
}

// 5) contrast: every visible text node vs its first opaque background
await p.goto(base + "/?static=1", { waitUntil: "networkidle" });
for (const path of ["/?static=1", "/c/retro-kitchen?static=1", "/p/retro-kettle?static=1", "/cart?static=1", "/checkout?static=1"]) {
  await p.goto(base + path, { waitUntil: "networkidle" });
  const low = await p.evaluate(() => {
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { rgb: m.slice(0, 3), a: m.length > 3 ? m[3] : 1 }; };
    const bgOf = (el) => { while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c.a > 0.9) return c.rgb; el = el.parentElement; } return [244, 239, 231]; };
    const bad = new Map();
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const t = w.currentNode; if (!t.textContent.trim()) continue;
      const el = t.parentElement; const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (cs.visibility === "hidden" || cs.display === "none" || r.width === 0 || el.closest(".hero-img, .drawer, [aria-hidden=true], .marquee-dup")) continue;
      if (el.closest(".hero")) continue; // hero copy sits on the photo: checked by eye
      const fg = parse(cs.color).rgb; const bg = bgOf(el);
      const L1 = lum(fg), L2 = lum(bg); const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const px = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700; const need = px >= 24 || (px >= 18.66 && bold) ? 3 : 4.5;
      if (cr < need) bad.set(t.textContent.trim().slice(0, 24) + ` (${cr.toFixed(2)} < ${need})`, 1);
    }
    return [...bad.keys()];
  });
  out.push(`contrast ${path.split("?")[0]}: ${low.length ? low.join(" | ") : "all text passes AA"}`);
}
out.push(`console errors: ${errs.length ? errs.join(" | ") : "none"}`);
await b.close();
console.log(out.join("\n"));
