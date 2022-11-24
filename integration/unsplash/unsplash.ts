import { cache } from "react";
import * as Unsplash from "unsplash-js";
import { ImageWithPalette } from "../../types/Image";
import { getPhotosWithPalettes } from "./getPhotosWithPalettes";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY as string;

const unsplashAPI = Unsplash.createApi({
  accessKey: ACCESS_KEY,
});

interface SearchPhotosParams {
  query: string;
  page?: number;
  perPage?: number;
}

interface ListPhotosParams {
  page?: number;
  perPage?: number;
  listType: Unsplash.OrderBy;
}

const searchPhotos = async ({
  query,
  page = 1,
  perPage = 8,
}: SearchPhotosParams): Promise<ImageWithPalette[]> => {
  const photos = await unsplashAPI.search.getPhotos({
    query,
    page,
    perPage,
    orderBy: "relevant",
    contentFilter: "low",
    orientation: "squarish",
  });
  if (photos.errors || !photos.response) {
    console.log(photos.errors);
    return [];
  }
  const photosWithPalettes = await getPhotosWithPalettes(
    photos.response.results
  );
  return photosWithPalettes;
};

const listPhotos = async ({ perPage, page, listType }: ListPhotosParams) => {
  const photos = await unsplashAPI.photos.list({
    page,
    perPage,
    orderBy: listType,
  });
  if (photos.errors || !photos.response) {
    return [];
  }
  const photosWithPalettes = await getPhotosWithPalettes(
    photos.response.results
  );
  return photosWithPalettes;
};

export const unsplash = {
  /**
   * Use only when needed for one-off stuff
   */
  _unsplashAPI: unsplashAPI,
  searchPhotos: cache(async (params: SearchPhotosParams) =>
    searchPhotos(params)
  ),
  listPhotos: cache(async (params: ListPhotosParams) => listPhotos(params)),
};
