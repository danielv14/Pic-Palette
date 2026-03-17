import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiErrorAlert } from "~/components/ApiErrorAlert";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import type { ApiResult } from "~/types/ApiResult";
import type { ImageWithPalette } from "~/types/Image";

interface InfiniteImageGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryOptions: Parameters<typeof useInfiniteQuery<ApiResult<ImageWithPalette[]>, Error, { pages: ApiResult<ImageWithPalette[]>[] }, any, number>>[0];
  emptyMessage?: string;
}

export const InfiniteImageGrid = ({ queryOptions, emptyMessage = "No images found." }: InfiniteImageGridProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(queryOptions);

  const firstError = data?.pages.find((page) => page.error)?.error;
  const images = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages]
  );

  if (images.length === 0) {
    if (isFetching) return <ImageGridSkeleton />;
    if (firstError) return <ApiErrorAlert message={firstError} />;
    return <NoImagesAlert>{emptyMessage}</NoImagesAlert>;
  }

  return (
    <>
      <ImageGrid>
        {images.map((image, index) => (
          <ImageCard key={image.id} image={image} index={index} />
        ))}
      </ImageGrid>
      {isFetchingNextPage && <ImageGridSkeleton />}
      {hasNextPage && !isFetchingNextPage && (
        <LoadMoreButton onClick={() => fetchNextPage()} />
      )}
    </>
  );
};
