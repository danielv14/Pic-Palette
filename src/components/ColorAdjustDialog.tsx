import { DialogFrame } from "~/components/DialogFrame";
import { PaletteAdjustControls } from "~/components/PaletteAdjustControls";

interface ColorAdjustDialogProps {
  hexValues: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ColorAdjustDialog = ({ hexValues, open, onOpenChange }: ColorAdjustDialogProps) => (
  <DialogFrame open={open} onOpenChange={onOpenChange} title="Adjust Palette" maxWidth="md">
    <PaletteAdjustControls hexValues={hexValues} />
  </DialogFrame>
);
