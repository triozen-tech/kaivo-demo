// Mid-animation shots, ?static=1 shot and scroll frame rate. Run against `npm start` (port 3018).
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.env.BASE || "http://localhost:3018";
fs.mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const out = [];
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
page.on("pageerror", (e) => errs.push(e.message));

// hero at ~0.3 s and ~1.0 s
await page.goto(base + "/", { waitUntil: "commit" });
await page.waitForSelector("[data-hero=title]");
await page.waitForTimeout(300);
await page.screenshot({ path: "shots/motion-hero-0.3s-1440.png" });
await page.waitForTimeout(700);
await page.screenshot({ path: "shots/motion-hero-1.0s-1440.png" });
await page.waitForTimeout(2500);

// a scrolled home section, caught while it staggers in
await page.mouse.move(700, 500);
await page.evaluate(() => window.scrollTo(0, document.querySelector("#cats").getBoundingClientRect().top + scrollY - 200));
await page.waitForTimeout(450);
await page.screenshot({ path: "shots/motion-section-1440.png" });
await page.waitForTimeout(1800);

// hover on a featured card
await page.evaluate(() => window.scrollTo(0, document.querySelector("#feat").getBoundingClientRect().top + scrollY - 80));
await page.waitForTimeout(1800);
const card = page.locator("#feat ~ .grid .pcard, .grid .pcard").first();
await card.hover();
await page.waitForTimeout(900);
await page.screenshot({ path: "shots/motion-card-hover-1440.png" });

// fly-to-cart midpoint
await page.goto(base + "/p/retro-kettle", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.evaluate(() => window.scrollTo(0, 260));
await page.waitForTimeout(600);
await page.getByRole("button", { name: "Add to cart" }).click();
await page.waitForTimeout(420);
await page.screenshot({ path: "shots/motion-fly-1440.png" });
await page.waitForSelector(".drawer-right.is-open");
await page.waitForTimeout(250);
await page.screenshot({ path: "shots/motion-drawer-opening-1440.png" });
await page.waitForTimeout(1200);
const flyLeft = await page.locator(".fly").count();
out.push(`fly clones left in DOM: ${flyLeft}`);
await page.keyboard.press("Escape");

// frame rate: wheel-scroll home top to bottom
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.evaluate(() => { window.__d = []; let last = performance.now(); const f = (t) => { window.__d.push(t - last); last = t; window.__raf = requestAnimationFrame(f); }; window.__raf = requestAnimationFrame(f); });
await page.mouse.move(720, 450);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
const t0 = Date.now();
for (let y = 0; y < H; y += 90) { await page.mouse.wheel(0, 90); await page.waitForTimeout(16); }
await page.waitForTimeout(1200);
const secs = (Date.now() - t0) / 1000;
const d = await page.evaluate(() => { cancelAnimationFrame(window.__raf); return window.__d; });
const avg = d.reduce((a, b) => a + b, 0) / d.length;
const sorted = [...d].sort((a, b) => a - b);
out.push(`scroll ${Math.round(H)}px in ${secs.toFixed(1)}s: avg ${(1000 / avg).toFixed(1)} fps, p95 frame ${sorted[Math.floor(sorted.length * 0.95)].toFixed(1)} ms, worst ${sorted.at(-1).toFixed(1)} ms, frames >33ms: ${d.filter((x) => x > 33.4).length}/${d.length}`);

// static
const sp = await ctx.newPage();
await sp.goto(base + "/?static=1", { waitUntil: "networkidle" });
await sp.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } window.scrollTo(0, 0); });
await sp.waitForTimeout(500);
await sp.screenshot({ path: "shots/static-home-1440.png", fullPage: true });
out.push("static: html class = " + JSON.stringify(await sp.evaluate(() => document.documentElement.className)));
const hidden = await sp.evaluate(() => [...document.querySelectorAll("[data-reveal],[data-stagger]>*,[data-hero],[data-img-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").length);
out.push(`static: elements not fully opaque: ${hidden}`);
out.push(`static: marquee animation: ${await sp.evaluate(() => getComputedStyle(document.querySelector(".marquee-track")).animationName)}`);
out.push(`console errors: ${errs.length ? errs.join(" | ") : "none"}`);
await browser.close();
console.log(out.join("\n"));
