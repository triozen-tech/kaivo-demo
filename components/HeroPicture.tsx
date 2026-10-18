import { getImageProps } from "next/image";

/** Art-directed hero: the portrait picture below 900 px, the wide one from 900 px up. Only the matching file is fetched. */
export function HeroPicture({ alt }: { alt: string }) {
  const common = { fill: true, quality: 92, preload: true } as const;
  const { props: wide } = getImageProps({ ...common, src: "/images/kaivo/hero.webp", alt, sizes: "100vw" });
  const { props: tall } = getImageProps({ ...common, src: "/images/kaivo/hero-m.webp", alt, sizes: "100vw" });
  const { srcSet: tallSet } = tall;
  return (
    <picture>
      <source media="(max-width: 899px)" srcSet={tallSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...wide} style={{ ...wide.style, objectFit: "cover", objectPosition: "70% 50%" }} />
    </picture>
  );
}
