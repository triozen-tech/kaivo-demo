import type Lenis from "lenis";

/** Motion is always on. Only ?static=1 turns it off: the inline script in layout.tsx then never adds `mo` to <html>. */
export const isStatic = () => typeof document === "undefined" || !document.documentElement.classList.contains("mo");

/** Mouse or trackpad: smooth scroll and parallax are for these only. */
export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };
export const getLenis = () => lenis;
