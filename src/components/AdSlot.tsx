// ============================================================
// AdSlot — Placeholder untuk Google Ad Manager
// Nanti diganti dengan GPT (Google Publisher Tag) snippet.
// Untuk sekarang, div kosong ini udah cukup buat planning layout.
// Lo bisa inject iklan dari custom plugin nantinya.
// ============================================================

interface AdSlotProps {
  id: string;            // GAM ad unit ID nanti
  size?: "banner" | "rectangle" | "leaderboard";
  className?: string;
}

const adSizes = {
  banner: { width: "100%", height: "90px", label: "Ad Banner (728×90)" },
  rectangle: { width: "300px", height: "250px", label: "Ad Rectangle (300×250)" },
  leaderboard: { width: "100%", height: "90px", label: "Ad Leaderboard" },
};

export function AdSlot({ id, size = "rectangle", className }: AdSlotProps) {
  const { width, height, label } = adSizes[size];

  // Di production, ini akan diganti dengan GPT script
  // dan div dengan class yang GAM kenali
  return (
    <div
      id={id}
      className={className}
      role="complementary"
      aria-label="Advertisement"
      style={{
        width,
        minHeight: height,
        backgroundColor: "#0f0f0f",
        border: "1px dashed #2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Hapus label ini di production — ini cuma buat development */}
      <span
        className="text-xs"
        style={{
          color: "#333",
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        {process.env.NODE_ENV === "development" ? label : null}
      </span>
    </div>
  );
}