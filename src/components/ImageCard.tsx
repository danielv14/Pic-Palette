import { useState } from "react";
import { sleep } from "~/utils/sleep";
import { Tooltip } from "~/components/Tooltip";

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
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

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

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      await sleep(1000);
      setCopiedHex(null);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div
      className="group animate-fade-in-up relative aspect-square w-full overflow-hidden rounded-2xl"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <img
        src={url}
        alt={`Photo by ${userName}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent,black_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-row -space-x-2">
            {hexValues.map((hex) => (
              <Tooltip key={`hex-${hex}`} content={copiedHex === hex ? "Copied!" : hex}>
                <button
                  onClick={() => copyHex(hex)}
                  style={{ background: hex }}
                  className="h-8 w-8 cursor-pointer rounded-full transition-transform hover:z-10 hover:scale-125"
                />
              </Tooltip>
            ))}
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white/60 transition-colors hover:text-white"
          >
            {hasCopied ? <CopySuccessIcon /> : <CopyIcon />}
            {hasCopied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-[10px] text-white/50">
          By {userName} on{" "}
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
    </div>
  );
};
