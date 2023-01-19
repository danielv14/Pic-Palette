import { z } from "zod";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "../integration/unsplash/config";

export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("0")
    .transform((val) => parseInt(val)),
  perPage: z
    .string()
    .optional()
    .default(`${AMOUNT_OF_IMAGES_TO_FETCH}`)
    .transform((val) => parseInt(val)),
});

/**
 * Either [type] or [query] can exist, not both at the same time
 */
const TypeOrQuerySchema = z.object({
  type: z.string().optional(),
  query: z.string().optional(),
});

export const PaginationWithTypeOrQuerySchema =
  PaginationSchema.merge(TypeOrQuerySchema);
