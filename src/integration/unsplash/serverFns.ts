import { createServerFn } from "@tanstack/react-start";
import * as api from "./api";
import type {
  CollectionPhotosParams,
  ListPhotosParams,
  SearchCollectionsParams,
  SearchPhotosParams,
  TopicPhotosParams,
} from "./api";
import { getUnsplashClient } from "./client";

export const searchPhotosByQuery = createServerFn({ method: "GET" })
  .inputValidator((params: SearchPhotosParams) => params)
  .handler(({ data }) => api.searchPhotos(getUnsplashClient(), data));

export const listPhotosByType = createServerFn({ method: "GET" })
  .inputValidator((params: ListPhotosParams) => params)
  .handler(({ data }) => api.listPhotos(getUnsplashClient(), data));

export const getTopicPhotos = createServerFn({ method: "GET" })
  .inputValidator((params: TopicPhotosParams) => params)
  .handler(({ data }) => api.getTopicPhotos(getUnsplashClient(), data));

export const getCollectionPhotos = createServerFn({ method: "GET" })
  .inputValidator((params: CollectionPhotosParams) => params)
  .handler(({ data }) => api.getCollectionPhotos(getUnsplashClient(), data));

export const searchCollectionsByQuery = createServerFn({ method: "GET" })
  .inputValidator((params: SearchCollectionsParams) => params)
  .handler(({ data }) => api.searchCollections(getUnsplashClient(), data));

export const getRelatedPhotos = createServerFn({ method: "GET" })
  .inputValidator((photoId: string) => photoId)
  .handler(({ data }) => api.getRelatedPhotos(getUnsplashClient(), data));

export const getPhoto = createServerFn({ method: "GET" })
  .inputValidator((photoId: string) => photoId)
  .handler(({ data }) => api.getPhoto(getUnsplashClient(), data));

export const listTopics = createServerFn({ method: "GET" }).handler(() =>
  api.listTopics(getUnsplashClient()),
);
