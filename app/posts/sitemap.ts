import { MetadataRoute } from "next";
import { siteMetadata } from "@/site/siteMetadata";
import { getAllPosts } from "@/actions/notion";

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  const totalPosts = (await getAllPosts()).length;

  const postPerSitemap = 50000;
  const numberOfSitemap = Math.ceil(totalPosts / postPerSitemap);

  const sitemaps = Array.from({ length: numberOfSitemap }, (_, index) => ({
    id: index,
  }));

  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  //   const start = id * 1000;
  //   const end = start + 1000;
  const posts = await getAllPosts();

  return posts.map((post) => ({
    url: `${siteMetadata.metadataBase}/posts/${post.id}`,
    lastModified: post.lastUpdated || post.createdTime,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}
