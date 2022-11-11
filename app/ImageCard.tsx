"use client";

import Link from "next/link";

interface ImageWithPaletteProps {
  url: string;
  hexValues: string[];
  userName: string;
}

export const ImageCard = ({
  url,
  hexValues,
  userName,
}: ImageWithPaletteProps) => {
  const random = Math.random() < 0.5;
  return (
    <div
      className={`${
        random ? "origin-bottom-left" : "origin-top-right"
      } md:hover:-rotate-1 transition-all bg-slate-700 flex flex-col items-center w-full rounded-lg h-full`}
    >
      <img
        src={url}
        alt="image"
        className="rounded-lg rounded-b-none mb-4 aspect-square object-cover"
        width={"100%"}
        height={300}
        loading="lazy"
      />
      <div className="flex flex-row -space-x-2">
        {hexValues.map((hex) => (
          <div
            key={`hex-${hex}`}
            style={{ background: hex }}
            className="p-5 rounded-full ring-2 ring-slate-200"
          ></div>
        ))}
      </div>
      <p className="p-2 text-sm text-slate-500">
        By: {userName} on{" "}
        <Link href="https://unplash.com" className="underline">
          unsplash.com
        </Link>
      </p>
    </div>
  );
};
