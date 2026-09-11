import { ImageCardLoading } from "~/components/ImageCardLoading";
import { ImageGrid } from "~/components/ImageGrid";
import { PAGE_SIZE } from "~/integration/unsplash/api";

export const ImageGridSkeleton = () => (
  <div role="status" aria-label="Loading">
    <ImageGrid>
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <ImageCardLoading key={index} />
      ))}
    </ImageGrid>
  </div>
);
