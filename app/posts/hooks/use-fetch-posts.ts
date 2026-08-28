import type { PostQueryPage } from "@/app/posts/helpers/post-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/app/posts/actions/posts";
import { postKeys } from "@/app/posts/query-keys";

const POSTS_PER_PAGE = 6;
const STALE_TIME = 5 * 60 * 1000;
const MAX_PAGES = 5;

interface Props {
  categoryName: string;
}

const useFetchPosts = ({ categoryName }: Props) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: postKeys.byCategory(categoryName),
      initialPageParam: null,
      staleTime: STALE_TIME,
      maxPages: MAX_PAGES,

      queryFn: ({ pageParam }) =>
        fetchPosts({
          category: categoryName,
          cursor: pageParam,
          pageSize: POSTS_PER_PAGE,
        }),

      getNextPageParam(lastPage: PostQueryPage) {
        return lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
      },

      placeholderData: (previousData) => previousData,
    });

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    posts,
    loadNextPost: fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  };
};

export default useFetchPosts;
