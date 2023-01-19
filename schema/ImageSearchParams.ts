import { z } from "zod";

export const ImageSearchParamsSchema = z.object({
  query: z.string().default(""),
  page: z
    .string()
    .default("0")
    .transform((val) => parseInt(val)),
});

export type ImageSearchParams = z.infer<typeof ImageSearchParamsSchema>;

export type ImageSearchOptions = ImageSearchParams & { perPage?: number };
