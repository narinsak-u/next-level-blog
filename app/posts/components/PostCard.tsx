"use client";

import { PageDataSchemaType } from "@/types";
import { PostCardBase } from "@/components/ui/PostCard";

interface PostCardProps {
  post: PageDataSchemaType;
  showImage?: boolean;
  showTags?: boolean;
  showDescription?: boolean;
}

const PostCard = ({
  post,
  showImage,
  showTags,
  showDescription,
}: PostCardProps) => {
  return (
    <PostCardBase
      post={post}
      layout="grid"
      showImage={showImage}
      showTags={showTags}
      showDescription={showDescription}
    />
  );
};

export default PostCard;
export type { PostCardProps };
