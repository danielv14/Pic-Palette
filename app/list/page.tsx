import { ImageCard } from "../../components/ImageCard";
import { ImageGrid } from "../../components/ImageGrid";
import { NoImagesAlert } from "../../components/NoImagesAlert";
import { unsplash } from "../../integration/unsplash";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "../../integration/unsplash/config";
import { ImageListSearchParamSchema } from "../../schema/ImageListParams";
import { PrevNextPage } from "../PrevNextPage";

type PageProps = {
  searchParams?: unknown;
};

const Page = async (props: PageProps) => {
  const listParams = ImageListSearchParamSchema.parse(props.searchParams);
  const images = await unsplash.listPhotos({
    ...listParams,
    perPage: AMOUNT_OF_IMAGES_TO_FETCH,
  });

  const hasImages = !!images.length;
  const hasNoMoreContent = images.length < AMOUNT_OF_IMAGES_TO_FETCH;

  return (
    <>
      {!hasImages && <NoImagesAlert>Oh no! Found no images :(</NoImagesAlert>}
      {hasImages && (
        <>
          <h2 className="p-2 md:p-4 text-center md:text-start text-2xl md:text3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-indigo-600">
            <span className="capitalize">{listParams.type}</span> images
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
