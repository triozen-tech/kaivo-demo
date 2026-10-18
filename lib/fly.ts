import { gsap } from "gsap";
import { isStatic } from "./motion";

/**
 * A small copy of the product picture flies in an arc from the picture to the cart icon.
 * Resolves when it lands (at once in ?static=1 or if anything is missing). Transform and opacity only.
 */
export function flyToCart(source: HTMLElement | null): Promise<void> {
  const btn = document.querySelector<HTMLElement>("[data-cart-btn]");
  const img = source?.querySelector<HTMLImageElement>(".is-active img") ?? source?.querySelector<HTMLImageElement>("img");
  if (isStatic() || !source || !btn || !img) return Promise.resolve();

  window.dispatchEvent(new Event("kaivo:show-header")); // the header may be tucked away
  const from = img.getBoundingClientRect();
  const to = btn.getBoundingClientRect();
  const header = document.querySelector<HTMLElement>(".header");
  // starts exactly over the picture (never wider than the viewport), shrinks to ~56 px on the cart icon
  const w = Math.max(60, Math.min(from.width, window.innerWidth - 24)), h = Math.max(60, Math.min(from.height, window.innerHeight - 24));
  const startX = Math.min(Math.max(from.left + from.width / 2, w / 2 + 8), window.innerWidth - w / 2 - 8);
  const startY = Math.min(Math.max(from.top + from.height / 2, h / 2 + 8), window.innerHeight - h / 2 - 8);
  const endX = to.left + to.width / 2;
  const endY = (header?.offsetHeight ?? 68) / 2; // where the icon sits once the header is back
  const end = 56 / w;                             // landing scale
  const radius = Math.min(16 / end, Math.min(w, h) * 0.22); // 16 px at landing, never rounder than a soft card at the start

  const fly = document.createElement("div");
  fly.className = "fly";
  Object.assign(fly.style, { width: `${w}px`, height: `${h}px`, borderRadius: `${radius}px`, backgroundImage: `url("${img.currentSrc || img.src}")` });
  document.body.appendChild(fly);

  return new Promise((resolve) => {
    const done = () => { fly.remove(); resolve(); };
    gsap.set(fly, { x: startX, y: startY, xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
    const apex = Math.max(Math.min(startY, endY + 220) - 90, 90);
    const tl = gsap.timeline({ onComplete: done });
    tl.to(fly, { x: endX, duration: 0.95, ease: "power1.inOut" }, 0)           // sideways: steady
      .to(fly, { y: apex, duration: 0.36, ease: "power2.out" }, 0)             // up first …
      .to(fly, { y: endY, duration: 0.59, ease: "power2.in" }, 0.36)           // … then down onto the icon
      .to(fly, { scale: end, duration: 0.95, ease: "power2.inOut" }, 0)
      .to(fly, { opacity: 0, duration: 0.18, ease: "none" }, 0.8);
  });
}
