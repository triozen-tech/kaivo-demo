import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart", description: "Review the items in your Kaivo demo cart. No payment is taken." };

export default function CartPage() {
  return (
    <section className="container page">
      <h1 className="h1">Your cart</h1>
      <CartView />
    </section>
  );
}
