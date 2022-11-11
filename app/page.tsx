/* eslint-disable @next/next/no-img-element */
import { unsplash } from "../integration/unsplash";
import { ImageSearchParams } from "../types/ImageSearchParams";
import { ImageCard } from "./ImageCard";
import { PrevNextPage } from "./PrevNextPage";
import { Searchbar } from "./Searchbar";

export default async function Home({
  searchParams,
}: {
  searchParams: ImageSearchParams;
}) {
  const images = await unsplash.searchPhotos({
    query: searchParams.search,
    perPage: 10,
    page: parseInt(searchParams.page ?? "0"),
  });

  return (
    <>
      <div className="py-4 my-4">
        <Searchbar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {images.map((image) => (
          <div key={image.url} className="justify-self-center h-full">
            <ImageCard
              url={image.url}
              hexValues={image.hexValues}
              userName={image.userName}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 mb-6">
        <PrevNextPage />
      </div>
    </>
  );
}
