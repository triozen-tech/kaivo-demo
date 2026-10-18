import type { Metadata } from "next";
import { OrderSummary } from "@/components/OrderSummary";

export const metadata: Metadata = { title: "Order placed", description: "Your OnTrend demo order is placed. Nothing was charged." };

export default function SuccessPage() {
  return (
    <section className="container page-narrow">
      <OrderSummary />
    </section>
  );
}
