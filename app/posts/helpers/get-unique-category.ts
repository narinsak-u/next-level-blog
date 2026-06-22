import { PageDataSchemaType } from "@/types";

export const getCategory = (posts: PageDataSchemaType[]): string[] => {
  const categories = new Set<string>();

  for (const post of posts) {
    if (post.category) {
      categories.add(post.category);
    }
  }

  return [...categories];
};
