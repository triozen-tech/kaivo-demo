import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", description: "A demo checkout for the Kaivo concept store. No payment is taken." };

export default function CheckoutPage() {
  return (
    <section className="container page">
      <h1 className="h1">Checkout</h1>
      <p className="banner" role="note"><strong>Demo checkout.</strong> No payment is taken.</p>
      <CheckoutForm />
    </section>
  );
}
