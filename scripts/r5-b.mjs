import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
let bad = 0;
for (const [w, h, touch] of [[390, 844, true], [1440, 900, false]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch });
  const p = await ctx.newPage(); const errs = [];
  p.on("console", m => m.type() === "error" && errs.push(m.text())); p.on("pageerror", e => errs.push(String(e)));
  await p.goto("http://localhost:3018/shop?static=1", { waitUntil: "load" }); await p.waitForTimeout(800);
  const n = () => p.locator(".pcard").count();
  const c0 = await n();
  await p.getByRole("button", { name: /Load more/ }).click(); await p.waitForTimeout(300);
  const c1 = await n();
  if (touch) { await p.locator(".fb-open").tap(); await p.waitForTimeout(700); await p.getByRole("button", { name: "Under OMR 5" }).tap(); await p.getByRole("button", { name: "Apply" }).tap(); }
  else { await p.getByRole("button", { name: "Under OMR 5" }).click(); }
  await p.waitForTimeout(500);
  const c2 = await n();
  await p.getByRole("button", { name: "Clear all" }).first().click(); await p.waitForTimeout(300);
  await p.locator('button[aria-label="Search"]').click(); await p.waitForTimeout(700);
  await p.fill('.search input', "kettle"); await p.waitForTimeout(300);
  const r = await p.locator(".search-item").count();
  await p.keyboard.press("Escape"); await p.waitForTimeout(600);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(w, { c0, c1, filtered: c2, searchResults: r, overflow: ov, errs });
  if (ov || errs.length || c0 !== 9 || c1 !== 15 || !r) bad++;
  await ctx.close();
}
await b.close(); process.exit(bad ? 1 : 0);
