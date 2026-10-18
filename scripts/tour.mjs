// Scripted backup tour of the production site, recorded with Playwright (Chrome screencast frames, no extra browser download) and exported as H.264 (crf 14) with the system ffmpeg.
//   npm run build && npm start        (port 3019)
//   node scripts/tour.mjs [desktop|phone|both]      U=http://localhost:3019 by default
// Output: recordings/kaivo-tour-desktop-1440x900.mp4 and recordings/kaivo-tour-phone-390x844.mp4 (git-ignored)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const U = process.env.U || "http://localhost:3019";
const which = process.argv[2] || "both";
const OUT = "recordings";
mkdirSync(OUT, { recursive: true });

const profiles = {
  desktop: { name: "desktop-1440x900", w: 1440, h: 900, touch: false },
  phone: { name: "phone-390x844", w: 390, h: 844, touch: true },
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Eased scroll by rAF so the page glides (the site's smooth scroll keeps up with it). */
const glide = (p, to, ms) => p.evaluate(([to, ms]) => new Promise((res) => {
  const from = scrollY, max = document.documentElement.scrollHeight - innerHeight, t0 = performance.now();
  to = Math.max(0, Math.min(max, to));
  const e = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const step = (now) => { const t = Math.min(1, (now - t0) / ms); scrollTo(0, from + (to - from) * e(t)); t < 1 ? requestAnimationFrame(step) : res(); };
  requestAnimationFrame(step);
}), [to, ms]);
const glideBy = (p, dy, ms) => p.evaluate((d) => scrollY + d, dy).then((to) => glide(p, to, ms));
const top = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY : null; }, sel);

async function moveTo(p, loc, steps = 16) {
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  const b = await loc.boundingBox(); if (!b) return null;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await p.mouse.move(x, y, { steps });
  return { x, y };
}

