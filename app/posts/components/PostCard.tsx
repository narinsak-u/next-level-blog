"use client";

import { PageDataSchemaType } from "@/types";
import { PostCardGrid } from "@/components/ui/PostCard";

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
    <PostCardGrid
      post={post}
      showImage={showImage}
      showTags={showTags}
      showDescription={showDescription}
    />
  );
};

export default PostCard;
export type { PostCardProps };
