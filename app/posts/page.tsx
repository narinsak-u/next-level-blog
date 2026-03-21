export const revalidate = 120;

import { Metadata } from "next";
import { getAllPosts } from "@/actions/notion";

import { siteMetadata } from "@/site/siteMetadata";

import PostsPageLayout from "@/app/posts/components/PostsPageLayout";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — Posts`,
  description: `All posts from ${siteMetadata.title}`,
};

const Posts = async () => {
  const posts = await getAllPosts();

  return <PostsPageLayout posts={posts} />;
};

export default Posts;
