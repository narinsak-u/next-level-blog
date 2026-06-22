"use client";

import { PageDataSchemaType } from "@/types";
import useFetchAllPosts from "@/app/posts/hooks/use-fetch-all-posts";
import PostsPageLayout from "@/app/posts/components/PostsPageLayout";
import Loader from "@/components/common/Loader";

const PostsPageClient = () => {
  const { data: posts, isLoading, error } = useFetchAllPosts();

  if (isLoading) return <Loader />;
  if (error || !posts) return null;

  return <PostsPageLayout posts={posts as PageDataSchemaType[]} />;
};

export default PostsPageClient;
