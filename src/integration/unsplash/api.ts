import type { OrderBy } from "unsplash-js";
import type { Basic } from "unsplash-js/dist/methods/photos/types";
import type { ApiResult } from "~/types/ApiResult";
import type { Collection } from "~/types/Collection";
import type { UnsplashImage } from "~/types/Image";
import type { Topic } from "~/types/Topic";
import type { UnsplashClient, UnsplashResponse } from "./client";

export const PAGE_SIZE = 20;

export const UNSPLASH_COLORS = [
  "black_and_white",
  "black",
  "white",
  "yellow",
  "orange",
  "red",
  "purple",
  "magenta",
  "green",
  "teal",
  "blue",
] as const;

export type UnsplashColor = (typeof UNSPLASH_COLORS)[number];

interface PageParams {
  page: number;
  perPage: number;
}

export interface SearchPhotosParams extends PageParams {
  query: string;
  color?: UnsplashColor;
}

export interface ListPhotosParams extends PageParams {
  type: OrderBy;
}

export interface TopicPhotosParams extends PageParams {
  topicSlug: string;
}

export interface SearchCollectionsParams extends PageParams {
  query: string;
}

export interface CollectionPhotosParams extends PageParams {
  collectionId: string;
}

const RATE_LIMIT_MESSAGE =
  "Rate limit exceeded. Unsplash allows 50 requests/hour for demo apps. Please wait and try again.";

// Unsplash answers rate limiting with a 403 whose body is plain text, so the
// client surfaces it either as a 403 status or as a JSON parse failure.
const isRateLimitError = (message: string): boolean =>
  message.toLowerCase().includes("rate limit") ||
  message.includes("403") ||
  message.includes("expected JSON");

const describeError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const callUnsplash = async <TResponse, TData>(
  name: string,
  request: () => Promise<UnsplashResponse<TResponse>>,
  map: (response: TResponse) => TData,
): Promise<ApiResult<TData>> => {
  try {
    const { errors, response } = await request();
    if (errors || response === undefined) {
      const message = (errors ?? ["Unknown error"]).join(", ");
      console.error(`[${name}] Unsplash API error:`, message);
      return {
        data: null,
        error: isRateLimitError(message) ? RATE_LIMIT_MESSAGE : `Unsplash API error: ${message}`,
      };
    }
    return { data: map(response), error: null };
  } catch (error) {
    const message = describeError(error);
    console.error(`[${name}]`, message);
    return {
      data: null,
      error: isRateLimitError(message)
        ? RATE_LIMIT_MESSAGE
        : "Failed to fetch data from Unsplash. Please try again later.",
    };
  }
};

const mapPhoto = (photo: Basic): UnsplashImage => ({
  id: photo.id,
  url: photo.urls.regular,
  smallUrl: photo.urls.small,
  userName: photo.user.username,
  thumbnail: photo.urls.thumb,
  photoUrl: photo.links.html,
});

const mapPhotos = ({ results }: { results: Basic[] }): UnsplashImage[] => results.map(mapPhoto);

export const searchPhotos = (client: UnsplashClient, { query, color, page, perPage }: SearchPhotosParams) =>
  callUnsplash(
    "searchPhotos",
    () =>
      client.search.getPhotos({
        query,
        page,
        perPage,
        orderBy: "relevant",
        contentFilter: "low",
        orientation: "squarish",
        ...(color && { color }),
      }),
    mapPhotos,
  );

export const listPhotos = (client: UnsplashClient, { type, page, perPage }: ListPhotosParams) =>
  callUnsplash("listPhotos", () => client.photos.list({ page, perPage, orderBy: type }), mapPhotos);

export const getTopicPhotos = (client: UnsplashClient, { topicSlug, page, perPage }: TopicPhotosParams) =>
  callUnsplash(
    "getTopicPhotos",
    () => client.topics.getPhotos({ topicIdOrSlug: topicSlug, page, perPage }),
    mapPhotos,
  );

export const getCollectionPhotos = (
  client: UnsplashClient,
  { collectionId, page, perPage }: CollectionPhotosParams,
) =>
  callUnsplash(
    "getCollectionPhotos",
    () => client.collections.getPhotos({ collectionId, page, perPage }),
    mapPhotos,
  );

export const getRelatedPhotos = (client: UnsplashClient, photoId: string) =>
  callUnsplash("getRelatedPhotos", () => client.getRelatedPhotos(photoId), mapPhotos);

export const getPhoto = (client: UnsplashClient, photoId: string) =>
  callUnsplash("getPhoto", () => client.photos.get({ photoId }), mapPhoto);

export const listTopics = (client: UnsplashClient) =>
  callUnsplash(
    "listTopics",
    () => client.topics.list({ orderBy: "featured", perPage: PAGE_SIZE, page: 1 }),
    ({ results }): Topic[] =>
      results.map((topic) => ({
        slug: topic.slug,
        title: topic.title,
        totalPhotos: topic.total_photos,
        coverUrl: topic.cover_photo?.urls.regular ?? "",
      })),
  );

export const searchCollections = (client: UnsplashClient, { query, page, perPage }: SearchCollectionsParams) =>
  callUnsplash(
    "searchCollections",
    () => client.search.getCollections({ query, page, perPage }),
    ({ results }): Collection[] =>
      results.map((collection) => ({
        id: collection.id,
        title: collection.title,
        description: collection.description,
        totalPhotos: collection.total_photos,
        coverUrl: collection.cover_photo?.urls.regular ?? "",
        previewUrls: collection.preview_photos?.map((photo) => photo.urls.thumb) ?? [],
        userName: collection.user.name,
      })),
  );

// A page shorter than PAGE_SIZE is the last one. Unsplash gives no total for
// every endpoint, so this is the only signal shared by all of them.
export const getNextPageParam = (
  lastPage: ApiResult<unknown[]>,
  _allPages: unknown[],
  lastPageParam: number,
): number | undefined =>
  (lastPage.data?.length ?? 0) < PAGE_SIZE ? undefined : lastPageParam + 1;
