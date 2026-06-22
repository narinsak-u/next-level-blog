"use client";

import { PageDataSchemaType } from "@/types";
import useFetchAllPosts from "@/app/posts/hooks/use-fetch-all-posts";
import RelatedPosts from "./RelatedPosts";

type Props = {
  postData: PageDataSchemaType;
};

const RelatedPostsWrapper = ({ postData }: Props) => {
  const { data: posts } = useFetchAllPosts();

  if (!posts) return null;

  return <RelatedPosts posts={posts} postData={postData} />;
};

export default RelatedPostsWrapper;
