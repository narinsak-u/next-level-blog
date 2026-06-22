import { PageDataSchemaType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPosts } from "@/app/posts/actions/posts";
import { postKeys } from "@/app/posts/query-keys";

interface UseFetchAllPostsOptions {
  enabled?: boolean;
}

const useFetchAllPosts = (options: UseFetchAllPostsOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: postKeys.allPosts(),
    queryFn: async () => {
      const posts = await fetchAllPosts();
      return posts as PageDataSchemaType[];
    },
    enabled,
    staleTime: 60 * 1000,
  });
};

useFetchAllPosts.getQueryKey = () => postKeys.allPosts();

export default useFetchAllPosts;
