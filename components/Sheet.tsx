"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";
import { getLenis } from "@/lib/motion";
import { useSwipeDown } from "@/lib/swipe";

/** Bottom sheet for phones: rounded top, grab handle, swipe down or Esc or the scrim to close, footer slot for the main action. */
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const grab = useRef<HTMLDivElement>(null);
  useSwipeDown(panel, grab, onClose, open);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; getLenis()?.start(); prev?.focus?.(); };
  }, [open, onClose]);

  return (
    <div className={`sheet${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet-panel" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={panel}>
        <div className="sheet-grab" ref={grab}>
          <i className="sheet-handle" aria-hidden="true" />
          <div className="sheet-head"><h2>{title}</h2><button type="button" className="icon-btn" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}><CloseIcon /></button></div>
        </div>
        <div className="sheet-body" data-lenis-prevent>{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}
