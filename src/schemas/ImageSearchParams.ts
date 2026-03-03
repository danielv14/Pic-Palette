import { z } from "zod";
import { PaginationSchema } from "./PaginationParams";

export const UNSPLASH_COLORS = [
  "black_and_white",
  "black",
  "white",
  "yellow",
  "orange",
  "red",
  "purple",
  "magenta",
  "green",
  "teal",
  "blue",
] as const;

export type UnsplashColor = (typeof UNSPLASH_COLORS)[number];

const ImageSearchBaseSchema = z.object({
  query: z.string().default(""),
  color: z.enum(UNSPLASH_COLORS).optional(),
});

export const ImageSearchSchema = ImageSearchBaseSchema.merge(PaginationSchema);

export type ImageSearchOptions = z.infer<typeof ImageSearchSchema>;
