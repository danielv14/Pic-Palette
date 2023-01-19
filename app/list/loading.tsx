import { ImageCardLoading } from "../../components/ImageCardLoading";
import { ImageGrid } from "../../components/ImageGrid";
import { AMOUNT_OF_IMAGES_TO_FETCH } from "../../integration/unsplash/config";

const loading = () => {
  return (
    <ImageGrid>
      {new Array(AMOUNT_OF_IMAGES_TO_FETCH).fill(null).map((key) => {
        return <ImageCardLoading key={key} />;
      })}
    </ImageGrid>
  );
};

export default loading;
