import Link from "next/link";
import { categories } from "@/data/categories";
import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container"><Newsletter /></div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <p className="logo">Kaivo</p>
          <p>Calm, well-made things for the home and the day ahead.</p>
        </div>
        <div>
          <h3 className="label">Shop</h3>
          <ul><li><Link href="/shop">Shop all</Link></li>{categories.map((c) => <li key={c.slug}><Link href={`/c/${c.slug}`}>{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="label">Your order</h3>
          <ul>
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/cart">Cart</Link></li>
            <li><Link href="/checkout">Checkout</Link></li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="footer-base">
          <p>Concept website by Triozen Tech</p>
          <p>All prices are sample prices in INR (₹) and not real offers. No payment is taken.</p>
        </div>
      </div>
    </footer>
  );
}
