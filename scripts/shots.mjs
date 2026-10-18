// Screenshots + a smoke test of the cart/checkout flow. Run against `npm start` (port 3018).
import { chromium } from "playwright";
import fs from "node:fs";

const base = process.env.BASE || "http://localhost:3018";
const sizes = [[390, 844], [768, 1024], [1440, 900]];
const routes = [
  ["home", "/"], ["category", "/c/retro-kitchen"], ["product", "/p/retro-kettle"],
  ["cart", "/cart"], ["checkout", "/checkout"], ["success", "/order/success"],
];
fs.mkdirSync("shots/final", { recursive: true });

const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const problems = [];

for (const [w, h] of sizes) {
  // phones and tablets are real touch contexts (no smooth-scroll, no parallax); 1440 is mouse + trackpad
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...(w < 1000 ? { isMobile: true, hasTouch: true } : {}) });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") problems.push(`${w}: console ${m.text()}`); });
  page.on("pageerror", (e) => problems.push(`${w}: pageerror ${e.message}`));
  page.on("response", (r) => { if (r.status() >= 400) problems.push(`${w}: ${r.status()} ${r.url()}`); });

  const shot = async (name, full = true) => {
    await page.waitForTimeout(400);
    await page.screenshot({ path: `shots/final/${name}-${w}.png`, fullPage: full });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) problems.push(`${w}: ${name} overflows horizontally (${sw})`);
  };
  const load = async (path) => {
    await page.goto(base + path, { waitUntil: "networkidle" });
    // lazy images: scroll through the page once
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } await Promise.all([...document.images].map((i) => i.complete && i.naturalWidth ? 1 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); }))); window.scrollTo(0, 0); });
    await page.waitForTimeout(300);
  };

  // empty-state routes first (cart empty, checkout empty, no order)
  await load("/cart"); await shot("cart-empty");
  await load("/order/success"); await shot("success-empty");

  await load("/"); await shot("home");
  await load("/c/retro-kitchen"); await shot("category");
  await load("/p/retro-kettle"); await shot("product");

  // add to cart -> drawer
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.waitForSelector(".drawer-right.is-open", { timeout: 5000 });   // after the fly-to-cart
  await page.waitForTimeout(1200);
  await shot("drawer", false);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  await load("/p/jar-pantry");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.waitForSelector(".drawer-right.is-open", { timeout: 5000 });
  await page.waitForTimeout(600);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);

  await load("/cart"); await shot("cart");
  await load("/checkout");
  await page.getByRole("button", { name: "Place demo order" }).click();
  await shot("checkout-errors");
  await page.fill("#f-name", "Asha Rao"); await page.fill("#f-phone", "91234567"); await page.fill("#f-email", "asha@example.com");
  await page.fill("#f-address", "12 Lake View Road"); await page.fill("#f-city", "Muscat");
  await page.selectOption("#f-governorate", "Muscat"); await page.fill("#f-postal", "112");
  await page.getByText("Express, 1 to 2 days").click();
  await shot("checkout");
  await page.getByRole("button", { name: "Place demo order" }).click();
  await page.waitForURL("**/order/success");
  await page.waitForTimeout(500);
  await shot("success");
  const left = await page.evaluate(() => localStorage.getItem("kaivo-cart"));
  if (left && left !== "[]") problems.push(`${w}: cart not cleared (${left})`);

  // mobile menu drawer
  if (w < 1000) { await load("/"); await page.getByRole("button", { name: "Open menu" }).click(); await shot("menu", false); }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "no problems");
