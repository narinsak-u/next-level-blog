import { z } from "zod";
import { PostTagSchema } from "./post-tag";

const PageDataSchema = z.object({
  id: z.string(),
  coverImage: z.string().optional(),
  title: z.string(),
  description: z.string(),
  createdTime: z.string(),
  lastUpdated: z.string(),
  authorId: z.string(),
  lastEditedBy: z.string(),
  tags: z.array(PostTagSchema),
  icon: z.string(),
  category: z.string(),
});

export { PageDataSchema };
export type PageDataSchemaType = z.infer<typeof PageDataSchema>;
export const PageDataArraySchema = z.array(PageDataSchema);