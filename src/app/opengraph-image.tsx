import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #070b14 0%, #0f2a3a 100%)",
          color: "#f1f5f9",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#5eead4" }}>
          usmanhafeez147.vercel.app
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 40, marginTop: 16, color: "#cbd5e1" }}>
            {profile.title}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94a3b8" }}>
          Next.js · Node.js · AWS · Kubernetes · AI agents
        </div>
      </div>
    ),
    size,
  );
}
