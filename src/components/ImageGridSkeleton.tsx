import { ImageCardLoading } from "~/components/ImageCardLoading";
import { ImageGrid } from "~/components/ImageGrid";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "~/integration/unsplash/config";

export const ImageGridSkeleton = () => (
  <ImageGrid>
    {Array.from({ length: AMOUNT_OF_IMAGES_TO_FETCH }).map((_, index) => (
      <ImageCardLoading key={index} />
    ))}
  </ImageGrid>
);
