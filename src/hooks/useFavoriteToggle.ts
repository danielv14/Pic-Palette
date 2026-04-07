import { useState, useRef, useEffect } from "react";
import { useFavorites } from "~/hooks/useFavorites";
import type { UnsplashImage } from "~/types/Image";

export const useFavoriteToggle = (imageId: string) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isPopping, setIsPopping] = useState(false);
  const popTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
    };
  }, []);

  const favorited = isFavorite(imageId);

  const handleToggleFavorite = (image: UnsplashImage) => {
    toggleFavorite(image);
    if (!favorited) {
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
      setIsPopping(true);
      popTimerRef.current = setTimeout(() => setIsPopping(false), 450);
    }
  };

  return { isFavorite: favorited, isPopping, handleToggleFavorite };
};
