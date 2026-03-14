import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ExternalLinkIcon, HeartIcon } from "~/components/Icons";
import { ImageCard } from "~/components/ImageCard";
import { ImageGrid } from "~/components/ImageGrid";
import { PaletteAdjustControls } from "~/components/PaletteAdjustControls";
import { PhotoPageSkeleton } from "~/components/PhotoPageSkeleton";
import { useFavoriteToggle } from "~/hooks/useFavoriteToggle";
import { photoQueryOptions, relatedPhotosQueryOptions } from "~/integration/unsplash";
import { UTM } from "~/utils/utm";

const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const PhotoPage = () => {
  const { photoId } = Route.useParams();
  const router = useRouter();
  const { data: photo } = useQuery(photoQueryOptions(photoId));
  const { data: related = [] } = useQuery(relatedPhotosQueryOptions(photoId));
  const { isFavorite, isPopping, handleToggleFavorite } = useFavoriteToggle(photo?.id ?? "");

  const relatedPhotos = useMemo(() => related, [related]);

  if (!photo) return null;

  return (
    <div className="p-2 md:p-4">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-text-muted backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-text-primary"
        >
          <BackIcon />
          Back
        </button>
        <button
          onClick={() => handleToggleFavorite(photo)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/10"
          style={{ color: isFavorite ? "var(--color-brand-400)" : "var(--color-text-muted)" }}
        >
          <HeartIcon filled={isFavorite} className={`w-3.5 shrink-0${isPopping ? " animate-heart-pop" : ""}`} />
          {isFavorite ? "Favorited" : "Add to favorites"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <img
            src={photo.url}
            alt={`Photo by ${photo.userName}`}
            className="w-full rounded-2xl object-cover ring-1 ring-white/5"
          />
          <a
            href={`https://unsplash.com/@${photo.userName}${UTM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <ExternalLinkIcon />
            @{photo.userName} on Unsplash
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-1/80 p-6 backdrop-blur-md">
          <h2 className="mb-5 font-display text-lg font-semibold text-text-primary">
            Palette
          </h2>
          <PaletteAdjustControls hexValues={photo.hexValues} />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 bg-gradient-to-br from-brand-300 to-brand-500 bg-clip-text p-2 font-display text-2xl font-extrabold tracking-tight text-transparent md:p-0 md:text-3xl">
          Related photos
        </h2>
        {relatedPhotos.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">No related photos found.</p>
        ) : (
          <ImageGrid>
            {relatedPhotos.map((image, index) => (
              <ImageCard key={image.id} image={image} index={index} />
            ))}
          </ImageGrid>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app/photos/$photoId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(photoQueryOptions(params.photoId)),
  pendingComponent: PhotoPageSkeleton,
  component: PhotoPage,
});
