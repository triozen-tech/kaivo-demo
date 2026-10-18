"use client";

import { useId, useState } from "react";

export type AccItem = { id: string; title: string; note?: string; open?: boolean; children: React.ReactNode };

/** Product-page accordions: independent panels, the first one open by default. Height eases through grid rows, so no content is measured. */
export function Accordion({ items }: { items: AccItem[] }) {
  const uid = useId();
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(items.map((i) => [i.id, !!i.open])));
  return (
    <div className="acc">
      {items.map((it) => {
        const on = open[it.id];
        return (
          <section key={it.id} className={`acc-item${on ? " is-open" : ""}`}>
            <h2 className="acc-h">
              <button type="button" id={`${uid}-${it.id}-b`} aria-expanded={on} aria-controls={`${uid}-${it.id}-p`} onClick={() => setOpen((o) => ({ ...o, [it.id]: !o[it.id] }))}>
                <span className="acc-title">{it.title}{it.note && <small>{it.note}</small>}</span>
                <i className="acc-plus" aria-hidden="true" />
              </button>
            </h2>
            <div className="acc-panel" id={`${uid}-${it.id}-p`} role="region" aria-labelledby={`${uid}-${it.id}-b`} inert={!on}>
              <div className="acc-in"><div className="acc-body">{it.children}</div></div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
