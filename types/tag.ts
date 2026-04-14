import { z } from "zod";

const TagSchema = z.record(z.string(), z.number());

export { TagSchema };
export type TagSchemaType = z.infer<typeof TagSchema>;