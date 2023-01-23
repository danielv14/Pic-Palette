import { z } from "zod";
import { ImageCard } from "../../components/ImageCard";
import { ImageGrid } from "../../components/ImageGrid";
import { NoImagesAlert } from "../../components/NoImagesAlert";
import { unsplash } from "../../integration/unsplash";
import { ImageSearchSchema } from "../../schemas/ImageSearchParams";
import { PrevNextPage } from "../PrevNextPage";

type PageProps = {
  searchParams: z.input<typeof ImageSearchSchema>;
};

const Home = async ({ searchParams }: PageProps) => {
  const imageSearchOptions = ImageSearchSchema.parse(searchParams);
  const images = await unsplash.searchPhotosByQuery(imageSearchOptions);

  const hasImages = !!images.length;
  const hasNoMoreContent = images.length < imageSearchOptions.perPage;

  if (!hasImages) {
    return (
      <NoImagesAlert>Found no images. Search for something else.</NoImagesAlert>
    );
  }

  return (
    <>
      <h2 className="p-2 md:p-4 text-center md:text-start  text-2xl md:text3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-indigo-600">
        Images of &quot;
        <span className="italic">{imageSearchOptions.query}</span>
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
  );
};

export default Home;
