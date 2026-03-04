import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { OrderBy } from "unsplash-js";
import type { UnsplashColor } from "~/schemas/ImageSearchParams";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "./config";
import { searchPhotosByQuery, listPhotosByType, listTopics, getTopicPhotos, getRelatedPhotos, getPhoto, getRandomPhotos, searchCollectionsByQuery, getCollectionPhotos } from "./unsplash";

const FIVE_MINUTES = 1000 * 60 * 5;

const getNextPageParam = (
  lastPage: unknown[],
  _allPages: unknown[],
  lastPageParam: number
) =>
  lastPage.length < AMOUNT_OF_IMAGES_TO_FETCH ? undefined : lastPageParam + 1;

export const searchPhotosInfiniteOptions = (
  query: string,
  color?: UnsplashColor
) =>
  infiniteQueryOptions({
    queryKey: ["photos", "search", "infinite", query, color],
    queryFn: ({ pageParam }) =>
      searchPhotosByQuery({
        data: {
          query,
          page: pageParam,
          perPage: AMOUNT_OF_IMAGES_TO_FETCH,
          color,
        },
      }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const listTopicsOptions = () =>
  queryOptions({
    queryKey: ["topics"],
    queryFn: () => listTopics(),
    staleTime: Infinity,
  });

export const topicPhotosInfiniteOptions = (topicSlug: string) =>
  infiniteQueryOptions({
    queryKey: ["photos", "topic", "infinite", topicSlug],
    queryFn: ({ pageParam }) =>
      getTopicPhotos({
        data: { topicSlug, page: pageParam, perPage: AMOUNT_OF_IMAGES_TO_FETCH },
      }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const randomPhotosQueryOptions = () =>
  queryOptions({
    queryKey: ["photos", "random"],
    queryFn: () => getRandomPhotos(),
    staleTime: FIVE_MINUTES,
  });

export const latestPhotosQueryOptions = () =>
  queryOptions({
    queryKey: ["photos", "latest"],
    queryFn: () => listPhotosByType({ data: { type: "latest", page: 1, perPage: 12 } }),
    staleTime: FIVE_MINUTES,
  });

export const photoQueryOptions = (photoId: string) =>
  queryOptions({
    queryKey: ["photos", "single", photoId],
    queryFn: () => getPhoto({ data: photoId }),
    staleTime: Infinity,
  });

export const relatedPhotosQueryOptions = (photoId: string) =>
  queryOptions({
    queryKey: ["photos", "related", photoId],
    queryFn: () => getRelatedPhotos({ data: photoId }),
    staleTime: Infinity,
  });

export const searchCollectionsInfiniteOptions = (query: string) =>
  infiniteQueryOptions({
    queryKey: ["collections", "search", "infinite", query],
    queryFn: ({ pageParam }) =>
      searchCollectionsByQuery({
        data: { query, page: pageParam, perPage: AMOUNT_OF_IMAGES_TO_FETCH },
      }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const collectionPhotosInfiniteOptions = (collectionId: string) =>
  infiniteQueryOptions({
    queryKey: ["photos", "collection", "infinite", collectionId],
    queryFn: ({ pageParam }) =>
      getCollectionPhotos({
        data: { collectionId, page: pageParam, perPage: AMOUNT_OF_IMAGES_TO_FETCH },
      }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const listPhotosInfiniteOptions = (type: OrderBy) =>
  infiniteQueryOptions({
    queryKey: ["photos", "list", "infinite", type],
    queryFn: ({ pageParam }) =>
      listPhotosByType({
        data: { type, page: pageParam, perPage: AMOUNT_OF_IMAGES_TO_FETCH },
      }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });
