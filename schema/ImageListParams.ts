import { OrderBy } from "unsplash-js";
import { z } from "zod";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "../integration/unsplash/config";

export const ImageListSearchParamSchema = z.object({
  type: z.nativeEnum(OrderBy).default(OrderBy.POPULAR),
  page: z
    .string()
    .default("0")
    .transform((val) => parseInt(val)),
  perPage: z
    .string()
    .default(`${AMOUNT_OF_IMAGES_TO_FETCH}`)
    .transform((val) => parseInt(val)),
});

export type ImageListSearchParams = z.infer<typeof ImageListSearchParamSchema>;
export type ImageListParams = ImageListSearchParams & { perPage?: number };
