/** Fridge mark rendered with plain divs so it works inside ImageResponse. */
export function BrandIconArt({ size }: { size: number }) {
  const u = size / 100;
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #10b981 0%, #0f766e 100%)",
      }}
    >
      <div
        style={{
          width: 44 * u,
          height: 64 * u,
          borderRadius: 9 * u,
          background: "#ecfdf5",
          display: "flex",
          flexDirection: "column",
          padding: 5 * u,
          gap: 4 * u,
        }}
      >
        <div style={{ flex: 2, borderRadius: 4 * u, background: "#a7f3d0", display: "flex", alignItems: "center", paddingLeft: 4 * u }}>
          <div style={{ width: 3 * u, height: 9 * u, borderRadius: 2 * u, background: "#065f46" }} />
        </div>
        <div style={{ flex: 3, borderRadius: 4 * u, background: "#a7f3d0", display: "flex", alignItems: "flex-start", paddingLeft: 4 * u, paddingTop: 4 * u }}>
          <div style={{ width: 3 * u, height: 12 * u, borderRadius: 2 * u, background: "#065f46" }} />
        </div>
      </div>
    </div>
  );
}
