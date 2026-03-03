import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { OrderBy } from "unsplash-js";
import type { UnsplashColor } from "~/schemas/ImageSearchParams";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "./config";
import { searchPhotosByQuery, listPhotosByType, listTopics, getTopicPhotos } from "./unsplash";

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
  });

export const listTopicsOptions = () =>
  queryOptions({
    queryKey: ["topics"],
    queryFn: () => listTopics(),
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
  });
