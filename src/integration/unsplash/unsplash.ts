import { createServerFn } from "@tanstack/react-start";
import * as Unsplash from "unsplash-js";
import type { ImageListOptions } from "~/schemas/ImageListParams";
import type { ImageSearchOptions } from "~/schemas/ImageSearchParams";
import type { ImageWithPalette } from "~/types/Image";
import { ACCESS_KEY } from "./config";
import { getPhotosWithPalettes } from "./getPhotosWithPalettes";

const unsplashAPI = Unsplash.createApi({
  accessKey: ACCESS_KEY,
});

export const searchPhotosByQuery = createServerFn({ method: "GET" })
  .inputValidator((params: ImageSearchOptions) => params)
  .handler(async ({ data }): Promise<ImageWithPalette[]> => {
    const { query, page = 1, perPage } = data;
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
    return getPhotosWithPalettes(photos.response.results);
  });

export const listPhotosByType = createServerFn({ method: "GET" })
  .inputValidator((params: ImageListOptions) => params)
  .handler(async ({ data }): Promise<ImageWithPalette[]> => {
    const { perPage, page, type } = data;
    const photos = await unsplashAPI.photos.list({
      page,
      perPage,
      orderBy: type,
    });
    if (photos.errors || !photos.response) {
      return [];
    }
    return getPhotosWithPalettes(photos.response.results);
  });
