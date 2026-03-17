import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { InfiniteImageGrid } from "~/components/InfiniteImageGrid";
import { collectionPhotosInfiniteOptions } from "~/integration/unsplash";

const validateSearch = z.object({
  title: z.string().default(""),
});

const CollectionPhotosPage = () => {
  const { collectionId } = Route.useParams();
  const { title } = useSearch({ from: "/_app/collections/$collectionId" });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 p-2 md:p-4">
        <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text text-2xl font-extrabold text-transparent font-display md:text-3xl">
          {title || "Collection"}
        </h2>
        <Link
          to="/search"
          search={{ query: title, type: "collections" }}
          className="text-sm font-medium text-brand-400 transition-colors hover:text-brand-300 hover:underline"
        >
          Back to results
        </Link>
      </div>
      <InfiniteImageGrid
        queryOptions={collectionPhotosInfiniteOptions(collectionId)}
        emptyMessage="Found no photos in this collection."
      />
    </>
  );
};

export const Route = createFileRoute("/_app/collections/$collectionId")({
  validateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, params }) =>
    context.queryClient.prefetchInfiniteQuery(
      collectionPhotosInfiniteOptions(params.collectionId)
    ),
  pendingComponent: ImageGridSkeleton,
  component: CollectionPhotosPage,
});
