"use client";

import { PageDataSchemaType } from "@/types";
import { PostCardList } from "@/components/ui/PostCard";

interface PostCardFlexProps {
  post: PageDataSchemaType;
  showDescription?: boolean;
}

const PostCardFlex = ({ post, showDescription }: PostCardFlexProps) => {
  return (
    <PostCardList
      post={post}
      showDescription={showDescription}
    />
  );
};

export default PostCardFlex;
export type { PostCardFlexProps };
