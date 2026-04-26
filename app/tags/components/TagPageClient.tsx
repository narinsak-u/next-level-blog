"use client";

import useFetchPostsByTag from "@/hooks/use-fetch-posts-by-tag";
import PostItem from "@/app/posts/components/contents/post-item";
import Loader from "@/components/common/Loader";

type Props = {
  tagname: string;
};

const TagPageClient = ({ tagname }: Props) => {
  const { posts, isLoading, error } = useFetchPostsByTag({ tagname });

  if (isLoading) return <Loader />;
  if (error || !posts) return null;

  return <PostItem posts={posts} />;
};

export default TagPageClient;
