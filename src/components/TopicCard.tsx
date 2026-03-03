import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { Topic } from "~/types/Topic";

export const TopicCard = ({ topic }: { topic: Topic }) => (
  <Link
    to="/topics/$topicSlug"
    params={{ topicSlug: topic.slug }}
    search={{ title: topic.title }}
  >
    <div className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl">
      <img
        src={topic.coverUrl}
        alt={topic.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 p-4">
        <h3 className="text-lg font-bold leading-tight text-white">
          {topic.title}
        </h3>
        <p className="mt-0.5 text-sm text-white/60">
          {topic.totalPhotos.toLocaleString()} photos
        </p>
      </div>
    </div>
  </Link>
);
