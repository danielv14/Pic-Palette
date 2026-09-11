import * as Unsplash from "unsplash-js";
import type { Basic } from "unsplash-js/dist/methods/photos/types";

// The shape every endpoint call resolves to. unsplash-js's ApiResponse is
// assignable to it, and so is the hand-rolled related-photos request.
export interface UnsplashResponse<T> {
  errors?: readonly string[];
  response?: T;
}

export interface RelatedPhotosResponse {
  results: Basic[];
}

// unsplash-js has no related-photos method, so the client adds one beside it.
export type UnsplashClient = ReturnType<typeof Unsplash.createApi> & {
  getRelatedPhotos: (photoId: string) => Promise<UnsplashResponse<RelatedPhotosResponse>>;
};

export const createUnsplashClient = (accessKey: string): UnsplashClient => ({
  ...Unsplash.createApi({ accessKey }),
  getRelatedPhotos: async (photoId) => {
    const response = await fetch(`https://api.unsplash.com/photos/${photoId}/related`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    if (!response.ok) {
      return { errors: [`${response.status} ${response.statusText}`] };
    }
    const json = await response.json();
    return { response: { results: json.results ?? [] } };
  },
});

let instance: UnsplashClient | null = null;

export const getUnsplashClient = (): UnsplashClient => {
  if (!instance) {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error("UNSPLASH_ACCESS_KEY is not set. Please add it to your .env.local file.");
    }
    instance = createUnsplashClient(accessKey);
  }
  return instance;
};
