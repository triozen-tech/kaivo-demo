import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container page-narrow center">
      <h1 className="h1">We couldn’t find that page.</h1>
      <p className="lead">It may have moved, or never existed.</p>
      <Link href="/" className="btn btn-solid">Back to the shop</Link>
    </section>
  );
}
