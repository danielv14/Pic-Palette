export const SEARCH_TYPES = ["photos", "collections"] as const;

export type SearchType = (typeof SEARCH_TYPES)[number];
