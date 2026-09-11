import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ApiErrorAlert } from "~/components/ApiErrorAlert";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import type { ApiResult } from "~/types/ApiResult";

interface InfiniteResultsProps<TItem, TQueryKey extends QueryKey> {
  queryOptions: UseInfiniteQueryOptions<
    ApiResult<TItem[]>,
    Error,
    InfiniteData<ApiResult<TItem[]>>,
    TQueryKey,
    number
  >;
  renderItem: (item: TItem, index: number) => ReactNode;
  emptyMessage: string;
}

export const InfiniteResults = <TItem, TQueryKey extends QueryKey>({
  queryOptions,
  renderItem,
  emptyMessage,
}: InfiniteResultsProps<TItem, TQueryKey>) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(queryOptions);

  const pages = data?.pages ?? [];
  const items = pages.flatMap((page) => page.data ?? []);
  const firstError = pages.find((page) => page.error)?.error ?? null;

  if (items.length === 0) {
    if (isFetching) return <ImageGridSkeleton />;
    if (firstError) return <ApiErrorAlert message={firstError} />;
    return <NoImagesAlert>{emptyMessage}</NoImagesAlert>;
  }

  return (
    <>
      <ImageGrid>{items.map(renderItem)}</ImageGrid>
      {isFetchingNextPage && <ImageGridSkeleton />}
      {hasNextPage && !isFetchingNextPage && <LoadMoreButton onClick={() => fetchNextPage()} />}
    </>
  );
};
