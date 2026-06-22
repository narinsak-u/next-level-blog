import { Metadata, ResolvingMetadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { siteMetadata } from "@/site/siteMetadata";

import TagPageClient from "@/app/tags/components/TagPageClient";
import useFetchAllPosts from "@/app/posts/hooks/use-fetch-all-posts";
import { fetchAllPosts } from "@/app/posts/actions/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${siteMetadata.title} — ${slug}`,
    description: `Posts about ${slug}`,
  };
}

const Tag = async ({ params }: Props) => {
  const { slug } = await params;

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
      <TagPageClient tagname={slug} />
    </HydrationBoundary>
  );
};

export default Tag;
