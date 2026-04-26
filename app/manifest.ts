import type { MetadataRoute } from "next";
import { siteMetadata } from "@/site/siteMetadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteMetadata.title}`,
    short_name: `${siteMetadata.title}`,
    description: `${siteMetadata.description}`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/pwa-icons/icon512_maskable.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icons/icon512_maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
