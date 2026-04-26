import { z } from "zod";

const PostTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export { PostTagSchema };
export type PostTagSchemaType = z.infer<typeof PostTagSchema>;