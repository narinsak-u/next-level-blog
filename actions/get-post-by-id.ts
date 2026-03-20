import { getPostById as getPostByIdFromNotion } from "@/actions/notion";

export const getPostById = async (postId: string) => {
  return getPostByIdFromNotion(postId);
};
