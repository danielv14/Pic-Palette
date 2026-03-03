import { useQuery } from "@tanstack/react-query";
import { DrawerPreview as Drawer } from "@base-ui/react";
import { Link } from "@tanstack/react-router";
import { CloseIcon } from "~/components/Icons";
import { relatedPhotosQueryOptions } from "~/integration/unsplash";

interface RelatedPhotosDrawerProps {
  photoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RelatedPhotosDrawer = ({ photoId, open, onOpenChange }: RelatedPhotosDrawerProps) => {
  const { data: related = [], isLoading } = useQuery({
    ...relatedPhotosQueryOptions(photoId),
    enabled: open,
  });

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Drawer.Popup className="fixed inset-x-0 bottom-0 z-50 flex max-h-[70vh] flex-col rounded-t-2xl border-t border-surface-3 bg-surface-1 shadow-2xl transition-transform duration-300 ease-out data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full">
          <div className="flex items-center justify-between border-b border-surface-3 p-4">
            <Drawer.Title className="font-display text-lg font-semibold text-text-primary">
              Related photos
            </Drawer.Title>
            <Drawer.Close className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary">
              <CloseIcon />
            </Drawer.Close>
          </div>
          <div className="overflow-y-auto p-4">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="aspect-square animate-pulse rounded-xl bg-surface-3" />
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="h-4 w-4 animate-pulse rounded-full bg-surface-3" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : related.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">No related photos found.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {related.map((image) => (
                  <Link
                    key={image.id}
                    to="/photos/$photoId"
                    params={{ photoId: image.id }}
                    className="group flex flex-col gap-1.5"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <img
                        src={image.smallUrl}
                        alt={`Photo by ${image.userName}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex -space-x-1.5">
                      {image.hexValues.map((hex) => (
                        <div
                          key={hex}
                          style={{ background: hex }}
                          className="h-4 w-4 rounded-full border-2 border-surface-1"
                        />
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
