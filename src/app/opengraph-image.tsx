import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} (Usman Abdul Hafeez), ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(
    path.join(process.cwd(), "public", "usman-hafeez.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 36, marginTop: 16, color: "#cbd5e1" }}>
              {profile.title}
            </div>
          </div>
          <img
            src={photoSrc}
            alt=""
            width={260}
            height={260}
            style={{ borderRadius: 130, border: "6px solid #5eead4" }}
          />
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94a3b8" }}>
          Next.js · Node.js · AWS · Kubernetes · AI agents
        </div>
      </div>
    ),
    size,
  );
}
