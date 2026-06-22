"use client";

import { PageDataSchemaType } from "@/types";
import useGetPostsByTag from "@/app/posts/hooks/use-get-posts-by-tag";
import PostItem from "@/app/posts/components/contents/post-item";
import Loader from "@/components/common/Loader";

type Props = {
  posts: PageDataSchemaType[];
  tagname: string;
};

const TagPage = ({ posts, tagname }: Props) => {
  const { filteredPosts } = useGetPostsByTag({ posts, tagname });

  if (!filteredPosts.length) return <Loader />;

  return <PostItem posts={filteredPosts} />;
};

export default TagPage;
