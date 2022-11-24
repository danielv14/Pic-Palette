import { OrderBy } from "unsplash-js";

export interface ImageSearchParams {
  query: string;
  page?: string;
}

export interface ImageListSearchParams {
  type: OrderBy;
  page?: string;
}
