import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", description: "This page could not be found. Head back to the Kaivo demo store." };

export default function NotFound() {
  return (
    <section className="container page-narrow center">
      <p className="label">Error 404</p>
      <h1 className="h1">We couldn’t find that page.</h1>
      <p className="lead">It may have moved, or never existed.</p>
      <Link href="/" className="btn btn-solid">Back to the shop</Link>
    </section>
  );
}
