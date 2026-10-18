import { isStatic } from "./motion";

type VTDoc = Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void>; skipTransition: () => void } };

let morphing = false;
/** True while a shared-element transition runs: the incoming page keeps its target image still, so the browser can morph into it. */
export const isMorphing = () => morphing;

const NAME = "morph";

/**
 * Shared-element navigation. The clicked image gets `view-transition-name: morph`; once the new route has rendered,
 * its `[data-morph-target]` takes the name and the browser grows one image into the other (CSS in globals.css).
 * No View Transitions support, static mode, or anything unexpected: a plain push (the page fade). A timer always ends the transition.
 */
export function morphTo(push: (href: string) => void, href: string, src: HTMLElement) {
  const d = document as VTDoc;
  if (isStatic() || !d.startViewTransition) { push(href); return; }
  const root = document.documentElement;
  const path = new URL(href, location.href).pathname;
  let target: HTMLElement | null = null;
  const finish = () => { morphing = false; delete root.dataset.morph; src.style.viewTransitionName = ""; if (target) target.style.viewTransitionName = ""; };

  morphing = true;
  root.dataset.morph = "1";
  src.style.viewTransitionName = NAME;
  try {
    const vt = d.startViewTransition(() => new Promise<void>((resolve) => {
      push(href);
      const t0 = performance.now();
      const wait = () => {
        const el = location.pathname === path ? document.querySelector<HTMLElement>("[data-morph-target]") : null;
        const img = el?.querySelector("img");
        if (el && (!img || (img.complete && img.naturalWidth > 0))) {
          src.style.viewTransitionName = "";
          el.style.viewTransitionName = NAME;
          target = el;
          resolve();
        } else if (performance.now() - t0 > 1600) resolve();
        else setTimeout(wait, 16); // not rAF: rendering is paused while the update callback is pending
      };
      setTimeout(wait, 16);
    }));
    const kill = setTimeout(() => vt.skipTransition(), 3500);
    vt.finished.catch(() => {}).finally(() => { clearTimeout(kill); finish(); });
  } catch {
    finish();
    push(href);
  }
}
