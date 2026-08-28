import type { PageDataSchemaType } from "@/types";

const DEFAULT_RELATED_POST_LIMIT = 3;

export const selectRelatedPosts = (
  posts: PageDataSchemaType[],
  currentPost: PageDataSchemaType,
  limit = DEFAULT_RELATED_POST_LIMIT,
): PageDataSchemaType[] => {
  if (limit <= 0) return [];

  const currentTagNames = new Set(currentPost.tags.map((tag) => tag.name));
  const sharedTagPosts: PageDataSchemaType[] = [];
  const categoryOnlyPosts: PageDataSchemaType[] = [];

  for (const post of posts) {
    if (post.id === currentPost.id) continue;

    const sharesTag = post.tags.some((tag) => currentTagNames.has(tag.name));
    if (sharesTag) {
      sharedTagPosts.push(post);
    } else if (post.category === currentPost.category) {
      categoryOnlyPosts.push(post);
    }
  }

  return [...sharedTagPosts, ...categoryOnlyPosts].slice(0, limit);
};
