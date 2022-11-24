import { OrderBy } from "unsplash-js";

export interface ImageSearchParams {
  query: string;
  page?: string;
}

export interface ImageListParams {
  type: OrderBy;
  page?: string;
}
