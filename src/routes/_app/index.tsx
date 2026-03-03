import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { ImageGridSkeleton } from "~/components/ImageGridSkeleton";
import { latestPhotosQueryOptions } from "~/integration/unsplash";

const HomePage = () => {
  const { data: photos = [] } = useQuery(latestPhotosQueryOptions());

  if (photos.length === 0) return <ImageGridSkeleton />;

  return (
    <>
      <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text p-2 text-center text-2xl font-extrabold text-transparent font-display md:p-4 md:text-start md:text-3xl">
        Latest photos
      </h2>
      <ImageGrid>
        {photos.map((photo, index) => (
          <ImageCard
            key={photo.id}
            id={photo.id}
            url={photo.url}
            smallUrl={photo.smallUrl}
            thumbnail={photo.thumbnail}
            hexValues={photo.hexValues}
            userName={photo.userName}
            photoUrl={photo.photoUrl}
            index={index}
          />
        ))}
      </ImageGrid>
    </>
  );
};

export const Route = createFileRoute("/_app/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(latestPhotosQueryOptions()),
  pendingComponent: ImageGridSkeleton,
  component: HomePage,
});
