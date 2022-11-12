// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unsplash } from "../../integration/unsplash";
import { ImageSearchParams } from "../../types/ImageSearchParams";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const params = req.query as unknown as ImageSearchParams;
  const photos = await unsplash.searchPhotos({
    query: params.query,
    page: parseInt(params.page as string),
    perPage: 8,
  });
  res.status(200).json(photos);
}
