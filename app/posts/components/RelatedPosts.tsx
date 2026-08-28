"use client";

import { PageDataSchemaType } from "@/types";
import { Center, Text } from "@mantine/core";
import { PostCardList } from "@/app/posts/components/PostCard";
import MorePost from "./MorePost";
import useLayoutStore from "@/app/posts/hooks/use-layout-store";

type Props = {
  posts: PageDataSchemaType[];
  postData: PageDataSchemaType;
};

const RelatedPosts = ({ posts }: Props) => {
  const { isGrid } = useLayoutStore();

  if (posts.length === 0)
    return (
      <Center mt={30}>
        <Text>No post matched... 😕</Text>
      </Center>
    );

  const containerClass = isGrid
    ? "grid grid-cols-2 md:grid-cols-3 gap-4"
    : "flex flex-col gap-1";

  return (
    <div className={containerClass}>
      {posts.map((post) =>
        isGrid ? (
          <MorePost key={post.id} post={post} />
        ) : (
          <PostCardList key={post.id} post={post} />
        )
      )}
    </div>
  );
};

export default RelatedPosts;
