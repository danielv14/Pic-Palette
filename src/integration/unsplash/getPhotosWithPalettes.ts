import type { Basic } from "unsplash-js/dist/methods/photos/types";
import type { ImageWithPalette } from "~/types/Image";
import { getHexValues } from "~/utils/hexValues";

export const getPhotosWithPalettes = async (
  images: Basic[]
): Promise<ImageWithPalette[]> =>
  Promise.all(
    images.map(async (image) => {
      const hexValues = await getHexValues(image.urls.thumb);
      return {
        url: image.urls.regular,
        hexValues,
        userName: image.user.username,
        thumbnail: image.urls.thumb,
        photoUrl: image.links.html,
      };
    })
  );
