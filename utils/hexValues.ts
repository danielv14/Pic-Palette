import Vibrant from "node-vibrant";

export const getHexValues = async (url: string) => {
  const imagePalette = await Vibrant.from(url).getPalette();
  const hexValues = Object.keys(imagePalette).map(
    (swatch) => imagePalette[swatch]?.hex
  );
  return hexValues as string[];
};
