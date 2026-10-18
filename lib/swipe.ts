import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Swipe a bottom sheet down to close it. Drag starts on `handle` (the grab bar and title row), so scrolling the sheet's content never closes it.
 * Moves with transform only; releases past 90 px (or a quick flick) call `onClose`, otherwise it springs back.
 */
export function useSwipeDown(panel: RefObject<HTMLElement | null>, handle: RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    const p = panel.current, h = handle.current;
    if (!active || !p || !h) return;
    let y0 = 0, dy = 0, t0 = 0, drag = false;
    const down = (e: PointerEvent) => { if (e.pointerType === "mouse") return; drag = true; y0 = e.clientY; dy = 0; t0 = e.timeStamp; p.style.transition = "none"; h.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!drag) return; dy = Math.max(0, e.clientY - y0); p.style.transform = `translateY(${dy}px)`; };
    const up = (e: PointerEvent) => {
      if (!drag) return;
      drag = false;
      p.style.transition = "";
      const fast = dy / Math.max(1, e.timeStamp - t0) > 0.6;
      p.style.transform = "";
      if (dy > 90 || (fast && dy > 30)) onClose();
    };
    h.addEventListener("pointerdown", down);
    h.addEventListener("pointermove", move);
    h.addEventListener("pointerup", up);
    h.addEventListener("pointercancel", up);
    return () => { h.removeEventListener("pointerdown", down); h.removeEventListener("pointermove", move); h.removeEventListener("pointerup", up); h.removeEventListener("pointercancel", up); p.style.transform = ""; p.style.transition = ""; };
  }, [panel, handle, onClose, active]);
}
