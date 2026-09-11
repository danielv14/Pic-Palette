import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { CollectionCard } from "~/components/CollectionCard";
import { ColorFilter } from "~/components/ColorFilter";
import { renderImageCard } from "~/components/ImageCard";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { InfiniteResults } from "~/components/InfiniteResults";
import { PageHeading } from "~/components/PageHeading";
import {
  searchCollectionsInfiniteOptions,
  searchPhotosInfiniteOptions,
  UNSPLASH_COLORS,
  type UnsplashColor,
} from "~/integration/unsplash";
import { SEARCH_TYPES } from "~/types/SearchType";

const validateSearch = z.object({
  query: z.string().default(""),
  color: z.enum(UNSPLASH_COLORS).optional(),
  type: z.enum(SEARCH_TYPES).default("photos"),
});

const PhotoResults = ({ query, color }: { query: string; color?: UnsplashColor }) => {
  const navigate = useNavigate();

  const handleColorChange = (newColor: UnsplashColor | undefined) => {
    navigate({
      to: "/search",
      search: { query, type: "photos", ...(newColor && { color: newColor }) },
    });
  };

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 p-2 md:p-4">
        <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text text-2xl font-extrabold text-transparent font-display md:text-3xl">
          Images of &quot;<span className="italic">{query}</span>&quot;
        </h2>
        <ColorFilter value={color} onChange={handleColorChange} />
      </div>
      <InfiniteResults
        queryOptions={searchPhotosInfiniteOptions(query, color)}
        renderItem={renderImageCard}
        emptyMessage="Found no images. Search for something else."
      />
    </>
  );
};

const CollectionResults = ({ query }: { query: string }) => (
  <>
    <PageHeading>
      Collections for &quot;<span className="italic">{query}</span>&quot;
    </PageHeading>
    <InfiniteResults
      queryOptions={searchCollectionsInfiniteOptions(query)}
      renderItem={(collection) => <CollectionCard key={collection.id} collection={collection} />}
      emptyMessage="Found no collections. Search for something else."
    />
  </>
);

const SearchPage = () => {
  const { query, color, type } = useSearch({ from: "/_app/search" });

  if (type === "collections") {
    return <CollectionResults query={query} />;
  }

  return <PhotoResults query={query} color={color} />;
};

export const Route = createFileRoute("/_app/search")({
  validateSearch,
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
  head: ({ match }) => ({
    meta: [
      {
        title: match.search.query
          ? `${match.search.query} - Pic Palette`
          : "Search - Pic Palette",
      },
    ],
  }),
  pendingComponent: ImageGridSkeleton,
  component: SearchPage,
});
