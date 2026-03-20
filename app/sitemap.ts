import type { MetadataRoute } from "next";
import { siteMetadata } from "@/site/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteMetadata.siteAddress}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteMetadata.siteAddress}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteMetadata.siteAddress}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteMetadata.siteAddress}/hobbies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteMetadata.siteAddress}/note`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
