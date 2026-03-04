import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { Collection } from "~/types/Collection";

export const CollectionCard = ({ collection }: { collection: Collection }) => (
  <Link
    to="/collections/$collectionId"
    params={{ collectionId: collection.id }}
    search={{ title: collection.title }}
  >
    <div className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/0 transition-all duration-200 hover:ring-white/15 hover:shadow-lg hover:shadow-brand-500/10">
      {collection.coverUrl ? (
        <img
          src={collection.coverUrl}
          alt={collection.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/5">
          <div className="grid grid-cols-2 gap-0.5 p-2 opacity-60">
            {collection.previewUrls.slice(0, 4).map((url, index) => (
              <img
                key={index}
                src={url}
                alt=""
                className="aspect-square object-cover rounded-sm"
              />
            ))}
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent,black_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 p-4">
        <h3 className="text-lg font-bold leading-tight text-white drop-shadow-md">
          {collection.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80 backdrop-blur-sm">
            {collection.totalPhotos.toLocaleString()} photos
          </span>
          <span className="text-xs text-white/60">by {collection.userName}</span>
        </div>
      </div>
    </div>
  </Link>
);
