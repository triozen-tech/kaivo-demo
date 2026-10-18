// Edge cases: corrupt storage, qty limits, empty states, double-tap, voucher min, back after success, empty checkout.
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3018";
const b = await chromium.launch({ channel: "chrome" });
const res = [];
const rec = (n, ok, d = "") => { res.push([n, ok ? "PASS" : "FAIL", d]); };
const mk = async (touch = false) => {
  const ctx = await b.newContext({ viewport: touch ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: touch, hasTouch: touch });
  await ctx.addInitScript(() => { if (!sessionStorage.getItem("kaivo-boot")) { sessionStorage.setItem("kaivo-intro", "1"); sessionStorage.setItem("kaivo-boot", "1"); } });
  const p = await ctx.newPage(); p.errs = [];
  p.on("console", m => m.type() === "error" && p.errs.push(m.text())); p.on("pageerror", e => p.errs.push(e.message));
  return [ctx, p];
};
const cartCount = p => p.evaluate(() => { try { return JSON.parse(localStorage.getItem("kaivo-cart") || "[]"); } catch { return "corrupt"; } });

// 1. corrupt / missing storage
for (const [label, cart, wish, code] of [
  ["garbage strings", "{not json", "][", "%%%"],
  ["wrong types", '{"a":1}', '"str"', "123"],
  ["bad items", '[{"slug":"nope","qty":"x"},null,{"slug":"tumbler-halo","qty":999}]', '[1,null,"nope"]', '"XYZ"'],
  ["empty", "", "", ""],
]) {
  const [ctx, p] = await mk();
  await p.addInitScript(([c, w, k]) => { if (!sessionStorage.getItem("kaivo-seed")) { sessionStorage.setItem("kaivo-seed", "1"); localStorage.setItem("kaivo-cart", c); localStorage.setItem("kaivo-wish", w); localStorage.setItem("kaivo-code", k); } }, [cart, wish, code]);
  let ok = true, d = "";
  for (const path of ["/", "/shop", "/p/retro-kettle", "/wishlist", "/cart", "/checkout"]) {
    await p.goto(U + path + "?static=1", { waitUntil: "load" }); await p.waitForTimeout(700);
    const body = await p.evaluate(() => document.body.innerText.length);
    if (body < 100) { ok = false; d += path + " blank; "; }
  }
  const q = await p.evaluate(() => [...document.querySelectorAll(".cart-line, .line")].length);
  if (p.errs.length) { ok = false; d += "errors: " + p.errs.slice(0, 2).join(" | "); }
  rec("storage " + label, ok, d);
  await ctx.close();
}

// 2. qty limits + remove last item + empty state
{
  const [ctx, p] = await mk();
  await p.goto(U + "/p/tumbler-halo?static=1", { waitUntil: "load" }); await p.waitForTimeout(800);
  await p.getByRole("button", { name: /add to cart/i }).first().click(); await p.waitForTimeout(900);
  await p.goto(U + "/cart?static=1", { waitUntil: "load" }); await p.waitForTimeout(800);
  const plus = p.getByRole("button", { name: /increase|plus|\+/i }).first(), minus = p.getByRole("button", { name: /decrease|minus|−|-/i }).first();
  for (let i = 0; i < 14; i++) { if (await plus.isEnabled()) await plus.click(); await p.waitForTimeout(60); }
  let c = await cartCount(p); rec("qty max 10", c[0] && c[0].qty === 10, JSON.stringify(c));
  for (let i = 0; i < 14; i++) { if (await minus.isEnabled().catch(() => false)) await minus.click().catch(() => {}); await p.waitForTimeout(60); }
  c = await cartCount(p); rec("qty min 1", c[0] && c[0].qty === 1, JSON.stringify(c));
  await p.getByRole("button", { name: /remove/i }).first().click(); await p.waitForTimeout(700);
  const txt = await p.evaluate(() => document.body.innerText);
  rec("remove last -> empty state", /nothing here|empty/i.test(txt) && (await cartCount(p)).length === 0, txt.match(/[^\n]*(nothing here|empty)[^\n]*/i)?.[0] || "");
  rec("qty/empty no errors", p.errs.length === 0, p.errs.join("|"));
  await ctx.close();
}

// 3. double-tap quick add (motion ON for touch so the fly animation runs)
for (const touch of [true, false]) {
  const [ctx, p] = await mk(touch);
  await p.goto(U + "/shop", { waitUntil: "load" }); await p.waitForTimeout(1300);
  const q = p.locator(".quick-add").first(); await q.scrollIntoViewIfNeeded();
  if (!touch) await q.locator("xpath=..").hover();
  if (touch) { await q.tap(); await q.tap(); } else await q.dblclick();
  await p.waitForTimeout(1500);
  const c = await cartCount(p); const total = Array.isArray(c) ? c.reduce((a, l) => a + l.qty, 0) : -1;
  rec(`double-tap quick-add (${touch ? "touch" : "mouse"}) = 2 units`, total === 2, "units=" + total + (p.errs.length ? " errors:" + p.errs[0] : ""));
  await ctx.close();
}

