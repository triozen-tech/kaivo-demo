"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { useCart } from "./CartProvider";
import { Drawer } from "./Drawer";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";
import { SearchOverlay } from "./SearchOverlay";
import { useWish } from "./WishProvider";
import { isStatic } from "@/lib/motion";

export function Header() {
  const { count, setDrawerOpen, menuOpen, setMenuOpen } = useCart();
  const { count: wishCount } = useWish();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Soft background after 40 px; hides on the way down, returns on the way up (never in ?static=1).
  useEffect(() => {
    if (isStatic()) return;
    const sticky = /^\/(shop|c\/)/.test(path); // the sticky filter bar sits under the header, so the header stays put there
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 120 || sticky) setHidden(false);
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
  }, [path]);

  useEffect(() => { setMenuOpen(false); setDrawerOpen(false); }, [path, setMenuOpen, setDrawerOpen]);

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}>
        <div className="header-in container">
          <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><MenuIcon /></button>
          <Link href="/" className="logo" aria-label="Kaivo, home">Kaivo</Link>
          <nav className="nav" aria-label="Categories">
            <Link href="/shop" aria-current={path === "/shop" ? "page" : undefined}>Shop all</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} aria-current={path === `/c/${c.slug}` ? "page" : undefined}>{c.name}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search"><SearchIcon /></button>
            <Link href="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishCount} saved`}>
              <HeartIcon />
              {wishCount > 0 && <span key={wishCount} className="badge">{wishCount}</span>}
            </Link>
            <button type="button" className="icon-btn cart-btn" data-cart-btn onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}>
              <BagIcon />
              {count > 0 && <span key={count} className="badge">{count}</span>}
            </button>
          </div>
        </div>
      </header>
      <div className="header-space" aria-hidden="true" />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menu">
        <nav className="menu-links" aria-label="Menu">
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop all</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} onClick={() => setMenuOpen(false)}>{c.name}</Link>
          ))}
          <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="menu-sub">Wishlist</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="menu-sub">Cart</Link>
        </nav>
      </Drawer>
    </>
  );
}
