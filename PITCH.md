# Kaivo: pitch notes

## What it is
Kaivo is a **concept website for a fictional home and lifestyle store**, built by Triozen Tech as a showcase of what a modern online shop can look and feel like. It sells five kinds of everyday objects: **tumblers, retro kitchen, shakers, food jars and beauty** (15 sample products). The look is calm and premium: warm cream background, one clay accent colour, a serif headline font, soft rounded cards.

It is a working front end, not a real shop: you can browse, search, filter, add to cart, apply a code, fill in checkout and see an order confirmation. There is no payment, no account and no server-side order.

Footer on every page: "Concept website by Triozen Tech".

## Pages
| Page | What it does |
|---|---|
| Home `/` | Hero, delivery and returns strip, category icons, "Shop by category", featured products, lifestyle photos, offer band, social grid, closing banner, newsletter box |
| Shop all `/shop` | Every product, with filters, sort and "Load more" |
| Category `/c/<name>` | Five category pages (Tumblers, Retro Kitchen, Shakers, Food Jars, Beauty), each with a banner and its own products and filters |
| Product `/p/<name>` | Gallery, price, quantity, add to cart, details, sample reviews, "complete the set" suggestions |
| Wishlist `/wishlist` | The hearted products |
| Cart `/cart` | Lines, quantities, voucher box, delivery progress, totals |
| Checkout `/checkout` | Contact and delivery form with validation, delivery choice, order summary |
| Order placed `/order/success` | Confirmation with an order number and a summary of what was "ordered" |
| Not found | A friendly 404 page with a way back to the shop |

## Features, by section
**Header and navigation**
- Sticky header that tucks away on scroll down and returns on scroll up; rotating offer strip above it.
- Search overlay with live results; wishlist and cart counters; cart opens as a side drawer on desktop and a bottom sheet on phones.

**Home**
- First-visit brand intro (once per browser session).
- Hero with a gentle scroll effect.
- "Shop by category": on desktop with a mouse, a **sideways showcase** (scrolling down slides through the five categories); on phones, tablets and with `?static=1`, a plain stack of category tiles.
- Featured products, lifestyle photo section, promo band, social grid, closing banner, newsletter form.

**Shop, category and product cards**
- Filters (price, tag, minimum rating), sort (featured, price low or high, top rated), result count, "Clear all". On phones the filters sit in a sheet.
- Cards with hover or tap zoom, wishlist heart and a **quick-add button with a small fly-to-cart animation**.
- Page-to-page transitions that carry the picture from the card to the product page.

**Product page**
- Gallery with thumbnails (dots and swipe on phones), accordion for description, shipping and specs, sample reviews with a rating summary.
- Sticky buy bar once the main button scrolls out of view.
- "Complete the set": add a matching product in one tap.

**Cart and checkout**
- Quantity steppers limited to 1 to 10, remove, empty-cart state.
- Voucher codes, a progress bar towards free express delivery, running totals.
- Checkout form with inline error messages, standard or express delivery, order summary.
- Success page built from the order that was just placed (kept for the browser session only).

**Basics**
- Works from 360 px phones up to wide desktops. Keyboard focus styles, alt text on images, skip link.
- Cart, wishlist and voucher are remembered in the browser; broken or missing saved data is ignored safely.
- `?static=1` turns all motion off (useful for review); otherwise motion is always on.
- The site is set to **noindex** and `robots.txt` disallows everything, so the demo does not appear in search engines.

## What is sample or demo (please say this out loud when presenting)
- **Brand and products:** Kaivo is fictional. Product names, descriptions and specifications are invented.
- **Prices:** all prices are sample prices and are labelled "sample price" next to the number. Free-shipping and express-delivery amounts are sample rules.
- **Ratings:** star ratings and counts are sample data, labelled "Sample ratings".
- **Reviews:** the review text and names are invented, labelled "Sample reviews for this concept demo".
- **Voucher codes:** `KAIVO10` gives 10% off any cart; `WELCOME200` gives ₹200 off and needs a cart of at least ₹1,999 (below that, it says so). Both are demo codes.
- **Social grid:** the "@kaivo.home" tiles and like counts are sample content, not a real account.
- **Newsletter:** only checks the email format. Nothing is saved or sent.
- **Checkout:** no payment is taken and no payment details are asked for. Nothing is sent to a server; the order number and confirmation exist only in the browser.
- **Photography:** AI-generated concept images of products and rooms, with no people in them.
- **Contact details, delivery and returns text:** placeholder wording for the concept.

## Not claimed
Kaivo is not a live store, has no stock or logistics, no real payments, accounts or order history, and has not been tested on iPhone Safari or other browsers beyond Chrome-based testing on this Mac.

## Files for sharing
- `DEPLOY.md`: how to put the demo online (Vercel) or share it temporarily from this Mac (cloudflared).
- `recordings/kaivo-tour-desktop-1440x900.mp4` and `recordings/kaivo-tour-phone-390x844.mp4`: backup screen tours (made with `node scripts/tour.mjs`).
