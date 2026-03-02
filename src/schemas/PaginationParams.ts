import { z } from "zod";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "~/integration/unsplash/config";

export const PaginationSchema = z.object({
  page: z.coerce.number().optional().default(0),
  perPage: z.coerce.number().optional().default(AMOUNT_OF_IMAGES_TO_FETCH),
});
