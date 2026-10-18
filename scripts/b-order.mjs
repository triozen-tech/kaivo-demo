import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(e.message));
await p.goto("http://localhost:3018/p/tumbler-halo");
await p.waitForTimeout(1500);
await p.getByRole("button", { name: /add to cart/i }).first().click();
await p.waitForTimeout(1200);
await p.fill(".voucher input", "KAIVO10"); await p.click(".voucher .btn"); await p.waitForTimeout(1200);
await p.screenshot({ path: "shots/r4/drawer.png" });
await p.goto("http://localhost:3018/checkout"); await p.waitForTimeout(1000);
for (const l of await p.locator("input:not([type=radio]):not([type=checkbox])").all()) {
  const n = (await l.getAttribute("name")) || "", t = (await l.getAttribute("type")) || "";
  if (n === "email") await l.fill("a@b.com"); else if (/phone/i.test(n)) await l.fill("9876543210"); else if (/pin|zip/i.test(n)) await l.fill("560001"); else if (t !== "hidden" && !(await l.inputValue())) await l.fill("Test value");
}
for (const sel of await p.locator("select").all()) await sel.selectOption({ index: 1 });
await p.click("button[type=submit]"); await p.waitForURL(/success/, { timeout: 8000 }).catch(() => {});
console.log(p.url());
await p.waitForTimeout(900); await p.screenshot({ path: "shots/r4/success-mid.png" });
await p.waitForTimeout(2500); await p.screenshot({ path: "shots/r4/success.png" });
console.log((await p.locator(".success").innerText()).replace(/\n/g, " | ").slice(0, 300));
console.log("errs", errs);
await b.close();
