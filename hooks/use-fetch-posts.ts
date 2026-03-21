import { PageDataSchemaType } from "@/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "@/actions/posts";
import { useEffect } from "react";

const POSTS_PER_PAGE = 6;

interface Props {
  categoryName: string;
}

const useFetchPosts = ({ categoryName }: Props) => {
  const queryClient = useQueryClient();
  const cachedPosts = queryClient.getQueryData<PageDataSchemaType[]>(["posts", "all"]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, dataUpdatedAt } =
    useInfiniteQuery({
      queryKey: ["posts", categoryName],
      initialPageParam: 1,

      queryFn: async ({ pageParam }) => {
        return (await fetchPosts({
          category: categoryName,
          limit: POSTS_PER_PAGE,
          page: pageParam
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

  const posts = data?.pages.flatMap((page) => page || []).filter(Boolean) ?? [];

  useEffect(() => {
    if (cachedPosts && posts.length === 0 && !isLoading) {
      const categoryPosts = cachedPosts.filter(
        (post) => post.category?.toLowerCase() === categoryName.toLowerCase()
      );
      if (categoryPosts.length > 0) {
        queryClient.setQueryData(["posts", categoryName], {
          pages: [categoryPosts.slice(0, POSTS_PER_PAGE)],
          pageParams: [1],
        });
      }
    }
  }, [cachedPosts, categoryName, posts.length, isLoading, queryClient]);

  return { 
    posts: posts.length > 0 ? posts : (cachedPosts?.filter(
      (post) => post.category?.toLowerCase() === categoryName.toLowerCase()
    ) ?? []), 
    loadNextPost: fetchNextPage, 
    isFetchingNextPage, 
    hasNextPage,
    isLoading 
  };
};

export default useFetchPosts;