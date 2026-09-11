import { useMemo, useSyncExternalStore } from "react";
import type { UnsplashImage } from "~/types/Image";

const STORAGE_KEY = "pic-palette-favorites";
const EMPTY: UnsplashImage[] = [];

type FavoritesStorage = Pick<Storage, "getItem" | "setItem">;

export const createFavoritesStore = (storage: FavoritesStorage | null) => {
  const read = (): UnsplashImage[] => {
    try {
      const raw = storage?.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : EMPTY;
    } catch {
      return EMPTY;
    }
  };

  const write = (favorites: UnsplashImage[]) => {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // storage not available
    }
  };

  let favorites = read();
  const listeners = new Set<() => void>();

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => favorites,
    getServerSnapshot: () => EMPTY,
    toggle: (image: UnsplashImage) => {
      const alreadyFavorited = favorites.some((favorite) => favorite.id === image.id);
      favorites = alreadyFavorited
        ? favorites.filter((favorite) => favorite.id !== image.id)
        : [image, ...favorites];
      write(favorites);
      listeners.forEach((listener) => listener());
    },
  };
};

// Reading window.localStorage itself throws when the browser blocks site data,
// so the access has to be guarded, not only the reads and writes.
const browserStorage = (): FavoritesStorage | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
};

const favoritesStore = createFavoritesStore(browserStorage());

export const useFavorites = () => {
  const favorites = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );

  const favoriteIds = useMemo(() => new Set(favorites.map((favorite) => favorite.id)), [favorites]);

  const toggleFavorite = (image: UnsplashImage) => favoritesStore.toggle(image);
  const isFavorite = (imageId: string) => favoriteIds.has(imageId);

  return { favorites, toggleFavorite, isFavorite };
};
