import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { ColorFilter } from "~/components/ColorFilter";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import { searchPhotosInfiniteOptions } from "~/integration/unsplash";
import { UNSPLASH_COLORS, type UnsplashColor } from "~/schemas/ImageSearchParams";

const searchValidateSearch = z.object({
  query: z.string().default(""),
  color: z.enum(UNSPLASH_COLORS).optional(),
});

const SearchPage = () => {
  const { query, color } = useSearch({ from: "/_app/search" });
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(searchPhotosInfiniteOptions(query, color));

  const images = data?.pages.flat() ?? [];

  const handleColorChange = (newColor: UnsplashColor | undefined) => {
    navigate({
      to: "/search",
      search: { query, ...(newColor && { color: newColor }) },
    });
  };

  if (images.length === 0) {
    if (isFetching) return <ImageGridSkeleton />;
    return (
      <NoImagesAlert>Found no images. Search for something else.</NoImagesAlert>
    );
  }

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 p-2 md:p-4">
        <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text text-2xl font-extrabold text-transparent font-display md:text-3xl">
          Images of &quot;
          <span className="italic">{query}</span>
          &quot;
        </h2>
        <ColorFilter value={color} onChange={handleColorChange} />
      </div>
      <ImageGrid>
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            id={image.id}
            url={image.url}
            smallUrl={image.smallUrl}
            thumbnail={image.thumbnail}
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

export const Route = createFileRoute("/_app/search")({
  validateSearch: searchValidateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureInfiniteQueryData(
      searchPhotosInfiniteOptions(deps.query, deps.color)
    ),
  pendingComponent: ImageGridSkeleton,
  component: SearchPage,
});
