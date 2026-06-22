import { PageDataSchemaType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/app/posts/actions/posts";
import { postKeys } from "@/app/posts/query-keys";

const POSTS_PER_PAGE = 6;

interface Props {
  categoryName: string;
}

const useFetchPosts = ({ categoryName }: Props) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: postKeys.byCategory(categoryName),
      initialPageParam: 1,

      queryFn: async ({ pageParam }) => {
        return (await fetchPosts({
          category: categoryName,
          limit: POSTS_PER_PAGE,
          page: pageParam,
        })) as PageDataSchemaType[];
      },

      getNextPageParam(lastPage, allPages) {
        if (!lastPage || lastPage.length === 0) {
          return undefined;
        }
        if (lastPage.length < POSTS_PER_PAGE) {
          return undefined;
        }
        return allPages.length + 1;
      },

      placeholderData: (previousData) => previousData,
    });

  const posts = data?.pages.flatMap((page) => page || []) ?? [];

  return {
    posts,
    loadNextPost: fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  };
};

export default useFetchPosts;
