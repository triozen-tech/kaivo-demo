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
import { OfferStrip } from "@/components/OfferStrip";
import { Motion } from "@/components/Motion";
import { Cursor } from "@/components/Cursor";
import { Intro } from "@/components/Intro";

/** Motion is always on; only ?static=1 turns it off. `mo` = motion on, `mo-hold` = pieces wait for the first animation frame (cleared by Motion, or after 3 s if scripts fail). */
const bootScript = `(function(){var d=document.documentElement;if(/[?&]static=1/.test(location.search))return;d.classList.add("mo","mo-hold");var i=0;try{i=location.pathname==="/"&&!sessionStorage.getItem("kaivo-intro")}catch(e){}if(i)d.classList.add("intro");setTimeout(function(){d.classList.remove("mo-hold","intro")},3000)})()`;

export const metadata: Metadata = {
  title: { default: "Kaivo | demo store", template: "%s | Kaivo demo store" },
  description: "Kaivo is a premium home and lifestyle store: tumblers, retro kitchen, shakers, food jars and beauty. Concept website by Triozen Tech.",
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
          <OfferStrip />
          <main id="main">{children}</main>
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
