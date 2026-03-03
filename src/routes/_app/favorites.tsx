import { createFileRoute } from "@tanstack/react-router";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { NoImagesAlert } from "~/components/NoImagesAlert";
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
      <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text p-2 text-center text-2xl font-extrabold text-transparent font-display md:p-4 md:text-start md:text-3xl">
        Favorites
      </h2>
      <ImageGrid>
        {favorites.map((image, index) => (
          <ImageCard
            key={image.id}
            id={image.id}
            url={image.url}
            smallUrl={image.smallUrl}
            thumbnail={image.thumbnail}
            hexValues={image.hexValues}
            userName={image.userName}
            photoUrl={image.photoUrl}
            index={index}
          />
        ))}
      </ImageGrid>
    </>
  );
};

export const Route = createFileRoute("/_app/favorites")({
  component: FavoritesPage,
});
