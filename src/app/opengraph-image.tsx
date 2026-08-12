import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { landingContent } from "@/features/landing/content";
import { SITE_NAME } from "@/shared/lib/site";

/**
 * The social card. Written in English on purpose: it's generated once at build
 * time and shared into feeds where the reader's language is unknowable, so it
 * can't be negotiated the way the page itself is.
 */
const content = landingContent.en;

export const alt = content.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const icon = await readFile(join(process.cwd(), "public/icon-192.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #241a3a 0%, #16121f 55%, #0c0a12 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* satori renders a plain <img>; next/image has no meaning inside an ImageResponse */}
          <img src={iconSrc} width={72} height={72} alt="" style={{ borderRadius: "18px" }} />
          <span style={{ fontSize: 44, fontWeight: 700, color: "#ffffff" }}>{SITE_NAME}</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            marginTop: "48px",
          }}
        >
          {content.hero.title}
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "#d27cc0" }}>
          {content.hero.titleAccent}
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#cfccdd", marginTop: "36px" }}>
          {content.hero.reassurance.join("  ·  ")}
        </div>
      </div>
    ),
    size,
  );
}
