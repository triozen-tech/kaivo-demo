// Round 6C: phone hero text inside the picture + screenshots of hero, promo card, filter sheet and product sticky bar.
import { chromium, webkit } from "playwright";
const U = process.env.U || "http://localhost:3019", O = "shots/r6c", eng = process.env.ENGINE === "webkit" ? webkit : chromium, tag = process.env.ENGINE === "webkit" ? "wk-" : "";
const b = await (eng === webkit ? webkit.launch() : chromium.launch({ channel: "chrome" }));
const sizes = (process.env.SIZES || "360x640,390x844,412x915,768x1024").split(",").map(s => s.split("x").map(Number));
for (const [w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage(); const errs = []; p.on("console", m => m.type() === "error" && errs.push(m.text())); p.on("pageerror", e => errs.push(String(e)));
  await p.goto(U + "/", { waitUntil: "load" }); await p.waitForTimeout(2800);
  const m = await p.evaluate(() => {
    const r = (e) => { const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom, l: b.left, r: b.right }; };
    const hero = document.querySelector(".hero"), img = document.querySelector(".hero-img");
    const parts = ["[data-hero=kicker]", "[data-hero=title]", "[data-hero=lead]", "[data-hero=cta]"].map(s => r(document.querySelector(s)));
    const H = r(hero), top = Math.min(...parts.map(x => x.t)), bot = Math.max(...parts.map(x => x.b));
    return { heroH: Math.round(H.b - H.t), heroTop: Math.round(H.t), heroBottom: Math.round(H.b), textTop: Math.round(top), textBottom: Math.round(bot), insideImage: bot <= r(img).b + 0.5 && top >= H.t, textTopPct: Math.round((top - H.t) / (H.b - H.t) * 100), src: document.querySelector(".hero-pic img").currentSrc.split("?")[0].split("/").slice(-1)[0], vh: innerHeight, scrollW: document.documentElement.scrollWidth };
  });
  console.log(`${tag}${w}x${h}`, JSON.stringify(m));
  await p.screenshot({ path: `${O}/${tag}hero-${w}x${h}.png` });
  // promo card
  const promo = p.locator("section[aria-labelledby=promo] .band"); await promo.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
  await promo.screenshot({ path: `${O}/${tag}promo-${w}x${h}.png` });
  // filter sheet
  await p.goto(U + "/shop?static=1", { waitUntil: "load" }); await p.waitForTimeout(900);
  if (w < 900) {
    await p.locator(".fb-open").tap(); await p.waitForTimeout(900);
    await p.screenshot({ path: `${O}/${tag}filters-${w}x${h}.png` });
    const vis = await p.evaluate(() => { const a = [...document.querySelectorAll(".sheet.is-open button")].filter(x => /apply|show|clear/i.test(x.textContent || "")).map(x => { const b = x.getBoundingClientRect(); return { t: x.textContent.trim().slice(0, 18), bottom: Math.round(b.bottom), inView: b.bottom <= innerHeight && b.top >= 0 }; }); return a; });
    console.log(`${tag}${w}x${h} filter buttons`, JSON.stringify(vis));
  }
  // product sticky bar
  await p.goto(U + "/p/retro-kettle?static=1", { waitUntil: "load" }); await p.waitForTimeout(700);
  await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(900);
  await p.screenshot({ path: `${O}/${tag}sticky-${w}x${h}.png` });
  console.log(`${tag}${w}x${h} errors`, JSON.stringify(errs));
  await ctx.close();
}
await b.close();
