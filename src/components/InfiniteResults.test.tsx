import { infiniteQueryOptions, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { InfiniteResults } from "./InfiniteResults";
import { getNextPageParam, PAGE_SIZE } from "~/integration/unsplash/api";
import type { ApiResult } from "~/types/ApiResult";

type Page = ApiResult<string[]>;

const fullPage = (pageNumber: number): Page => ({
  data: Array.from({ length: PAGE_SIZE }, (_, index) => `item-${pageNumber}-${index}`),
  error: null,
});

const renderResults = (queryFn: (pageParam: number) => Promise<Page>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const options = infiniteQueryOptions({
    queryKey: ["test", Math.random()],
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: 1,
    getNextPageParam,
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <InfiniteResults
        queryOptions={options}
        renderItem={(item) => <span key={item}>{item}</span>}
        emptyMessage="Nothing here"
      />
    </QueryClientProvider>,
  );
};

describe("InfiniteResults", () => {
  afterEach(cleanup);

  it("shows the skeleton while the first page loads", () => {
    renderResults(() => new Promise(() => {}));
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("shows the error when the first page fails", async () => {
    renderResults(async () => ({ data: null, error: "Rate limit exceeded" }));
    await screen.findByText("Rate limit exceeded");
  });

  it("shows the empty message for an empty first page", async () => {
    renderResults(async () => ({ data: [], error: null }));
    await screen.findByText("Nothing here");
  });

  it("renders items and loads the next page on demand", async () => {
    let resolveSecondPage: (page: Page) => void = () => {};
    renderResults((pageParam) =>
      pageParam === 1
        ? Promise.resolve(fullPage(1))
        : new Promise<Page>((resolve) => {
            resolveSecondPage = resolve;
          }),
    );

    await screen.findByText("item-1-0");
    const loadMore = screen.getByRole("button", { name: "Load more" });

    act(() => loadMore.click());

    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy());
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();

    act(() => resolveSecondPage({ data: ["last-one"], error: null }));

    await screen.findByText("last-one");
    expect(screen.getByText("item-1-0")).toBeTruthy();
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("hides the load more button after a short page", async () => {
    renderResults(async () => ({ data: ["only"], error: null }));
    await screen.findByText("only");
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });
});
