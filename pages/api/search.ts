import type { NextApiRequest, NextApiResponse } from "next";
import { unsplash } from "../../integration/unsplash";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "../../integration/unsplash/config";
import { ImageSearchParamsSchema } from "../../schema/ImageSearchParams";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const params = ImageSearchParamsSchema.parse(req.query);
  const photos = await unsplash.searchPhotos({
    ...params,
    perPage: AMOUNT_OF_IMAGES_TO_FETCH,
  });
  res.status(200).json(photos);
}
