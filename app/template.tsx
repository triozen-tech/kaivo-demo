/** Remounts on every route change, which replays the short fade-and-rise (CSS, `.mo` only). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
