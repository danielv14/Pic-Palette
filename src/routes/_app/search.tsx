import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { CollectionCard } from "~/components/CollectionCard";
import { ColorFilter } from "~/components/ColorFilter";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import { searchCollectionsInfiniteOptions, searchPhotosInfiniteOptions } from "~/integration/unsplash";
import { UNSPLASH_COLORS, type UnsplashColor } from "~/schemas/ImageSearchParams";
import { SEARCH_TYPES } from "~/components/Searchbar";

const searchValidateSearch = z.object({
  query: z.string().default(""),
  color: z.enum(UNSPLASH_COLORS).optional(),
  type: z.enum(SEARCH_TYPES).default("photos"),
});

const PhotoResults = ({ query, color }: { query: string; color?: UnsplashColor }) => {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(searchPhotosInfiniteOptions(query, color));

  const images = data?.pages.flat() ?? [];

  const handleColorChange = (newColor: UnsplashColor | undefined) => {
    navigate({
      to: "/search",
      search: { query, type: "photos", ...(newColor && { color: newColor }) },
    });
  };

  if (images.length === 0) {
    if (isFetching) return <ImageGridSkeleton />;
    return <NoImagesAlert>Found no images. Search for something else.</NoImagesAlert>;
  }

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 p-2 md:p-4">
        <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text text-2xl font-extrabold text-transparent font-display md:text-3xl">
          Images of &quot;<span className="italic">{query}</span>&quot;
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

const CollectionResults = ({ query }: { query: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(searchCollectionsInfiniteOptions(query));

  const collections = data?.pages.flat() ?? [];

  if (collections.length === 0) {
    if (isFetching) return <ImageGridSkeleton />;
    return <NoImagesAlert>Found no collections. Search for something else.</NoImagesAlert>;
  }

  return (
    <>
      <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text p-2 text-2xl font-extrabold text-transparent font-display md:p-4 md:text-3xl">
        Collections for &quot;<span className="italic">{query}</span>&quot;
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
      {isFetchingNextPage && <ImageGridSkeleton />}
      {hasNextPage && !isFetchingNextPage && (
        <LoadMoreButton onClick={() => fetchNextPage()} />
      )}
    </>
  );
};

const SearchPage = () => {
  const { query, color, type } = useSearch({ from: "/_app/search" });

  if (type === "collections") {
    return <CollectionResults query={query} />;
  }

  return <PhotoResults query={query} color={color} />;
};

export const Route = createFileRoute("/_app/search")({
  validateSearch: searchValidateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    if (deps.type === "collections") {
      return context.queryClient.ensureInfiniteQueryData(
        searchCollectionsInfiniteOptions(deps.query)
      );
    }
    return context.queryClient.ensureInfiniteQueryData(
      searchPhotosInfiniteOptions(deps.query, deps.color)
    );
  },
  pendingComponent: ImageGridSkeleton,
  component: SearchPage,
});
