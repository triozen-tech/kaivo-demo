import Link from "next/link";
import { categories } from "@/data/categories";

const icons: Record<string, React.ReactNode> = {
  tumblers: <><path d="M15 15h18l-2 25a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2l-2-25Z" /><path d="M13 15h22v-2.500a2 2 0 0 0-2-2H15a2 2 0 0 0-2 2V15ZM26 10.500l3-7h5M16.500 25h15" /></>,
  "retro-kitchen": <><path d="M12 28c0-8 5-13 12-13s12 5 12 13v8a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3v-8Z" /><path d="M24 15v-4M20.500 11h7M36 27l7-7M12 25c-5 1-5 9 0 10M19 30h10" /></>,
  shakers: <><path d="M17 8h14v5H17zM19 13v4M29 13v4" /><path d="M16 17h16l-1.200 23a2.500 2.500 0 0 1-2.500 2.500H19.700A2.500 2.500 0 0 1 17.200 40L16 17ZM21 25h6M21 31h6" /></>,
  "food-jars": <><path d="M14 9h20v6H14z" /><path d="M12 15h24v23a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V15ZM17 25h14" /></>,
  beauty: <><path d="M21 4h6v8h-6zM19 12h10v4H19z" /><path d="M16 16h16v22a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V16ZM20 26h8" /></>,
};

const usp = [
  { t: "Free sample shipping", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.500 1.500 0 1 0 0-.01M17 19a1.500 1.500 0 1 0 0-.01" },
  { t: "Easy 30-day returns", d: "M4 12a8 8 0 1 0 3-6.200M4 4v4h4" },
  { t: "Secure demo checkout", d: "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z" },
];

/** Three short promises, right under the hero. */
export function UspRow() {
  return (
    <section className="usp" aria-label="Our promises">
      <ul className="container usp-in">
        {usp.map((u) => (
          <li key={u.t}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={u.d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{u.t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Five rounded tiles with original line icons: a snap-scrolling row on phones. */
export function CategoryIcons() {
  return (
    <nav className="cicons" aria-label="Shop by category icon">
      <ul className="cicons-in container">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/c/${c.slug}`} className="cicon">
              <span className="cicon-tile"><svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[c.slug]}</svg></span>
              <span className="cicon-label">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
