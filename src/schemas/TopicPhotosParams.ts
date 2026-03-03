import { z } from "zod";
import { PaginationSchema } from "./PaginationParams";

const TopicPhotosBaseSchema = z.object({
  topicSlug: z.string(),
});

export const TopicPhotosSchema = TopicPhotosBaseSchema.merge(PaginationSchema);

export type TopicPhotosOptions = z.infer<typeof TopicPhotosSchema>;
