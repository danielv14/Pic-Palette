import type { Basic } from "unsplash-js/dist/methods/photos/types";
import type { UnsplashImage } from "~/types/Image";

export const mapPhotos = (images: Basic[]): UnsplashImage[] =>
  images.map((image) => ({
    id: image.id,
    url: image.urls.regular,
    smallUrl: image.urls.small,
    userName: image.user.username,
    thumbnail: image.urls.thumb,
    photoUrl: image.links.html,
  }));
