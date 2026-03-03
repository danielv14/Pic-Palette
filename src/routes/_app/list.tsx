import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { OrderBy } from "unsplash-js";
import { z } from "zod";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import { listPhotosInfiniteOptions } from "~/integration/unsplash";

const listValidateSearch = z.object({
  type: z.nativeEnum(OrderBy).default(OrderBy.POPULAR),
});

const ListPage = () => {
  const { type } = useSearch({ from: "/_app/list" });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(listPhotosInfiniteOptions(type));

  const images = data?.pages.flat() ?? [];

  if (images.length === 0) {
    return <NoImagesAlert>Oh no! Found no images :(</NoImagesAlert>;
  }

  return (
    <>
      <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text p-2 text-center text-2xl font-extrabold text-transparent font-display md:p-4 md:text-start md:text-3xl">
        <span className="capitalize">{type}</span> images
      </h2>
      <ImageGrid>
        {images.map((image, index) => (
          <ImageCard
            key={image.url}
            url={image.url}
            hexValues={image.hexValues}
            userName={image.userName}
            photoUrl={image.photoUrl}
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

export const Route = createFileRoute("/_app/list")({
  validateSearch: listValidateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureInfiniteQueryData(
      listPhotosInfiniteOptions(deps.type)
    ),
  pendingComponent: ImageGridSkeleton,
  component: ListPage,
});
