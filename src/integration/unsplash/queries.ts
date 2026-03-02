import { infiniteQueryOptions } from "@tanstack/react-query";
import type { OrderBy } from "unsplash-js";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "./config";
import { searchPhotosByQuery, listPhotosByType } from "./unsplash";

const getNextPageParam = (
  lastPage: unknown[],
  _allPages: unknown[],
  lastPageParam: number
) =>
  lastPage.length < AMOUNT_OF_IMAGES_TO_FETCH ? undefined : lastPageParam + 1;

export const searchPhotosInfiniteOptions = (query: string) =>
  infiniteQueryOptions({
    queryKey: ["photos", "search", "infinite", query],
    queryFn: ({ pageParam }) =>
      searchPhotosByQuery({
        data: { query, page: pageParam, perPage: AMOUNT_OF_IMAGES_TO_FETCH },
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
