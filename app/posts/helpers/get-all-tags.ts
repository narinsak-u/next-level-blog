import {
  PageDataSchemaType,
  TagSchemaType,
  PageDataArraySchema,
  TagSchema,
} from "@/types";

// Get all tags from posts
export const getTags = (posts: PageDataSchemaType[]): TagSchemaType => {
  try {
    // Validate posts array using Zod
    const validPosts = PageDataArraySchema.parse(posts);

    const allTags: TagSchemaType = {};

    validPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!allTags[tag.name]) {
          allTags[tag.name] = 1;
        } else {
          allTags[tag.name] += 1;
        }
      });
    });

    // Validate the resulting tags using Zod
    return TagSchema.parse(allTags);
  } catch (error) {
    console.error("Validation error:", error);
    return {};
  }
};
