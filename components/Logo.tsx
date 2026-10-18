/** The OnTrend Oman logo image. `reverse` is the cream version for dark backgrounds. Height is set in CSS, width follows the ratio. */
export function Logo({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/ontrend/${reverse ? "logo-reverse" : "logo"}.webp`} alt="OnTrend Oman" width={1158} height={443} className={`logo-img ${className}`} decoding="async" />;
}
