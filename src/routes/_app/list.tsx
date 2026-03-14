import { createFileRoute, useSearch } from "@tanstack/react-router";
import { OrderBy } from "unsplash-js";
import { z } from "zod";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { InfiniteImageGrid } from "~/components/InfiniteImageGrid";
import { PageHeading } from "~/components/PageHeading";
import { listPhotosInfiniteOptions } from "~/integration/unsplash";

const listValidateSearch = z.object({
  type: z.nativeEnum(OrderBy).default(OrderBy.LATEST),
});

const ListPage = () => {
  const { type } = useSearch({ from: "/_app/list" });

  return (
    <>
      <PageHeading>
        <span className="capitalize">{type}</span> images
      </PageHeading>
      <InfiniteImageGrid
        queryOptions={listPhotosInfiniteOptions(type)}
        emptyMessage="Oh no! Found no images :("
      />
    </>
  );
};

export const Route = createFileRoute("/_app/list")({
  validateSearch: listValidateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureInfiniteQueryData(listPhotosInfiniteOptions(deps.type)),
  pendingComponent: ImageGridSkeleton,
  component: ListPage,
});
