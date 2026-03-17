import { createServerFn } from "@tanstack/react-start";
import * as Unsplash from "unsplash-js";
import type { ImageListOptions } from "~/schemas/ImageListParams";
import type { ImageSearchOptions } from "~/schemas/ImageSearchParams";
import type { TopicPhotosOptions } from "~/schemas/TopicPhotosParams";
import type { ApiResult } from "~/types/ApiResult";
import type { Collection } from "~/types/Collection";
import type { ImageWithPalette } from "~/types/Image";
import type { Topic } from "~/types/Topic";
import { getAccessKey } from "./config";
import { getPhotosWithPalettes } from "./getPhotosWithPalettes";

let unsplashInstance: ReturnType<typeof Unsplash.createApi> | null = null;

const getUnsplashAPI = () => {
  if (!unsplashInstance) {
    unsplashInstance = Unsplash.createApi({
      accessKey: getAccessKey(),
    });
  }
  return unsplashInstance;
};

const RATE_LIMIT_MESSAGE =
  "Rate limit exceeded. Unsplash allows 50 requests/hour for demo apps. Please wait and try again.";

const isRateLimitError = (message: string): boolean =>
  message.toLowerCase().includes("rate limit") ||
  message.includes("403") ||
  message.includes("expected JSON");

const toErrorMessage = (prefix: string, error: unknown): string => {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    message = String((error as { message: unknown }).message);
  } else {
    try {
      message = JSON.stringify(error);
    } catch {
      message = String(error);
    }
  }
  console.error(`[${prefix}]`, message);
  if (isRateLimitError(message)) {
    return RATE_LIMIT_MESSAGE;
  }
  return `Failed to fetch data from Unsplash. Please try again later.`;
};

const apiErrorsToMessage = (prefix: string, errors: string[]): string => {
  const message = errors.join(", ");
  console.error(`[${prefix}] Unsplash API error:`, message);
  if (isRateLimitError(message)) {
    return RATE_LIMIT_MESSAGE;
  }
  return `Unsplash API error: ${message}`;
};

export const searchPhotosByQuery = createServerFn({ method: "GET" })
  .inputValidator((params: ImageSearchOptions) => params)
  .handler(async ({ data }): Promise<ApiResult<ImageWithPalette[]>> => {
    try {
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
        return { data: null, error: apiErrorsToMessage("searchPhotosByQuery", photos.errors ?? ["Unknown error"]) };
      }
      return { data: await getPhotosWithPalettes(photos.response.results), error: null };
    } catch (error) {
      return { data: null, error: toErrorMessage("searchPhotosByQuery", error) };
    }
  });

export const listTopics = createServerFn({ method: "GET" }).handler(
  async (): Promise<ApiResult<Topic[]>> => {
    try {
      const response = await getUnsplashAPI().topics.list({
        orderBy: "featured",
        perPage: 20,
        page: 1,
      });
      if (response.errors || !response.response) {
        return { data: null, error: apiErrorsToMessage("listTopics", response.errors ?? ["Unknown error"]) };
      }
      return {
        data: response.response.results.map((topic) => ({
          slug: topic.slug,
          title: topic.title,
          totalPhotos: topic.total_photos,
          coverUrl: topic.cover_photo?.urls.regular ?? "",
        })),
        error: null,
      };
    } catch (error) {
      return { data: null, error: toErrorMessage("listTopics", error) };
    }
  }
);

export const getTopicPhotos = createServerFn({ method: "GET" })
  .inputValidator((params: TopicPhotosOptions) => params)
  .handler(async ({ data }): Promise<ApiResult<ImageWithPalette[]>> => {
    try {
      const { topicSlug, page = 1, perPage } = data;
      const photos = await getUnsplashAPI().topics.getPhotos({
        topicIdOrSlug: topicSlug,
        page,
        perPage,
      });
      if (photos.errors || !photos.response) {
        return { data: null, error: apiErrorsToMessage("getTopicPhotos", photos.errors ?? ["Unknown error"]) };
      }
      return { data: await getPhotosWithPalettes(photos.response.results), error: null };
    } catch (error) {
      return { data: null, error: toErrorMessage("getTopicPhotos", error) };
    }
  });

