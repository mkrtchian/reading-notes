export function Book({ children }: { children: React.ReactNode }) {
  return (
    <em style={{ color: "#a64d79", fontWeight: "bold", fontStyle: "italic" }}>
      {children}
    </em>
  );
}
