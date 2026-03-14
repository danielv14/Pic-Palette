export const AMOUNT_OF_IMAGES_TO_FETCH = 20;

export const getAccessKey = (): string => {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    throw new Error(
      "UNSPLASH_ACCESS_KEY is not set. Please add it to your .env.local file.",
    );
  }
  return key;
};
