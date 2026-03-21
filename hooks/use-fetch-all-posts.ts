import { PageDataSchemaType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPosts } from "@/actions/posts";

const POSTS_QUERY_KEY = ["posts", "all"];

interface UseFetchAllPostsOptions {
  enabled?: boolean;
}

const useFetchAllPosts = (options: UseFetchAllPostsOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: async () => {
      const posts = await fetchAllPosts();
      return posts as PageDataSchemaType[];
    },
    enabled,
    staleTime: 60 * 1000,
  });
};

useFetchAllPosts.getQueryKey = () => POSTS_QUERY_KEY;

export default useFetchAllPosts;
