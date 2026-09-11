import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { OrderBy } from "unsplash-js";
import { getNextPageParam, PAGE_SIZE, type UnsplashColor } from "./api";
import {
  getCollectionPhotos,
  getPhoto,
  getRelatedPhotos,
  getTopicPhotos,
  listPhotosByType,
  listTopics,
  searchCollectionsByQuery,
  searchPhotosByQuery,
} from "./serverFns";

const FIVE_MINUTES = 1000 * 60 * 5;

export const searchPhotosInfiniteOptions = (query: string, color?: UnsplashColor) =>
  infiniteQueryOptions({
    queryKey: ["photos", "search", "infinite", query, color],
    queryFn: ({ pageParam }) =>
      searchPhotosByQuery({ data: { query, color, page: pageParam, perPage: PAGE_SIZE } }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const listPhotosInfiniteOptions = (type: OrderBy) =>
  infiniteQueryOptions({
    queryKey: ["photos", "list", "infinite", type],
    queryFn: ({ pageParam }) =>
      listPhotosByType({ data: { type, page: pageParam, perPage: PAGE_SIZE } }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const topicPhotosInfiniteOptions = (topicSlug: string) =>
  infiniteQueryOptions({
    queryKey: ["photos", "topic", "infinite", topicSlug],
    queryFn: ({ pageParam }) =>
      getTopicPhotos({ data: { topicSlug, page: pageParam, perPage: PAGE_SIZE } }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const collectionPhotosInfiniteOptions = (collectionId: string) =>
  infiniteQueryOptions({
    queryKey: ["photos", "collection", "infinite", collectionId],
    queryFn: ({ pageParam }) =>
      getCollectionPhotos({ data: { collectionId, page: pageParam, perPage: PAGE_SIZE } }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const searchCollectionsInfiniteOptions = (query: string) =>
  infiniteQueryOptions({
    queryKey: ["collections", "search", "infinite", query],
    queryFn: ({ pageParam }) =>
      searchCollectionsByQuery({ data: { query, page: pageParam, perPage: PAGE_SIZE } }),
    initialPageParam: 1,
    getNextPageParam,
    staleTime: FIVE_MINUTES,
  });

export const latestPhotosQueryOptions = () =>
  queryOptions({
    queryKey: ["photos", "latest"],
    queryFn: () => listPhotosByType({ data: { type: OrderBy.LATEST, page: 1, perPage: 12 } }),
    staleTime: FIVE_MINUTES,
  });

export const listTopicsOptions = () =>
  queryOptions({
    queryKey: ["topics"],
    queryFn: () => listTopics(),
    staleTime: Infinity,
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