async function tour(browser, cfg) {
  const dir = `${OUT}/.tmp-${cfg.name}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: cfg.w, height: cfg.h }, isMobile: cfg.touch, hasTouch: cfg.touch, deviceScaleFactor: cfg.touch ? 2 : 1,
  });
  const p = await ctx.newPage();
  // Chrome screencast: full-quality JPEG frames with timestamps, joined later at their real timing
  const cdp = await ctx.newCDPSession(p);
  const frames = [];
  cdp.on("Page.screencastFrame", (e) => { frames.push({ t: e.metadata.timestamp, data: Buffer.from(e.data, "base64") }); cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId }).catch(() => {}); });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 100, maxWidth: cfg.w * (cfg.touch ? 2 : 1), maxHeight: cfg.h * (cfg.touch ? 2 : 1), everyNthFrame: 1 });
  const t0 = Date.now();
  const log = (m) => console.log(`[${cfg.name}] ${((Date.now() - t0) / 1000).toFixed(1)}s ${m}`);
  const tap = async (loc) => { if (cfg.touch) { await loc.scrollIntoViewIfNeeded().catch(() => {}); await wait(350); await loc.tap(); } else { await moveTo(p, loc); await wait(250); await loc.click(); } };
  const safe = async (n, f) => { try { await f(); } catch (e) { log(`step "${n}" skipped: ${e.message.split("\n")[0]}`); } };

  // 1. home hero (the first-visit intro plays here)
  await p.goto(U + "/", { waitUntil: "load" });
  log("home hero"); await wait(3000);

  // 2. smooth scroll through the sections
  await safe("scroll", async () => {
    const sc = cfg.touch ? null : await top(p, ".showcase");
    const stop = sc ?? (await top(p, ".cats-stack, .cat-grid")) ?? 1400;
    log("scroll to categories"); await glide(p, stop - (cfg.touch ? 80 : 0), cfg.touch ? 3600 : 3800); await wait(900);
    if (!cfg.touch && sc != null) {
      // 3. the sideways showcase: the page scroll slides the five categories
      const dist = await p.evaluate(() => document.querySelector(".showcase").offsetHeight - innerHeight);
      log("sideways showcase");
      for (const k of [0.35, 0.8]) { await glide(p, sc + dist * k, 1900); await wait(400); }
      await glide(p, sc + dist * 0.25, 1200); await wait(300);
    } else {
      for (let i = 0; i < 3; i++) { await glideBy(p, 520, 1700); await wait(400); }
    }
  });

  // 4. tap a category tile
  await safe("tile", async () => {
    log("tap a category tile");
    const tile = cfg.touch ? p.locator(".cat-tile").nth(0) : p.locator(".sc-img:visible").first();
    await tap(tile);
    await p.waitForURL(/\/c\//, { timeout: 8000 }); await wait(2000);
  });

  // 5. quick-add with the fly animation, then open a product
  await safe("category", async () => {
    await glideBy(p, cfg.touch ? 520 : 440, 1500); await wait(300);
    const card = p.locator(".pcard").first();
    if (!cfg.touch) { await moveTo(p, card.locator(".pcard-img")); await wait(500); }
    log("quick-add (fly)");
    await tap(card.locator(".quick-add")); await wait(2000);
    await tap(p.locator(".pcard-link").nth(1));
    await p.waitForURL(/\/p\//, { timeout: 8000 }); await wait(2000);
  });

  // 6. product: hover / tap the gallery, move through the photos, read the details
  await safe("product", async () => {
    log("product gallery");
    const gal = p.locator(".pdp-gallery, .gallery").first();
    if (!cfg.touch) {
      const g = await gal.boundingBox().catch(() => null);
      if (g) { await p.mouse.move(g.x + g.width * 0.3, g.y + g.height * 0.4, { steps: 24 }); await wait(400); await p.mouse.move(g.x + g.width * 0.7, g.y + g.height * 0.6, { steps: 30 }); await wait(600); }
    }
    const thumbs = p.locator(cfg.touch ? ".dot" : ".thumb"); // phones show dots, desktop shows thumbnails
    const n = await thumbs.count();
    for (let i = 1; i < Math.min(n, 3); i++) { await tap(thumbs.nth(i)); await wait(1000); }
    await glideBy(p, cfg.touch ? 640 : 520, 1800); await wait(1000);
  });

  // 7. add to cart, voucher ONTREND10
  await safe("cart", async () => {
    log("add to cart");
    await tap(p.getByRole("button", { name: /add to cart/i }).first()); await wait(1800);
    log("voucher ONTREND10");
    const input = p.locator(".voucher input:visible").first();
    await input.waitFor({ state: "visible", timeout: 6000 });
    if (cfg.touch) await input.tap(); else await moveTo(p, input);
    await input.pressSequentially("ONTREND10", { delay: 100 }); await wait(400);
    await tap(p.locator(".voucher .btn:visible").first()); await wait(2200);
  });

  // 8. checkout
  await safe("checkout", async () => {
    log("checkout");
    await tap(p.locator('.drawer.is-open a[href="/checkout"]').first());
    await p.waitForURL(/\/checkout/, { timeout: 8000 }); await wait(1800);
    const fill = async (name, text) => { const f = p.locator(`main input[name="${name}"]`); await (cfg.touch ? f.tap() : moveTo(p, f, 10).then(() => f.click())); await f.pressSequentially(text, { delay: 40 }); await wait(150); };
    await fill("name", "Asha Demo"); await fill("phone", "91234567"); await fill("email", "asha@example.com");
    await fill("address", "12 Sample Street"); await fill("city", "Muscat");
    await p.selectOption('select[name="governorate"]', { index: 1 }); await fill("postal", "112"); await wait(500);
    await glideBy(p, cfg.touch ? 520 : 380, 1500); await wait(700);
    log("place order");
    await tap(p.locator(".place-bar button[type=submit]"));
    await p.waitForURL(/success/, { timeout: 10000 });
  });

  // 9. success page
  log("success page"); await wait(2300);
  await glideBy(p, cfg.touch ? 400 : 300, 1500); await wait(1500);

  const secs = (Date.now() - t0) / 1000;
  await cdp.send("Page.stopScreencast").catch(() => {});
  await ctx.close();
  // drop the blank frames before the first paint of the site, then write frames + durations for ffmpeg's concat
  let list = "";
  frames.forEach((fr, i) => {
    writeFileSync(`${dir}/f${String(i).padStart(6, "0")}.jpg`, fr.data);
    const dur = i < frames.length - 1 ? Math.max(0.001, frames[i + 1].t - fr.t) : 0.6;
    list += `file 'f${String(i).padStart(6, "0")}.jpg'\nduration ${dur.toFixed(4)}\n`;
  });
  list += `file 'f${String(frames.length - 1).padStart(6, "0")}.jpg'\n`;
  writeFileSync(`${dir}/list.txt`, list);
  const mp4 = `${OUT}/kaivo-tour-${cfg.name}.mp4`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", `${dir}/list.txt`, "-vf", `fps=30,scale=${cfg.w}:${cfg.h}:flags=lanczos,format=yuv420p`, "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-movflags", "+faststart", "-an", mp4]);
  rmSync(dir, { recursive: true, force: true });
  const len = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).toString().trim();
  console.log(`[${cfg.name}] wrote ${mp4}  length ${Number(len).toFixed(1)}s (script ${secs.toFixed(1)}s)`);
}

const browser = await chromium.launch({ channel: "chrome" });
for (const k of which === "both" ? ["desktop", "phone"] : [which]) await tour(browser, profiles[k]);
await browser.close();
