import { createFileRoute, useSearch } from "@tanstack/react-router";
import { OrderBy } from "unsplash-js";
import { z } from "zod";
import { renderImageCard } from "~/components/ImageCard";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { InfiniteResults } from "~/components/InfiniteResults";
import { PageHeading } from "~/components/PageHeading";
import { listPhotosInfiniteOptions } from "~/integration/unsplash";

const validateSearch = z.object({
  type: z.nativeEnum(OrderBy).default(OrderBy.LATEST),
});

const ListPage = () => {
  const { type } = useSearch({ from: "/_app/list" });

  return (
    <>
      <PageHeading>
        <span className="capitalize">{type}</span> images
      </PageHeading>
      <InfiniteResults
        queryOptions={listPhotosInfiniteOptions(type)}
        renderItem={renderImageCard}
        emptyMessage="Oh no! Found no images :("
      />
    </>
  );
};

export const Route = createFileRoute("/_app/list")({
  validateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureInfiniteQueryData(listPhotosInfiniteOptions(deps.type)),
  head: ({ match }) => ({
    meta: [
      {
        title: `${match.search.type.charAt(0).toUpperCase() + match.search.type.slice(1)} images - Pic Palette`,
      },
    ],
  }),
  pendingComponent: ImageGridSkeleton,
  component: ListPage,
});
