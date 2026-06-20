import { ImageResponse } from "next/og";

import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";

export const alt = DEFAULT_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(160deg, #080C18 0%, #121418 55%, #1a2030 100%)",
          color: "#E8EDF8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.08em", textTransform: "lowercase", opacity: 0.7 }}>
          agentomatic
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, textTransform: "lowercase" }}>
            your ai front desk.
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.4, opacity: 0.85, textTransform: "lowercase" }}>
            {DEFAULT_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    size
  );
}
