import { z } from "zod";
import { PaginationSchema } from "./PaginationParams";

const ImageSearchBaseSchema = z.object({
  query: z.string().default(""),
});

export const ImageSearchSchema = ImageSearchBaseSchema.merge(PaginationSchema);

export type ImageSearchOptions = z.infer<typeof ImageSearchSchema>;
