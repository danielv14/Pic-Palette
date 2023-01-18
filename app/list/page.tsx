import { OrderBy } from "unsplash-js";
import { ImageCard } from "../../components/ImageCard";
import { ImageGrid } from "../../components/ImageGrid";
import { NoImagesAlert } from "../../components/NoImagesAlert";
import { unsplash } from "../../integration/unsplash";
import { ImageListSearchParams } from "../../types/ImageSearchParams";
import { PrevNextPage } from "../PrevNextPage";

const AMOUNT_OF_IMAGES_TO_FETCH = 12;

type PageProps = {
  searchParams?: ImageListSearchParams;
};

const Page = async (props: PageProps) => {
  const images = await unsplash.listPhotos({
    listType: props?.searchParams?.type ?? OrderBy.POPULAR,
    perPage: AMOUNT_OF_IMAGES_TO_FETCH,
    page: parseInt(props?.searchParams?.page ?? "0"),
  });

  const hasImages = !!images.length;
  const hasNoMoreContent = images.length < AMOUNT_OF_IMAGES_TO_FETCH;

  return (
    <>
      {!hasImages && <NoImagesAlert>Oh no! Found no images :(</NoImagesAlert>}
      {hasImages && (
        <>
          <h2 className="p-2 md:p-4 text-center md:text-start text-2xl md:text3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-indigo-600">
            <span className="capitalize">{props?.searchParams?.type}</span>{" "}
            images
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
              path="/list"
              pageParam="type"
              hasNoMoreContent={hasNoMoreContent}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Page;
