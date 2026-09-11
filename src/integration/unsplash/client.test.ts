import { afterEach, describe, expect, it, vi } from "vitest";
import { createUnsplashClient } from "./client";

describe("createUnsplashClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the access key and returns related photos as a response", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ results: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await createUnsplashClient("key123").getRelatedPhotos("abc");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.unsplash.com/photos/abc/related",
      expect.objectContaining({ headers: { Authorization: "Client-ID key123" } }),
    );
    expect(result).toEqual({ response: { results: [] } });
  });

  it("falls back to an empty result list when the body has none", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));

    const result = await createUnsplashClient("key123").getRelatedPhotos("abc");

    expect(result).toEqual({ response: { results: [] } });
  });

  it("reports a non-ok status in the errors array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("Rate Limit Exceeded", { status: 403, statusText: "Forbidden" })),
    );

    const result = await createUnsplashClient("key123").getRelatedPhotos("abc");

    expect(result).toEqual({ errors: ["403 Forbidden"] });
  });
});
