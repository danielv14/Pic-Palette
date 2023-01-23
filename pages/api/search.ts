import type { NextApiRequest, NextApiResponse } from "next";
import { unsplash } from "../../integration/unsplash";
import { ImageSearchSchema } from "../../schemas/ImageSearchParams";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const params = ImageSearchSchema.parse(req.query);
  const photos = await unsplash.searchPhotosByQuery(params);
  res.status(200).json(photos);
}
