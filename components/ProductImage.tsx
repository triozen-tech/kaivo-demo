import Image from "next/image";

/** Product / banner image from public/images/kaivo. Falls back to nothing special: files are guaranteed by the asset step. */
export function Pic({
  name, alt, sizes, position, priority = false, className,
}: { name: string; alt: string; sizes: string; position?: string; priority?: boolean; className?: string }) {
  return (
    <Image
      src={`/images/kaivo/${name}.webp`}
      alt={alt}
      fill
      sizes={sizes}
      quality={92}
      preload={priority}
      className={className}
      style={{ objectFit: "cover", objectPosition: position }}
    />
  );
}
