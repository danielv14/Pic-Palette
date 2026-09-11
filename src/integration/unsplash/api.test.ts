import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Basic } from "unsplash-js/dist/methods/photos/types";
import { getNextPageParam, getRelatedPhotos, listTopics, PAGE_SIZE, searchPhotos } from "./api";
import type { UnsplashClient } from "./client";

const basicPhoto = {
  id: "abc",
  urls: { regular: "regular.jpg", small: "small.jpg", thumb: "thumb.jpg" },
  user: { username: "ansel" },
  links: { html: "https://unsplash.com/photos/abc" },
} as unknown as Basic;

const clientWith = (overrides: object) => overrides as unknown as UnsplashClient;

const searchParams = { query: "cats", page: 1, perPage: PAGE_SIZE };

describe("Unsplash api", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps a successful response to app images", async () => {
    const client = clientWith({
      search: { getPhotos: async () => ({ response: { results: [basicPhoto] } }) },
    });

    const result = await searchPhotos(client, searchParams);

    expect(result).toEqual({
      data: [
        {
          id: "abc",
          url: "regular.jpg",
          smallUrl: "small.jpg",
          thumbnail: "thumb.jpg",
          userName: "ansel",
          photoUrl: "https://unsplash.com/photos/abc",
        },
      ],
      error: null,
    });
  });

  it("forwards the query, page and color to the client", async () => {
    const getPhotos = vi.fn(async () => ({ response: { results: [] } }));
    const client = clientWith({ search: { getPhotos } });

    await searchPhotos(client, { ...searchParams, page: 3, color: "teal" });

    expect(getPhotos).toHaveBeenCalledWith(
      expect.objectContaining({ query: "cats", page: 3, perPage: PAGE_SIZE, color: "teal" }),
    );
  });

  it("turns a 403 in the errors array into the rate limit message", async () => {
    const client = clientWith({
      search: { getPhotos: async () => ({ errors: ["403 Forbidden"] }) },
    });

    const result = await searchPhotos(client, searchParams);

    expect(result.data).toBeNull();
    expect(result.error).toMatch(/rate limit exceeded/i);
  });

  it("passes other API errors through with their text", async () => {
    const client = clientWith({
      topics: { list: async () => ({ errors: ["Invalid order_by"] }) },
    });

    const result = await listTopics(client);

    expect(result).toEqual({ data: null, error: "Unsplash API error: Invalid order_by" });
  });

  it("treats a JSON parse failure from a thrown error as a rate limit", async () => {
    const client = clientWith({
      search: {
        getPhotos: async () => {
          throw new Error("expected JSON response from server.");
        },
      },
    });

    const result = await searchPhotos(client, searchParams);

    expect(result.error).toMatch(/rate limit exceeded/i);
  });

  it("hides other thrown errors behind a generic message", async () => {
    const client = clientWith({
      search: {
        getPhotos: async () => {
          throw new Error("socket hang up");
        },
      },
    });

    const result = await searchPhotos(client, searchParams);

    expect(result).toEqual({
      data: null,
      error: "Failed to fetch data from Unsplash. Please try again later.",
    });
  });

  it("runs related photos through the same error path", async () => {
    const client = clientWith({
      getRelatedPhotos: async () => ({ errors: ["403 Forbidden"] }),
    });

    const result = await getRelatedPhotos(client, "abc");

    expect(result.error).toMatch(/rate limit exceeded/i);
  });
});

describe("getNextPageParam", () => {
  const page = (count: number) => ({ data: Array.from({ length: count }), error: null });

  it("requests the next page after a full page", () => {
    expect(getNextPageParam(page(PAGE_SIZE), [], 1)).toBe(2);
  });

  it("stops after a short page", () => {
    expect(getNextPageParam(page(PAGE_SIZE - 1), [], 4)).toBeUndefined();
  });

  it("stops after an error page", () => {
    expect(getNextPageParam({ data: null, error: "nope" }, [], 1)).toBeUndefined();
  });
});
