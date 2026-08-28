export type PostCategoryQueryKey = readonly ["posts", "category", string];

export const postKeys = {
  all: ["posts"] as const,
  byCategory: (category: string): PostCategoryQueryKey =>
    [...postKeys.all, "category", category] as const,
  allPosts: () => [...postKeys.all, "all"] as const,
};
