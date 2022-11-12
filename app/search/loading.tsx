import { ImageGrid } from "../../components/ImageGrid";

const loading = () => {
  return (
    <ImageGrid>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => {
        return (
          <div
            key={key}
            className="bg-slate-700 rounded-lg w-full h-[350px] justify-self-center"
          />
        );
      })}
    </ImageGrid>
  );
};

export default loading;
