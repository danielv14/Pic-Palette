import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import { topicPhotosInfiniteOptions } from "~/integration/unsplash";

const validateSearch = z.object({
  title: z.string().default(""),
});

const TopicPhotosPage = () => {
  const { topicSlug } = Route.useParams();
  const { title } = useSearch({ from: "/_app/topics/$topicSlug" });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(topicPhotosInfiniteOptions(topicSlug));

  const images = data?.pages.flat() ?? [];

  if (images.length === 0) {
    if (isFetching) return <ImageGridSkeleton />;
    return <NoImagesAlert>Found no images for this topic.</NoImagesAlert>;
  }

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
