import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { InfiniteImageGrid } from "~/components/InfiniteImageGrid";
import { topicPhotosInfiniteOptions } from "~/integration/unsplash";

const validateSearch = z.object({
  title: z.string().default(""),
});

const TopicPhotosPage = () => {
  const { topicSlug } = Route.useParams();
  const { title } = useSearch({ from: "/_app/topics/$topicSlug" });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 p-2 md:p-4">
        <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text text-2xl font-extrabold text-transparent font-display md:text-3xl">
          {title || topicSlug}
        </h2>
        <Link
          to="/topics"
          className="text-sm font-medium text-brand-400 transition-colors hover:text-brand-300 hover:underline"
        >
          All topics
        </Link>
      </div>
      <InfiniteImageGrid
        queryOptions={topicPhotosInfiniteOptions(topicSlug)}
        emptyMessage="Found no images for this topic."
      />
    </>
  );
};

export const Route = createFileRoute("/_app/topics/$topicSlug")({
  validateSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, params }) =>
    context.queryClient.ensureInfiniteQueryData(
      topicPhotosInfiniteOptions(params.topicSlug)
    ),
  pendingComponent: ImageGridSkeleton,
  component: TopicPhotosPage,
});
