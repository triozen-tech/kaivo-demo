"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { categories } from "@/data/categories";
import { useCart } from "./CartProvider";
import { Drawer } from "./Drawer";
import { BagIcon, MenuIcon } from "./Icons";

export function Header() {
  const { count, setDrawerOpen, menuOpen, setMenuOpen } = useCart();
  const path = usePathname();

  useEffect(() => { setMenuOpen(false); setDrawerOpen(false); }, [path, setMenuOpen, setDrawerOpen]);

  return (
    <>
      <header className="header">
        <div className="header-in container">
          <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><MenuIcon /></button>
          <Link href="/" className="logo" aria-label="Kaivo, home">Kaivo</Link>
          <nav className="nav" aria-label="Categories">
            {categories.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} aria-current={path === `/c/${c.slug}` ? "page" : undefined}>{c.name}</Link>
            ))}
          </nav>
          <button type="button" className="icon-btn cart-btn" onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}>
            <BagIcon />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </header>
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
