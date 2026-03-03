import { Dialog } from "@base-ui/react";
import { CloseIcon } from "~/components/Icons";
import { PaletteAdjustControls } from "~/components/PaletteAdjustControls";

interface ColorAdjustDialogProps {
  hexValues: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorAdjustDialog = ({ hexValues, open, onOpenChange }: ColorAdjustDialogProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
      <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-surface-3 bg-surface-1 p-6 shadow-2xl transition-all duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
        <div className="mb-5 flex items-center justify-between">
          <Dialog.Title className="font-display text-lg font-semibold text-text-primary">
            Adjust Palette
          </Dialog.Title>
          <Dialog.Close className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary">
            <CloseIcon />
          </Dialog.Close>
        </div>
        <PaletteAdjustControls hexValues={hexValues} />
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
