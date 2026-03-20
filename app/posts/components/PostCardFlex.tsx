"use client";

import { PageDataSchemaType } from "@/types";
import { PostCardBase } from "@/components/ui/PostCard";

interface PostCardFlexProps {
  post: PageDataSchemaType;
  showDescription?: boolean;
}

const PostCardFlex = ({ post, showDescription }: PostCardFlexProps) => {
  return (
    <PostCardBase
      post={post}
      layout="list"
      showImage={false}
      showTags={false}
      showDescription={showDescription}
    />
  );
};

export default PostCardFlex;
export type { PostCardFlexProps };
