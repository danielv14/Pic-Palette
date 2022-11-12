"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sleep } from "../utils/sleep";

interface ImageWithPaletteProps {
  url: string;
  hexValues: string[];
  userName: string;
}

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    className="w-5"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

const CopySuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    className="w-5 stroke-green-600"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const ImageCard = ({
  url,
  hexValues,
  userName,
}: ImageWithPaletteProps) => {
  // wrap in memo to not change hover effect when copying to clipboard
  const random = useMemo(() => Math.random() < 0.5, []);
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      navigator.clipboard.writeText(hexValues.join(","));
      setHasCopied(true);
      await sleep(1000);
      setHasCopied(false);
    } catch (e) {
      // do nothing
    }
  };

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
      <button
        onClick={copyToClipboard}
        className="flex items-center text-sm gap-1 rounded-full mt-2 px-2 py-1 text-slate-400 hover:text-slate-200"
      >
        {hasCopied ? <CopySuccessIcon /> : <CopyIcon />}
        Copy colors
      </button>
      <p className="p-2 text-xs text-slate-500">
        By: {userName} on{" "}
        <Link href="https://unplash.com" className="underline">
          unsplash.com
        </Link>
      </p>
    </div>
  );
};
