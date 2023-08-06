export function Tool({ children }: { children: React.ReactNode }) {
  return (
    <em style={{ color: "#3d85c6", fontWeight: "bold", fontStyle: "normal" }}>
      {children}
    </em>
  );
}
