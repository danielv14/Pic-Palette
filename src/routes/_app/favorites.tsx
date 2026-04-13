import { createFileRoute } from "@tanstack/react-router";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { NoImagesAlert } from "~/components/NoImagesAlert";
import { PageHeading } from "~/components/PageHeading";
import { useFavorites } from "~/hooks/useFavorites";

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <NoImagesAlert>
        No favorites yet. Click the heart on any image to add it.
      </NoImagesAlert>
    );
  }

  return (
    <>
      <PageHeading>Favorites</PageHeading>
      <ImageGrid>
        {favorites.map((image, index) => (
          <ImageCard key={image.id} image={image} index={index} />
        ))}
      </ImageGrid>
    </>
  );
};

export const Route = createFileRoute("/_app/favorites")({
  head: () => ({
    meta: [{ title: "Favorites - Pic Palette" }],
  }),
  component: FavoritesPage,
});