export const getPhoto = createServerFn({ method: "GET" })
  .inputValidator((photoId: string) => photoId)
  .handler(async ({ data: photoId }): Promise<ApiResult<ImageWithPalette | null>> => {
    try {
      const response = await getUnsplashAPI().photos.get({ photoId });
      if (response.errors || !response.response) {
        return { data: null, error: apiErrorsToMessage("getPhoto", response.errors ?? ["Unknown error"]) };
      }
      const results = await getPhotosWithPalettes([response.response as any]);
      return { data: results[0] ?? null, error: null };
    } catch (error) {
      return { data: null, error: toErrorMessage("getPhoto", error) };
    }
  });

export const getRandomPhotos = createServerFn({ method: "GET" }).handler(
  async (): Promise<ApiResult<ImageWithPalette[]>> => {
    try {
      const response = await getUnsplashAPI().photos.getRandom({
        count: 20,
        orientation: "squarish",
      });
      if (response.errors || !response.response) {
        return { data: null, error: apiErrorsToMessage("getRandomPhotos", response.errors ?? ["Unknown error"]) };
      }
      const photos = Array.isArray(response.response)
        ? response.response
        : [response.response];
      return { data: await getPhotosWithPalettes(photos as any), error: null };
    } catch (error) {
      return { data: null, error: toErrorMessage("getRandomPhotos", error) };
    }
  }
);

export const getRelatedPhotos = createServerFn({ method: "GET" })
  .inputValidator((photoId: string) => photoId)
  .handler(async ({ data: photoId }): Promise<ApiResult<ImageWithPalette[]>> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/${photoId}/related`,
        { headers: { Authorization: `Client-ID ${getAccessKey()}` } }
      );
      if (!response.ok) {
        const status = response.status;
        if (status === 403) {
          return { data: null, error: "Unsplash API returned 403 Forbidden. You may have hit the rate limit (50 requests/hour for demo apps)." };
        }
        return { data: null, error: `Unsplash API error: ${status} ${response.statusText}` };
      }
      const json = await response.json();
      return { data: await getPhotosWithPalettes(json.results ?? []), error: null };
    } catch (error) {
      return { data: null, error: toErrorMessage("getRelatedPhotos", error) };
    }
  });

export const searchCollectionsByQuery = createServerFn({ method: "GET" })
  .inputValidator((params: { query: string; page?: number; perPage?: number }) => params)
  .handler(async ({ data }): Promise<ApiResult<Collection[]>> => {
    try {
      const { query, page = 1, perPage } = data;
      const response = await getUnsplashAPI().search.getCollections({ query, page, perPage });
      if (response.errors || !response.response) {
        return { data: null, error: apiErrorsToMessage("searchCollectionsByQuery", response.errors ?? ["Unknown error"]) };
      }
      return {
        data: response.response.results.map((collection) => ({
          id: collection.id,
          title: collection.title,
          description: collection.description,
          totalPhotos: collection.total_photos,
          coverUrl: collection.cover_photo?.urls.regular ?? "",
          previewUrls: collection.preview_photos?.map((photo) => photo.urls.thumb) ?? [],
          userName: collection.user.name,
        })),
        error: null,
      };
    } catch (error) {
      return { data: null, error: toErrorMessage("searchCollectionsByQuery", error) };
    }
  });

export const getCollectionPhotos = createServerFn({ method: "GET" })
  .inputValidator((params: { collectionId: string; page?: number; perPage?: number }) => params)
  .handler(async ({ data }): Promise<ApiResult<ImageWithPalette[]>> => {
    try {
      const { collectionId, page = 1, perPage } = data;
      const response = await getUnsplashAPI().collections.getPhotos({ collectionId, page, perPage });
      if (response.errors || !response.response) {
        return { data: null, error: apiErrorsToMessage("getCollectionPhotos", response.errors ?? ["Unknown error"]) };
      }
      return { data: await getPhotosWithPalettes(response.response.results), error: null };
    } catch (error) {
      return { data: null, error: toErrorMessage("getCollectionPhotos", error) };
    }
  });

export const listPhotosByType = createServerFn({ method: "GET" })
  .inputValidator((params: ImageListOptions) => params)
  .handler(async ({ data }): Promise<ApiResult<ImageWithPalette[]>> => {
    try {
      const { perPage, page, type } = data;
      const photos = await getUnsplashAPI().photos.list({
        page,
        perPage,
        orderBy: type,
      });
      if (photos.errors || !photos.response) {
        return { data: null, error: apiErrorsToMessage("listPhotosByType", photos.errors ?? ["Unknown error"]) };
      }
      return { data: await getPhotosWithPalettes(photos.response.results), error: null };
    } catch (error) {
      return { data: null, error: toErrorMessage("listPhotosByType", error) };
    }
  });
