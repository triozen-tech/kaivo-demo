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
  const from = source.getBoundingClientRect();
  const to = btn.getBoundingClientRect();
  const header = document.querySelector<HTMLElement>(".header");
  const startX = Math.min(Math.max(from.left + from.width / 2, 60), window.innerWidth - 60);
  const startY = Math.min(Math.max(from.top + from.height / 2, 80), window.innerHeight - 80);
  const endX = to.left + to.width / 2;
  const endY = (header?.offsetHeight ?? 68) / 2; // where the icon sits once the header is back

  const fly = document.createElement("div");
  fly.className = "fly";
  fly.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
  document.body.appendChild(fly);

  return new Promise((resolve) => {
    const done = () => { fly.remove(); resolve(); };
    gsap.set(fly, { x: startX, y: startY, xPercent: -50, yPercent: -50, scale: 0.9, opacity: 0 });
    const tl = gsap.timeline({ onComplete: done });
    tl.to(fly, { opacity: 1, duration: 0.15, ease: "none" }, 0)
      .to(fly, { x: endX, duration: 0.85, ease: "power1.inOut" }, 0)             // sideways: steady
      .to(fly, { y: Math.min(startY, endY + 220) - 70, duration: 0.32, ease: "power2.out" }, 0) // up first …
      .to(fly, { y: endY, duration: 0.53, ease: "power2.in" }, 0.32)             // … then down onto the icon
      .to(fly, { scale: 0.16, duration: 0.85, ease: "power2.in" }, 0)
      .to(fly, { opacity: 0, duration: 0.12, ease: "none" }, 0.78);
  });
}
