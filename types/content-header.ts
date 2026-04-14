import { z } from "zod";

const ContentHeaderSchema = z.object({
  label: z.string(),
  link: z.string(),
  order: z.number(),
});

export { ContentHeaderSchema };
export type ContentHeaderSchemaType = z.infer<typeof ContentHeaderSchema>;