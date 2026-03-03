import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { Topic } from "~/types/Topic";

export const TopicCard = ({ topic }: { topic: Topic }) => (
  <Link
    to="/topics/$topicSlug"
    params={{ topicSlug: topic.slug }}
    search={{ title: topic.title }}
  >
    <div className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/0 transition-all duration-200 hover:ring-white/15 hover:shadow-lg hover:shadow-brand-500/10">
      <img
        src={topic.coverUrl}
        alt={topic.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 p-4">
        <h3 className="text-lg font-bold leading-tight text-white drop-shadow-md">
          {topic.title}
        </h3>
        <span className="mt-1.5 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80 backdrop-blur-sm">
          {topic.totalPhotos.toLocaleString()} photos
        </span>
      </div>
    </div>
  </Link>
);
