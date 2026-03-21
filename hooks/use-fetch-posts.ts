import { PageDataSchemaType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsByCategory } from "@/actions/notion";

const POSTS_PER_PAGE = 6;

interface Props {
  categoryName: string;
}

const useFetchPosts = ({ categoryName }: Props) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", categoryName],
      initialPageParam: 1,

      queryFn: async ({ pageParam }) => {
        return (await getPostsByCategory(
          categoryName,
          POSTS_PER_PAGE,
          pageParam
        )) as PageDataSchemaType[];
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
      initialData: {
        pages: [],
        pageParams: [1],
      },
    });

  const posts =
    data && data.pages.flatMap((page) => page || []).filter(Boolean);

  return { posts, loadNextPost: fetchNextPage, isFetchingNextPage, hasNextPage };
};

export default useFetchPosts;
