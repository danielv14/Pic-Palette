import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ApiErrorAlert } from "~/components/ApiErrorAlert";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { PageHeading } from "~/components/PageHeading";
import { PillLink } from "~/components/PillLink";
import { latestPhotosQueryOptions } from "~/integration/unsplash";

const HomePage = () => {
  const { data: result } = useQuery(latestPhotosQueryOptions());

  if (!result) return <ImageGridSkeleton />;
  if (result.error) return <ApiErrorAlert message={result.error} />;

  const photos = result.data;

  if (photos.length === 0) return <ImageGridSkeleton />;

  return (
    <>
      <PageHeading>Latest photos</PageHeading>
      <ImageGrid>
        {photos.map((photo, index) => (
          <ImageCard key={photo.id} image={photo} index={index} />
        ))}
      </ImageGrid>
      <PillLink to="/list" search={{ type: "latest" }}>
        See all latest photos
      </PillLink>
    </>
  );
};

export const Route = createFileRoute("/_app/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(latestPhotosQueryOptions()),
  pendingComponent: ImageGridSkeleton,
  component: HomePage,
});
