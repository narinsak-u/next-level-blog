import { PageDataSchemaType } from "@/types";
import { getAllPosts } from "@/actions/notion";

export const getPostById = async (postId: string): Promise<PageDataSchemaType | null> => {
  try {
    const posts = await getAllPosts();
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      coverImage: post.coverImage,
      title: post.title,
      lastUpdated: post.lastUpdated,
      description: post.description,
      createdTime: post.createdTime,
      tags: post.tags,
      authorId: post.authorId,
      lastEditedBy: post.lastEditedBy,
      icon: post.icon,
      category: post.category,
    };
  } catch (error) {
    console.error(error, "error at getPostById");
    return null;
  }
};
