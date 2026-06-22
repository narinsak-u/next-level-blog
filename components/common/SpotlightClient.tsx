"use client";

import Spotlight from "@/components/common/Spotlight";
import useFetchAllPosts from "@/app/posts/hooks/use-fetch-all-posts";

const SpotlightClient = () => {
  const { data: posts } = useFetchAllPosts();

  if (!posts) return null;

  return <Spotlight data={posts} />;
};

export default SpotlightClient;
