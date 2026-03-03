import { useSyncExternalStore } from "react";
import type { ImageWithPalette } from "~/types/Image";

const STORAGE_KEY = "pic-palette-favorites";

const readFromStorage = (): ImageWithPalette[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeToStorage = (favorites: ImageWithPalette[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // storage not available
  }
};

// Shared in-memory store - all hook instances share the same state
type Listener = () => void;
let currentFavorites: ImageWithPalette[] = [];
const listeners = new Set<Listener>();

const notifyListeners = () => listeners.forEach((listener) => listener());

const store = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => currentFavorites,
  getServerSnapshot: (): ImageWithPalette[] => [],
  initialize: () => {
    currentFavorites = readFromStorage();
    notifyListeners();
  },
  toggle: (image: ImageWithPalette) => {
    const alreadyFavorited = currentFavorites.some((f) => f.id === image.id);
    currentFavorites = alreadyFavorited
      ? currentFavorites.filter((f) => f.id !== image.id)
      : [image, ...currentFavorites];
    writeToStorage(currentFavorites);
    notifyListeners();
  },
};

// Initialize once when module loads (client-side only)
if (typeof window !== "undefined") {
  store.initialize();
}

export const useFavorites = () => {
  const favorites = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const toggleFavorite = (image: ImageWithPalette) => store.toggle(image);
  const isFavorite = (imageId: string) => favorites.some((f) => f.id === imageId);

  return { favorites, toggleFavorite, isFavorite };
};
