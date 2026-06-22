import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { siteMetadata } from "@/site/siteMetadata";

import PostsPageClient from "@/app/posts/components/PostsPageClient";
import useFetchAllPosts from "@/app/posts/hooks/use-fetch-all-posts";
import { fetchAllPosts } from "@/app/posts/actions/posts";

export const metadata: Metadata = {
  title: `${siteMetadata.title} — Posts`,
  description: `All posts from ${siteMetadata.title}`,
};

const Posts = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: useFetchAllPosts.getQueryKey(),
    queryFn: async () => {
      const posts = await fetchAllPosts();
      return posts;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsPageClient />
    </HydrationBoundary>
  );
};

export default Posts;
