import { useEffect, useState } from "react";
import { getPalette } from "colorthief";

export const useColorPalette = (imageUrl: string) => {
  const [hexValues, setHexValues] = useState<string[]>([]);

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = async () => {
      if (cancelled) return;
      try {
        const palette = await getPalette(image, { colorCount: 6 });
        if (palette && !cancelled) {
          setHexValues(palette.map((color) => color.hex()));
        }
      } catch (error) {
        console.error("Failed to extract colors:", error);
      }
    };

    image.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return hexValues;
};
