import { ImageResponse } from "next/og";
import { siteMetadata } from "@/site/siteMetadata";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#666" }}>#</span>
          <span style={{ fontWeight: "bold" }}>{slug}</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#999",
          }}
        >
          {siteMetadata.title}
        </div>
      </div>
    )
  );
}
