/* eslint-disable @next/next/no-img-element */
import { ImageCard } from "../../components/ImageCard";
import { ImageGrid } from "../../components/ImageGrid";
import { unsplash } from "../../integration/unsplash";
import { ImageSearchParams } from "../../types/ImageSearchParams";
import { PrevNextPage } from "../PrevNextPage";

const AMOUNT_OF_IMAGES_TO_FETCH = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: ImageSearchParams;
}) {
  const images = await unsplash.searchPhotos({
    query: searchParams.query,
    perPage: AMOUNT_OF_IMAGES_TO_FETCH,
    page: parseInt(searchParams.page ?? "0"),
  });

  const hasImages = !!images.length;
  const hasNoMoreContent = images.length <= AMOUNT_OF_IMAGES_TO_FETCH;

  return (
    <>
      {!hasImages && (
        <div className="text-slate-500 flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p className="text-center text-md md:text-2xl font-bold ">
            Found no images. Search for something else.
          </p>
        </div>
      )}
      {hasImages && (
        <>
          <ImageGrid>
            {images.map((image) => (
              <div key={image.url} className="justify-self-center h-full">
                <ImageCard
                  url={image.url}
                  hexValues={image.hexValues}
                  userName={image.userName}
                />
              </div>
            ))}
          </ImageGrid>
          <div className="mt-6 mb-6">
            <PrevNextPage hasNoMoreContent={hasNoMoreContent} />
          </div>
        </>
      )}
    </>
  );
}
