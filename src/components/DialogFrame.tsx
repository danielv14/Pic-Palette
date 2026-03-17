import type { ReactNode } from "react";
import { Dialog } from "@base-ui/react";
import { CloseIcon } from "~/components/Icons";

interface DialogFrameProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  maxWidth?: "sm" | "md";
  children: ReactNode;
}

export const DialogFrame = ({
  open,
  onOpenChange,
  title,
  maxWidth = "sm",
  children,
}: DialogFrameProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
      <Dialog.Popup
        className={`fixed left-1/2 top-1/2 z-50 w-full ${maxWidth === "md" ? "max-w-md" : "max-w-sm"} -translate-x-1/2 -translate-y-1/2 animate-dialog-enter rounded-2xl border border-surface-3 bg-surface-1 p-6 shadow-2xl transition-all duration-300 ease-out data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0`}
      >
        <div className="mb-5 flex items-center justify-between">
          <Dialog.Title className="font-display text-lg font-semibold text-text-primary">
            {title}
          </Dialog.Title>
          <Dialog.Close className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary">
            <CloseIcon />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
