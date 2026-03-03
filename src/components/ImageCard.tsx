import { useState } from "react";
import { Dialog, Menu } from "@base-ui/react";
import { sleep } from "~/utils/sleep";
import { Tooltip } from "~/components/Tooltip";
import { ColorAdjustDialog } from "~/components/ColorAdjustDialog";

interface ImageCardProps {
  url: string;
  hexValues: string[];
  userName: string;
  photoUrl: string;
  index: number;
}

const AdjustIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 shrink-0"
  >
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-4 shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-4 shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-3.5 shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UTM = "?utm_source=pic_palette&utm_medium=referral";

export const ImageCard = ({ url, hexValues, userName, photoUrl, index }: ImageCardProps) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false);

  const copyAllColors = async () => {
    try {
      await navigator.clipboard.writeText(hexValues.join(","));
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
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-102"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent,black_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
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
        <Menu.Root>
          <Menu.Trigger className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white/60 transition-colors hover:text-white">
            <AdjustIcon />
            Palette
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner side="bottom" align="end" sideOffset={8}>
              <Menu.Popup className="min-w-44 rounded-xl border border-surface-3 bg-surface-1 p-1 shadow-2xl outline-none transition-all duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
                <Menu.Item
                  onClick={() => setIsAdjustDialogOpen(true)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-surface-3 hover:text-text-primary"
                >
                  <AdjustIcon />
                  Adjust palette
                </Menu.Item>
                <Menu.Item
                  onClick={copyAllColors}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-surface-3 hover:text-text-primary"
                >
                  <CopyIcon />
                  Copy all colors
                </Menu.Item>
                <Menu.Separator className="my-1 border-t border-surface-3" />
                <Menu.Item
                  onClick={() => setIsAuthorDialogOpen(true)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-surface-3 hover:text-text-primary"
                >
                  <PersonIcon />
                  About photo
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>

      <ColorAdjustDialog
        hexValues={hexValues}
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
      />

      <Dialog.Root open={isAuthorDialogOpen} onOpenChange={setIsAuthorDialogOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-surface-3 bg-surface-1 p-6 shadow-2xl transition-all duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title className="font-display text-lg font-semibold text-text-primary">
                About photo
              </Dialog.Title>
              <Dialog.Close className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary">
                <CloseIcon />
              </Dialog.Close>
            </div>
            <p className="mb-4 text-sm text-text-secondary">
              Photo by{" "}
              <span className="font-medium text-text-primary">@{userName}</span>{" "}
              on Unsplash.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://unsplash.com/@${userName}${UTM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-surface-3 px-4 py-3 text-sm text-text-secondary transition-colors hover:border-brand-500 hover:text-text-primary"
              >
                View photographer profile
                <ExternalLinkIcon />
              </a>
              <a
                href={`${photoUrl}${UTM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-surface-3 px-4 py-3 text-sm text-text-secondary transition-colors hover:border-brand-500 hover:text-text-primary"
              >
                View original photo
                <ExternalLinkIcon />
              </a>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
