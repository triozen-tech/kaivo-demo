"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { morphTo } from "@/lib/vt";

/** A link whose `morph` image (a selector inside the nearest [data-morph-scope], or inside the link) grows into the next page's [data-morph-target]. */
export function MorphLink({ morph, onClick, ...props }: ComponentProps<typeof Link> & { morph: string }) {
  const router = useRouter();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const scope = e.currentTarget.closest<HTMLElement>("[data-morph-scope]") ?? e.currentTarget;
    const src = scope.querySelector<HTMLElement>(morph);
    if (!src) return;
    e.preventDefault();
    morphTo((h) => router.push(h), String(props.href), src);
  };
  return <Link {...props} onClick={go} />;
}
