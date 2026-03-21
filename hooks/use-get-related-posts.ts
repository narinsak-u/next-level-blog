import { useMemo } from "react";
import { PageDataSchemaType, PostTagSchemaType } from "@/types";
import { getRelatedPosts } from "@/lib/post-logic";

type Props = {
  postId: string;
  posts: PageDataSchemaType[];
  postTags: PostTagSchemaType[];
};

const useGetRelatedPosts = ({ postId, posts, postTags }: Props) => {
  const relatedPosts = useMemo(
    () => getRelatedPosts(posts, postId, postTags),
    [postId, posts, postTags]
  );

  return { relatedPosts };
};

export default useGetRelatedPosts;
