import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <section className="container page">
      <h1 className="h1">Your cart</h1>
      <CartView />
    </section>
  );
}
