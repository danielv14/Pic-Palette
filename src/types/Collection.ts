export interface Collection {
  id: string;
  title: string;
  description: string | null;
  totalPhotos: number;
  coverUrl: string;
  previewUrls: string[];
  userName: string;
}