// 4. WELCOME200 min
{
  const [ctx, p] = await mk();
  await p.goto(U + "/p/retro-kettle?static=1", { waitUntil: "load" }); await p.waitForTimeout(800);
  await p.evaluate(() => localStorage.setItem("kaivo-cart", JSON.stringify([{ slug: "jar-hearth", qty: 1 }])));
  await p.goto(U + "/cart?static=1", { waitUntil: "load" }); await p.waitForTimeout(800);
  const sub = await p.evaluate(() => document.body.innerText.match(/Subtotal[^\n]*\n?[^\n]*/)?.[0]);
  await p.locator("main .voucher input").fill("WELCOME200"); await p.locator("main .voucher .btn").click(); await p.waitForTimeout(700);
  const msg = await p.evaluate(() => document.querySelector("main .voucher")?.innerText);
  const applied = await p.evaluate(() => localStorage.getItem("kaivo-code"));
  rec("WELCOME200 below min refused", /1,?999/.test(msg || "") && !/WELCOME200/.test(applied || ""), JSON.stringify(msg).slice(0, 140) + " stored=" + applied + " | " + sub);
  await p.evaluate(() => localStorage.setItem("kaivo-cart", JSON.stringify([{ slug: "retro-kettle", qty: 1 }])));
  await p.goto(U + "/cart?static=1", { waitUntil: "load" }); await p.waitForTimeout(800);
  await p.locator("main .voucher input").fill("WELCOME200"); await p.locator("main .voucher .btn").click(); await p.waitForTimeout(700);
  rec("WELCOME200 above min accepted", /WELCOME200|200/.test(await p.evaluate(() => document.querySelector("main .voucher")?.innerText)), "");
  await ctx.close();
}

// 5. back after success + 6. empty checkout reload
{
  const [ctx, p] = await mk();
  await p.goto(U + "/p/tumbler-halo?static=1", { waitUntil: "load" }); await p.waitForTimeout(800);
  await p.getByRole("button", { name: /add to cart/i }).first().click(); await p.waitForTimeout(900);
  await p.goto(U + "/checkout?static=1", { waitUntil: "load" }); await p.waitForTimeout(900);
  for (const l of await p.locator("input[name]:not([type=radio]):not([type=checkbox]):not([name=search])").all()) { const n = (await l.getAttribute("name")) || "", ty = (await l.getAttribute("type")) || ""; if (n === "email") await l.fill("a@b.com"); else if (/phone/i.test(n)) await l.fill("9876543210"); else if (/pin|zip/i.test(n)) await l.fill("560001"); else if (ty !== "hidden" && !(await l.inputValue())) await l.fill("Test value"); }
  for (const s of await p.locator("select").all()) await s.selectOption({ index: 1 });
  await p.locator(".place-bar button[type=submit]").click(); await p.waitForURL(/success/, { timeout: 8000 }); await p.waitForTimeout(1200);
  const o1 = await p.evaluate(() => sessionStorage.getItem("kaivo-last-order"));
  rec("cart cleared after order", (await cartCount(p)).length === 0, "");
  await p.goBack(); await p.waitForTimeout(1200);
  const url = p.url(), txt = await p.evaluate(() => document.body.innerText);
  rec("back from success: cart stays empty", (await cartCount(p)).length === 0, url + " | " + (txt.match(/[^\n]*(empty|no items)[^\n]*/i)?.[0] || "").slice(0, 80));
  const o2 = await p.evaluate(() => sessionStorage.getItem("kaivo-last-order"));
  rec("back from success: order not recreated", o1 === o2, "");
  await p.goto(U + "/checkout?static=1", { waitUntil: "load" }); await p.waitForTimeout(900); await p.reload({ waitUntil: "load" }); await p.waitForTimeout(900);
  const t2 = await p.evaluate(() => ({ txt: document.body.innerText, shop: !![...document.querySelectorAll("main a")].find(a => /shop/i.test(a.textContent) && a.getAttribute("href")?.startsWith("/")) }));
  rec("empty /checkout reload: friendly + shop link", /empty|nothing|no items/i.test(t2.txt) && t2.shop, (t2.txt.match(/[^\n]*(empty|nothing|no items)[^\n]*/i)?.[0] || "").slice(0, 80));
  rec("flow no errors", p.errs.length === 0, p.errs.join("|"));
  await ctx.close();
}
for (const r of res) console.log(r[1], "|", r[0], "|", r[2]);
await b.close(); process.exit(res.some(r => r[1] === "FAIL") ? 1 : 0);
