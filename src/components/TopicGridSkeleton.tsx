import * as React from "react";

export const TopicGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="aspect-[4/3] animate-pulse rounded-xl bg-white/10"
      />
    ))}
  </div>
);
