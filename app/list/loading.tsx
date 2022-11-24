import { ImageCardLoading } from "../../components/ImageCardLoading";
import { ImageGrid } from "../../components/ImageGrid";

const loading = () => {
  return (
    <ImageGrid>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => {
        return <ImageCardLoading key={key} />;
      })}
    </ImageGrid>
  );
};

export default loading;
