import { useState, useRef } from "react";
import { Dialog, Menu } from "@base-ui/react";
import { Link } from "@tanstack/react-router";
import { sleep } from "~/utils/sleep";
import { UTM } from "~/utils/utm";
import { CloseIcon, ExternalLinkIcon } from "~/components/Icons";
import { Tooltip } from "~/components/Tooltip";
import { ColorAdjustDialog } from "~/components/ColorAdjustDialog";
import { RelatedPhotosDrawer } from "~/components/RelatedPhotosDrawer";
import { useFavorites } from "~/hooks/useFavorites";

interface ImageCardProps {
  id: string;
  url: string;
  smallUrl: string;
  thumbnail: string;
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

const RelatedIcon = () => (
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
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
    />
  </svg>
);

export const HeartIcon = ({ filled, className = "w-4 shrink-0" }: { filled: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);


export const ImageCard = ({ id, url, smallUrl, thumbnail, hexValues, userName, photoUrl, index }: ImageCardProps) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false);
  const [isRelatedDrawerOpen, setIsRelatedDrawerOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(id);
  const [isPopping, setIsPopping] = useState(false);
  const popTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggleFavorite = () => {
    toggleFavorite({ id, url, smallUrl, thumbnail, hexValues, userName, photoUrl });
    if (!favorited) {
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
      setIsPopping(true);
      popTimerRef.current = setTimeout(() => setIsPopping(false), 450);
    }
  };

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
      className="group animate-fade-in-up relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-white/0 transition-all duration-200 hover:ring-white/15 hover:shadow-lg hover:shadow-brand-500/10"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link
        to="/photos/$photoId"
        params={{ photoId: id }}
        className="absolute inset-0 z-0"
      >
        <img
          src={url}
          alt={`Photo by ${userName}`}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-102"
          loading="lazy"
        />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 backdrop-blur-md [mask-image:linear-gradient(to_bottom,transparent,black_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
        <div className="flex flex-row -space-x-2">
          {hexValues.map((hex) => (
            <Tooltip key={`hex-${hex}`} content={copiedHex === hex ? "Copied!" : hex}>
              <button
                onClick={() => copyHex(hex)}
                style={{ background: hex }}
                className="h-8 w-8 cursor-pointer rounded-full ring-2 ring-transparent transition-all duration-200 hover:z-10 hover:scale-125 hover:ring-white/30"
              />
            </Tooltip>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleFavorite}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
            style={{ color: favorited ? "var(--color-brand-400)" : "rgba(255,255,255,0.6)" }}
          >
            <HeartIcon filled={favorited} className={`w-4 shrink-0${isPopping ? " animate-heart-pop" : ""}`} />
          </button>
        <Menu.Root>
          <Menu.Trigger className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white">
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
                <Menu.Item
                  onClick={() => setIsRelatedDrawerOpen(true)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-secondary outline-none transition-colors hover:bg-surface-3 hover:text-text-primary"
                >
                  <RelatedIcon />
                  Related photos
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
      </div>

      <RelatedPhotosDrawer
        photoId={id}
        open={isRelatedDrawerOpen}
        onOpenChange={setIsRelatedDrawerOpen}
      />

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
