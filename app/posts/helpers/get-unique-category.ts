import { PageDataSchemaType, PageDataArraySchema } from "@/types";

// Get unique categories from posts
export const getCategory = (posts: PageDataSchemaType[]): string[] => {
  try {
    // Validate posts array using Zod
    const validPosts = PageDataArraySchema.parse(posts);

    const categories = new Set<string>();

    validPosts.forEach((post) => {
      if (post.category) {
        categories.add(post.category);
      }
    });

    return [...categories];
  } catch (error) {
    console.error("Validation error:", error);
    return [];
  }
};
