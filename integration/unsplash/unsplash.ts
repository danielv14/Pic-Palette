import { cache } from "react";
import * as Unsplash from "unsplash-js";
import { ImageListOptions } from "../../schemas/ImageListParams";
import { ImageSearchOptions } from "../../schemas/ImageSearchParams";
import { ImageWithPalette } from "../../types/Image";
import { ACCESS_KEY } from "./config";
import { getPhotosWithPalettes } from "./getPhotosWithPalettes";

const unsplashAPI = Unsplash.createApi({
  accessKey: ACCESS_KEY,
});

const searchPhotos = async ({
  query,
  page = 1,
  perPage,
}: ImageSearchOptions): Promise<ImageWithPalette[]> => {
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

const listPhotos = async ({ perPage, page, type }: ImageListOptions) => {
  const photos = await unsplashAPI.photos.list({
    page,
    perPage,
    orderBy: type,
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
  searchPhotos: cache(async (params: ImageSearchOptions) =>
    searchPhotos(params)
  ),
  listPhotos: cache(async (params: ImageListOptions) => listPhotos(params)),
};
