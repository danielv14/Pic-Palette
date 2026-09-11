import { describe, expect, it } from "vitest";
import { createFavoritesStore } from "./useFavorites";
import type { UnsplashImage } from "~/types/Image";

const image = (id: string): UnsplashImage => ({
  id,
  userName: "ansel",
  url: `${id}.jpg`,
  smallUrl: `${id}-small.jpg`,
  thumbnail: `${id}-thumb.jpg`,
  photoUrl: `https://unsplash.com/photos/${id}`,
});

const memoryStorage = (initial: Record<string, string> = {}) => {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    dump: () => Object.fromEntries(map),
  };
};

describe("createFavoritesStore", () => {
  it("starts from what the storage holds", () => {
    const storage = memoryStorage({ "pic-palette-favorites": JSON.stringify([image("a")]) });
    expect(createFavoritesStore(storage).getSnapshot()).toEqual([image("a")]);
  });

  it("starts empty when storage holds garbage or nothing", () => {
    expect(createFavoritesStore(memoryStorage({ "pic-palette-favorites": "{not json" })).getSnapshot()).toEqual([]);
    expect(createFavoritesStore(null).getSnapshot()).toEqual([]);
  });

  it("adds newest first, removes on second toggle, and persists", () => {
    const storage = memoryStorage();
    const store = createFavoritesStore(storage);

    store.toggle(image("a"));
    store.toggle(image("b"));
    expect(store.getSnapshot().map((favorite) => favorite.id)).toEqual(["b", "a"]);

    store.toggle(image("a"));
    expect(store.getSnapshot().map((favorite) => favorite.id)).toEqual(["b"]);
    expect(JSON.parse(storage.dump()["pic-palette-favorites"])).toEqual([image("b")]);
  });

  it("notifies subscribers on toggle and stops after unsubscribe", () => {
    const store = createFavoritesStore(null);
    let calls = 0;
    const unsubscribe = store.subscribe(() => {
      calls += 1;
    });

    store.toggle(image("a"));
    unsubscribe();
    store.toggle(image("b"));

    expect(calls).toBe(1);
  });

  it("returns a stable empty snapshot for the server", () => {
    const store = createFavoritesStore(null);
    expect(store.getServerSnapshot()).toBe(store.getServerSnapshot());
  });
});
