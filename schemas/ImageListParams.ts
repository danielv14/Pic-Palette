import { OrderBy } from "unsplash-js";
import { z } from "zod";
import { PaginationSchema } from "./PaginationParams";

const ImageListBaseSchema = z.object({
  type: z.nativeEnum(OrderBy).default(OrderBy.POPULAR),
});

export const ImageListSchema = ImageListBaseSchema.merge(PaginationSchema);

export type ImageListOptions = z.infer<typeof ImageListSchema>;
