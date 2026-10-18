"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";
import { getLenis } from "@/lib/motion";

/** Accessible slide-in panel: overlay, Esc, focus trap-lite, scroll lock. */
export function Drawer({
  open, onClose, side, title, children,
}: { open: boolean; onClose: () => void; side: "left" | "right"; title: string; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div className={`drawer drawer-${side}${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="drawer-scrim" onClick={onClose} />
      <div className="drawer-panel" data-lenis-prevent role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={panel}>
        <div className="drawer-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}><CloseIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
