import { useState } from "react";
import { Dialog, Menu } from "@base-ui/react";
import { Link } from "@tanstack/react-router";
import { UTM } from "~/utils/utm";
import { AdjustIcon, CloseIcon, CopyIcon, ExternalLinkIcon, HeartIcon, PersonIcon } from "~/components/Icons";
import { CardOverlay } from "~/components/CardOverlay";
import { Tooltip } from "~/components/Tooltip";
import { ColorAdjustDialog } from "~/components/ColorAdjustDialog";
import { useFavoriteToggle } from "~/hooks/useFavoriteToggle";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import type { ImageWithPalette } from "~/types/Image";

interface ImageCardProps {
  image: ImageWithPalette;
  index: number;
}

export const ImageCard = ({ image, index }: ImageCardProps) => {
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false);
  const { isFavorite, isPopping, handleToggleFavorite } = useFavoriteToggle(image.id);
  const { copiedValue, copyToClipboard } = useCopyToClipboard();

  const copyAllColors = async () => {
    await copyToClipboard(image.hexValues.join(","));
  };

  return (
    <div
      className="group animate-fade-in-up relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-white/0 transition-all duration-200 hover:ring-white/15"
      style={{ animationDelay: `${(index % 20) * 60}ms` }}
    >
      <Link
        to="/photos/$photoId"
        params={{ photoId: image.id }}
        className="absolute inset-0 z-0"
      >
        <img
          src={image.url}
          alt={`Photo by ${image.userName}`}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-102"
          loading="lazy"
        />
      </Link>
      <CardOverlay />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
        <div className="flex flex-row -space-x-2">
          {image.hexValues.map((hex) => (
            <Tooltip key={`hex-${hex}`} content={copiedValue === hex ? "Copied!" : hex}>
              <button
                onClick={() => copyToClipboard(hex)}
                style={{ background: hex }}
                className="h-8 w-8 cursor-pointer rounded-full ring-2 ring-transparent transition-all duration-200 hover:z-10 hover:scale-125 hover:ring-white/30"
              />
            </Tooltip>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToggleFavorite(image)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
            style={{ color: isFavorite ? "var(--color-brand-400)" : "rgba(255,255,255,0.6)" }}
          >
            <HeartIcon filled={isFavorite} className={`w-4 shrink-0${isPopping ? " animate-heart-pop" : ""}`} />
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

      {isAdjustDialogOpen && (
        <ColorAdjustDialog
          hexValues={image.hexValues}
          open={isAdjustDialogOpen}
          onOpenChange={setIsAdjustDialogOpen}
        />
      )}

      {isAuthorDialogOpen && (
        <Dialog.Root open={isAuthorDialogOpen} onOpenChange={setIsAuthorDialogOpen}>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
            <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 animate-dialog-enter rounded-2xl border border-surface-3 bg-surface-1 p-6 shadow-2xl transition-all duration-300 ease-out data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0">
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
                <span className="font-medium text-text-primary">@{image.userName}</span>{" "}
                on Unsplash.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`https://unsplash.com/@${image.userName}${UTM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-surface-3 px-4 py-3 text-sm text-text-secondary transition-colors hover:border-brand-500 hover:text-text-primary"
                >
                  View photographer profile
                  <ExternalLinkIcon />
                </a>
                <a
                  href={`${image.photoUrl}${UTM}`}
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
      )}
    </div>
  );
};
