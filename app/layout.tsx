import type { Metadata } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { WishProvider } from "@/components/WishProvider";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { TrustBand } from "@/components/Trust";
import { Motion } from "@/components/Motion";
import { Cursor } from "@/components/Cursor";
import { Intro } from "@/components/Intro";

/** Motion is always on; only ?static=1 turns it off. `mo` = motion on, `mo-hold` = pieces wait for the first animation frame (cleared by Motion, or after 3 s if scripts fail). */
// Storage version 2 (OnTrend, prices in baisa). Data saved by the rupee-era version under the same keys is dropped once:
// cart, voucher, last order and the intro flag. The wishlist (product slugs, same format) stays.
const bootScript = `(function(){try{if(localStorage.getItem("kaivo-ver")!=="2"){localStorage.removeItem("kaivo-cart");localStorage.removeItem("kaivo-code");localStorage.setItem("kaivo-ver","2")}}catch(e){}try{if(sessionStorage.getItem("kaivo-ver")!=="2"){sessionStorage.removeItem("kaivo-last-order");sessionStorage.removeItem("kaivo-intro");sessionStorage.setItem("kaivo-ver","2")}}catch(e){}var d=document.documentElement;if(/[?&]static=1/.test(location.search))return;d.classList.add("mo","mo-hold");var i=0;try{i=location.pathname==="/"&&!sessionStorage.getItem("kaivo-intro")}catch(e){}if(i)d.classList.add("intro");setTimeout(function(){d.classList.remove("mo-hold","intro")},3000)})()`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3019");
const description = "OnTrend Oman is a premium home and lifestyle store: tumblers, retro kitchen, shakers, food jars and beauty. Concept website by Triozen Tech.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "OnTrend Oman | demo store", template: "%s | OnTrend Oman demo store" },
  description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }, // concept demo: keep out of search
  openGraph: { type: "website", siteName: "OnTrend Oman demo store", title: "OnTrend Oman | demo store", description, locale: "en_OM" },
  twitter: { card: "summary_large_image", title: "OnTrend Oman | demo store", description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: bootScript }} /></head>
      <body>
        <WishProvider>
        <CartProvider>
          <a href="#main" className="skip">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <TrustBand />
          <Footer />
          <CartDrawer />
          <Motion />
          <Cursor />
          <Intro />
        </CartProvider>
        </WishProvider>
      </body>
    </html>
  );
}
