import { createServerFn } from "@tanstack/react-start";
import * as Unsplash from "unsplash-js";
import type { ImageListOptions } from "~/schemas/ImageListParams";
import type { ImageSearchOptions } from "~/schemas/ImageSearchParams";
import type { TopicPhotosOptions } from "~/schemas/TopicPhotosParams";
import type { Collection } from "~/types/Collection";
import type { ImageWithPalette } from "~/types/Image";
import type { Topic } from "~/types/Topic";
import { getAccessKey } from "./config";
import { getPhotosWithPalettes } from "./getPhotosWithPalettes";

const getUnsplashAPI = () =>
  Unsplash.createApi({
    accessKey: getAccessKey(),
  });

export const searchPhotosByQuery = createServerFn({ method: "GET" })
  .inputValidator((params: ImageSearchOptions) => params)
  .handler(async ({ data }): Promise<ImageWithPalette[]> => {
    const { query, page = 1, perPage, color } = data;
    const photos = await getUnsplashAPI().search.getPhotos({
      query,
      page,
      perPage,
      orderBy: "relevant",
      contentFilter: "low",
      orientation: "squarish",
      ...(color && { color }),
    });
    if (photos.errors || !photos.response) {
      console.error("[searchPhotosByQuery] Unsplash API error:", photos.errors);
      return [];
    }
    return getPhotosWithPalettes(photos.response.results);
  });

export const listTopics = createServerFn({ method: "GET" }).handler(
  async (): Promise<Topic[]> => {
    const response = await getUnsplashAPI().topics.list({
      orderBy: "featured",
      perPage: 20,
      page: 1,
    });
    if (response.errors || !response.response) {
      console.error("[listTopics] Unsplash API error:", response.errors);
      return [];
    }
    return response.response.results.map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      totalPhotos: topic.total_photos,
      coverUrl: topic.cover_photo?.urls.regular ?? "",
    }));
  }
);

export const getTopicPhotos = createServerFn({ method: "GET" })
  .inputValidator((params: TopicPhotosOptions) => params)
  .handler(async ({ data }): Promise<ImageWithPalette[]> => {
    const { topicSlug, page = 1, perPage } = data;
    const photos = await getUnsplashAPI().topics.getPhotos({
      topicIdOrSlug: topicSlug,
      page,
      perPage,
    });
    if (photos.errors || !photos.response) {
      console.error("[getTopicPhotos] Unsplash API error:", photos.errors);
      return [];
    }
    return getPhotosWithPalettes(photos.response.results);
  });

export const getPhoto = createServerFn({ method: "GET" })
  .inputValidator((photoId: string) => photoId)
  .handler(async ({ data: photoId }): Promise<ImageWithPalette | null> => {
    const response = await getUnsplashAPI().photos.get({ photoId });
    if (response.errors || !response.response) {
      console.error("[getPhoto] Unsplash API error:", response.errors);
      return null;
    }
    const results = await getPhotosWithPalettes([response.response as any]);
    return results[0] ?? null;
  });

export const getRandomPhotos = createServerFn({ method: "GET" }).handler(
  async (): Promise<ImageWithPalette[]> => {
    const response = await getUnsplashAPI().photos.getRandom({
      count: 20,
      orientation: "squarish",
    });
    if (response.errors || !response.response) {
      console.error("[getRandomPhotos] Unsplash API error:", response.errors);
      return [];
    }
    const photos = Array.isArray(response.response)
      ? response.response
      : [response.response];
    return getPhotosWithPalettes(photos as any);
  }
);

export const getRelatedPhotos = createServerFn({ method: "GET" })
  .inputValidator((photoId: string) => photoId)
  .handler(async ({ data: photoId }): Promise<ImageWithPalette[]> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/${photoId}/related`,
        { headers: { Authorization: `Client-ID ${getAccessKey()}` } }
      );
      if (!response.ok) {
        console.error(`[getRelatedPhotos] Fetch failed with status ${response.status}: ${response.statusText}`);
        return [];
      }
      const json = await response.json();
      return getPhotosWithPalettes(json.results ?? []);
    } catch (fetchError) {
      console.error("[getRelatedPhotos] Fetch error:", fetchError);
      return [];
    }
  });

export const searchCollectionsByQuery = createServerFn({ method: "GET" })
  .inputValidator((params: { query: string; page?: number; perPage?: number }) => params)
  .handler(async ({ data }): Promise<Collection[]> => {
    const { query, page = 1, perPage } = data;
    const response = await getUnsplashAPI().search.getCollections({ query, page, perPage });
    if (response.errors || !response.response) {
      console.error("[searchCollectionsByQuery] Unsplash API error:", response.errors);
      return [];
    }
    return response.response.results.map((collection) => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      totalPhotos: collection.total_photos,
      coverUrl: collection.cover_photo?.urls.regular ?? "",
      previewUrls: collection.preview_photos?.map((photo) => photo.urls.thumb) ?? [],
      userName: collection.user.name,
    }));
  });

export const getCollectionPhotos = createServerFn({ method: "GET" })
  .inputValidator((params: { collectionId: string; page?: number; perPage?: number }) => params)
  .handler(async ({ data }): Promise<ImageWithPalette[]> => {
    const { collectionId, page = 1, perPage } = data;
    const response = await getUnsplashAPI().collections.getPhotos({ collectionId, page, perPage });
    if (response.errors || !response.response) {
      console.error("[getCollectionPhotos] Unsplash API error:", response.errors);
      return [];
    }
    return getPhotosWithPalettes(response.response.results);
  });

export const listPhotosByType = createServerFn({ method: "GET" })
  .inputValidator((params: ImageListOptions) => params)
  .handler(async ({ data }): Promise<ImageWithPalette[]> => {
    const { perPage, page, type } = data;
    const photos = await getUnsplashAPI().photos.list({
      page,
      perPage,
      orderBy: type,
    });
    if (photos.errors || !photos.response) {
      console.error("[listPhotosByType] Unsplash API error:", photos.errors);
      return [];
    }
    return getPhotosWithPalettes(photos.response.results);
  });
