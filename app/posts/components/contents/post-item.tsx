"use client";

import { PageDataSchemaType } from "@/types";
import { PostCardGrid, PostCardList } from "@/components/ui/PostCard";
import useLayoutStore from "@/hooks/use-layout-store";

type Props = {
  posts: PageDataSchemaType[];
};

const PostItem = ({ posts }: Props) => {
  const { isGrid } = useLayoutStore();

  const containerClass = isGrid
    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
    : "flex flex-col gap-1";

  return (
    <div className={containerClass}>
      {posts.map((item) =>
        isGrid ? (
          <PostCardGrid key={item.id} post={item} />
        ) : (
          <PostCardList key={item.id} post={item} />
        )
      )}
    </div>
  );
};

export default PostItem;
