import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { PageHeading } from "~/components/PageHeading";
import { latestPhotosQueryOptions } from "~/integration/unsplash";

const HomePage = () => {
  const { data: photos = [] } = useQuery(latestPhotosQueryOptions());

  if (photos.length === 0) return <ImageGridSkeleton />;

  return (
    <>
      <PageHeading>Latest photos</PageHeading>
      <ImageGrid>
        {photos.map((photo, index) => (
          <ImageCard key={photo.id} image={photo} index={index} />
        ))}
      </ImageGrid>
      <div className="mt-6 mb-6 flex justify-center">
        <Link
          to="/list"
          search={{ type: "latest" }}
          className="rounded-full border border-brand-500/40 bg-brand-500/10 px-8 py-3 font-body text-sm font-medium text-brand-300 backdrop-blur-sm transition-all duration-200 hover:bg-brand-500/20 hover:shadow-lg hover:shadow-brand-500/15"
        >
          See all latest photos
        </Link>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_app/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(latestPhotosQueryOptions()),
  pendingComponent: ImageGridSkeleton,
  component: HomePage,
});
