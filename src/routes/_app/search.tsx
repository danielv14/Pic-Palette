import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import { searchPhotosInfiniteOptions } from "~/integration/unsplash";

const searchValidateSearch = z.object({
  query: z.string().default(""),
});

const SearchPage = () => {
  const { query } = useSearch({ from: "/_app/search" });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(searchPhotosInfiniteOptions(query));

  const images = data?.pages.flat() ?? [];

  if (images.length === 0) {
    return (
      <NoImagesAlert>Found no images. Search for something else.</NoImagesAlert>
    );
  }

  return (
    <>
      <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text p-2 text-center text-2xl font-extrabold text-transparent font-display md:p-4 md:text-start md:text-3xl">
        Images of &quot;
        <span className="italic">{query}</span>
        &quot;
      </h2>
      <ImageGrid>
        {images.map((image, index) => (
          <ImageCard
            key={image.url}
            url={image.url}
            hexValues={image.hexValues}
            userName={image.userName}
            index={index}
          />
        ))}
      </ImageGrid>
      {isFetchingNextPage && <ImageGridSkeleton />}
      {hasNextPage && !isFetchingNextPage && (
        <LoadMoreButton onClick={() => fetchNextPage()} />
      )}
    </>
  );
};

export const Route = createFileRoute("/_app/search")({
  validateSearch: searchValidateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureInfiniteQueryData(
      searchPhotosInfiniteOptions(deps.query)
    ),
  pendingComponent: ImageGridSkeleton,
  component: SearchPage,
});
