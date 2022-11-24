import { Basic } from "unsplash-js/dist/methods/photos/types";
import { ImageWithPalette } from "../../types/Image";
import { getHexValues } from "../../utils/hexValues";

export const getPhotosWithPalettes = async (images: Basic[]) => {
  const photosWithPalettes: ImageWithPalette[] = [];
  for (const image of images) {
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
