export type OrderLine = { name: string; qty: number; price: number };
export type Order = {
  number: string;
  date: string;
  name: string;
  city: string;
  delivery: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
};

export const ORDER_KEY = "kaivo-last-order";

export const deliveryOptions = [
  { id: "standard", label: "Standard, 4 to 6 days", note: "Free sample shipping", price: 0 },
  { id: "express", label: "Express, 1 to 2 days", note: "Sample price", price: 199 },
] as const;

export function orderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `KV-${ymd}-${rand}`;
}
