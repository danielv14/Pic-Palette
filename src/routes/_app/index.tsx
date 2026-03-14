import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { PageHeading } from "~/components/PageHeading";
import { pillClasses } from "~/components/PillButton";
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
          className={pillClasses}
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
