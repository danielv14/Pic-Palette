import { ImageCard } from "../../components/ImageCard";
import { ImageGrid } from "../../components/ImageGrid";
import { NoImagesAlert } from "../../components/NoImagesAlert";
import { unsplash } from "../../integration/unsplash";
import { ImageSearchParams } from "../../types/ImageSearchParams";
import { PrevNextPage } from "../PrevNextPage";

const AMOUNT_OF_IMAGES_TO_FETCH = 12;

const Home = async ({ searchParams }: { searchParams?: ImageSearchParams }) => {
  const images = await unsplash.searchPhotos({
    query: searchParams?.query ?? "",
    perPage: AMOUNT_OF_IMAGES_TO_FETCH,
    page: parseInt(searchParams?.page ?? "0"),
  });

  const hasImages = !!images.length;
  const hasNoMoreContent = images.length < AMOUNT_OF_IMAGES_TO_FETCH;

  return (
    <>
      {!hasImages && (
        <NoImagesAlert>
          Found no images. Search for something else.
        </NoImagesAlert>
      )}
      {hasImages && (
        <>
          <h2 className="p-2 md:p-4 text-center md:text-start  text-2xl md:text3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-indigo-600">
            Images of &quot;
            <span className="italic">{searchParams?.query}</span>
            &quot;
          </h2>
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
            <PrevNextPage
              path="/search"
              pageParam="query"
              hasNoMoreContent={hasNoMoreContent}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
