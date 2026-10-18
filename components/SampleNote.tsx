export function SampleNote({ children = "Sample ratings for this concept demo" }: { children?: React.ReactNode }) {
  return <p className="sample-note">{children}</p>;
}
