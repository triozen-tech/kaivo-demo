import { inr } from "@/lib/format";

export function Price({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`price ${className}`}>
      <span className="price-num">{inr(value)}</span>
      <span className="sample-tag">sample price</span>
    </span>
  );
}
