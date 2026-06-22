export const postKeys = {
  all: ["posts"] as const,
  byCategory: (category: string) => [...postKeys.all, "category", category] as const,
  allPosts: () => [...postKeys.all, "all"] as const,
};
