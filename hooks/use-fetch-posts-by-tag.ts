import { PageDataSchemaType } from "@/types";
import { useMemo } from "react";
import useFetchAllPosts from "./use-fetch-all-posts";

interface UseFetchPostsByTagOptions {
  tagname: string;
}

const useFetchPostsByTag = ({ tagname }: UseFetchPostsByTagOptions) => {
  const { data: posts, isLoading, error, refetch } = useFetchAllPosts();

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post: PageDataSchemaType) =>
      post.tags.some(
        (tag: { name: string }) => tag.name.toLowerCase() === tagname.toLowerCase()
      )
    );
  }, [posts, tagname]);

  return {
    posts: filteredPosts,
    isLoading,
    error,
    refetch,
    totalPosts: posts?.length ?? 0,
  };
};

export default useFetchPostsByTag;
