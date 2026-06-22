import { PageDataSchemaType, TagSchemaType } from "@/types";

export const getTags = (posts: PageDataSchemaType[]): TagSchemaType => {
  const allTags: TagSchemaType = {};

  for (const post of posts) {
    for (const tag of post.tags) {
      allTags[tag.name] = (allTags[tag.name] ?? 0) + 1;
    }
  }

  return allTags;
};
