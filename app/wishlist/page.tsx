import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container page">
      <h1 className="h1">Your wishlist</h1>
      <WishlistView />
    </div>
  );
}
