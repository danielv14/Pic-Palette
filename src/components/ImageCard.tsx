import { useState } from "react";
import { sleep } from "~/utils/sleep";

interface ImageCardProps {
  url: string;
  hexValues: string[];
  userName: string;
  index: number;
}

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

const CopySuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-5 stroke-green-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const ImageCard = ({ url, hexValues, userName, index }: ImageCardProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hexValues.join(","));
      setHasCopied(true);
      await sleep(1000);
      setHasCopied(false);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div
      className="group animate-fade-in-up flex h-full w-full flex-col items-center rounded-2xl bg-surface-2"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="w-full overflow-hidden rounded-2xl rounded-b-none">
        <img
          src={url}
          alt={`Photo by ${userName}`}
          className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-4 flex flex-row -space-x-2">
        {hexValues.map((hex) => (
          <div
            key={`hex-${hex}`}
            style={{ background: hex }}
            className="h-10 w-10 rounded-full ring-2 ring-surface-1 transition-transform hover:scale-125 hover:z-10"
          />
        ))}
      </div>
      <button
        onClick={copyToClipboard}
        className="mt-2 flex items-center gap-1 rounded-full px-3 py-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        {hasCopied ? <CopySuccessIcon /> : <CopyIcon />}
        {hasCopied ? "Copied" : "Copy colors"}
      </button>
      <p className="p-2 text-xs text-text-muted">
        By: {userName} on{" "}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          unsplash.com
        </a>
      </p>
    </div>
  );
};
