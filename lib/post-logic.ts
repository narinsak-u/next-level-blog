import { PageDataSchemaType, PostTagSchemaType } from "@/types";

/**
 * Filters a list of posts by a specific tag name.
 */
export const filterPostsByTag = (
  posts: PageDataSchemaType[],
  tagName: string
): PageDataSchemaType[] => {
  if (!posts) return [];
  return posts.filter((post) =>
    post.tags?.some((tag) => tag.name === tagName)
  );
};

/**
 * Returns a list of related posts based on shared tags, excluding the current post.
 */
export const getRelatedPosts = (
  posts: PageDataSchemaType[],
  currentPostId: string,
  currentPostTags: PostTagSchemaType[],
  limit = 3
): PageDataSchemaType[] => {
  try {
    if (!posts || !currentPostTags) return [];

    const currentTagNames = currentPostTags.map((t) => t.name);
    
    return posts
      .filter(
        (post) =>
          post.id !== currentPostId &&
          post.tags?.some((tag) => currentTagNames.includes(tag.name))
      )
      .slice(0, limit);
  } catch (error) {
    console.error("Error calculating related posts:", error);
    return [];
  }
};
