"use client";

import useFetchPosts from "@/app/posts/hooks/use-fetch-posts";
import PostItem from "./post-item";
import LoadButton from "@/components/common/LoadButton";
import { Suspense } from "react";
import Loader from "@/components/common/Loader";
import { Text, Space } from "@mantine/core";

type Props = {
  categoryName: string;
  description: string;
};

const PostGrid = ({ categoryName, description }: Props) => {
  const { posts, loadNextPost, isFetchingNextPage, hasNextPage } =
    useFetchPosts({ categoryName });

  if (!posts || !posts.length) return null;

  return (
    <Suspense fallback={<Loader />}>
      <Text c="dimmed" size="xs" mt={4}>
        {`${description}`}
      </Text>
      <Space h="xl" />
      <PostItem posts={posts} />
      <Space h="xl" />
      {hasNextPage && (
        <LoadButton
          categoryName={categoryName}
          loadNextPost={loadNextPost}
          isFetchingNextPage={isFetchingNextPage}
          postCount={posts.length}
        />
      )}
    </Suspense>
  );
};

export default PostGrid;
