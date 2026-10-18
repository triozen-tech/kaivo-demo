"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { useCart } from "./CartProvider";
import { Drawer } from "./Drawer";
import { BagIcon, MenuIcon } from "./Icons";
import { isStatic } from "@/lib/motion";

export function Header() {
  const { count, setDrawerOpen, menuOpen, setMenuOpen } = useCart();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Soft background after 40 px; hides on the way down, returns on the way up (never in ?static=1).
  useEffect(() => {
    if (isStatic()) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 120) setHidden(false);
      else if (y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    const show = () => setHidden(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onFocus = (e: FocusEvent) => { if ((e.target as HTMLElement).closest?.(".header")) show(); }; // keyboard focus brings it back
    window.addEventListener("kaivo:show-header", show);
    document.addEventListener("focusin", onFocus);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("kaivo:show-header", show); document.removeEventListener("focusin", onFocus); };
  }, []);

  useEffect(() => { setMenuOpen(false); setDrawerOpen(false); }, [path, setMenuOpen, setDrawerOpen]);

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}>
        <div className="header-in container">
          <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><MenuIcon /></button>
          <Link href="/" className="logo" aria-label="Kaivo, home">Kaivo</Link>
          <nav className="nav" aria-label="Categories">
            {categories.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} aria-current={path === `/c/${c.slug}` ? "page" : undefined}>{c.name}</Link>
            ))}
          </nav>
          <button type="button" className="icon-btn cart-btn" data-cart-btn onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}>
            <BagIcon />
            {count > 0 && <span key={count} className="badge">{count}</span>}
          </button>
        </div>
      </header>
      <div className="header-space" aria-hidden="true" />
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menu">
        <nav className="menu-links" aria-label="Menu">
          {categories.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} onClick={() => setMenuOpen(false)}>{c.name}</Link>
          ))}
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="menu-sub">Cart</Link>
        </nav>
      </Drawer>
    </>
  );
}
