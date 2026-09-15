import { ImageResponse } from "next/og";

export const alt = "Videqqu — Streaming Video";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b0b0b 0%, #1f1f1f 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "#ff9000",
              color: "white",
              fontSize: 56,
              fontWeight: 900,
            }}
          >
            ▶
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 900 }}>
            <span
              style={{
                display: "flex",
                background: "#ff9000",
                color: "white",
                padding: "4px 16px",
                borderRadius: 12,
              }}
            >
              Videq
            </span>
            <span
              style={{
                display: "flex",
                background: "white",
                color: "black",
                padding: "4px 16px",
                borderRadius: 12,
              }}
            >
              qu
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#a1a1aa",
          }}
        >
          Tonton video favoritmu. Gratis, cepat, mudah dibagikan.
        </div>
      </div>
    ),
    { ...size },
  );
}
