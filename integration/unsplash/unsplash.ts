import { cache } from "react";
import * as Unsplash from "unsplash-js";
import { ImageWithPalette } from "../../types/Image";
import { getHexValues } from "../../utils/hexValues";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY as string;

const unsplashAPI = Unsplash.createApi({
  accessKey: ACCESS_KEY,
});

interface SearchPhotosParams {
  query: string;
  page?: number;
  perPage?: number;
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
  if (photos.errors) {
    console.log(photos.errors);
    return [];
  }
  if (!photos.response) {
    return [];
  }
  const photosWithPalettes: ImageWithPalette[] = [];
  for (const image of photos.response.results) {
    const hexValues = await getHexValues(image.urls.thumb);
    photosWithPalettes.push({
      url: image.urls.regular,
      hexValues,
      userName: image.user.username,
      thumbnail: image.urls.thumb,
    });
  }
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
};
