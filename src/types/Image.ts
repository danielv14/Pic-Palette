export interface UnsplashImage {
  id: string;
  userName: string;
  url: string;
  smallUrl: string;
  thumbnail: string;
  photoUrl: string;
}

export interface ImageWithPalette extends UnsplashImage {
  hexValues: string[];
}
