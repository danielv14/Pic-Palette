import { useState } from "react";
import { Dialog } from "@base-ui/react";
import { adjustColor, type ColorAdjustments, DEFAULT_ADJUSTMENTS } from "~/utils/colorAdjust";
import { sleep } from "~/utils/sleep";
import { Tooltip } from "~/components/Tooltip";

interface ColorAdjustDialogProps {
  hexValues: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESETS: Array<{ label: string; adjustments: ColorAdjustments }> = [
  { label: "Original", adjustments: { saturation: 0, lightness: 0, hue: 0 } },
  { label: "Vivid", adjustments: { saturation: 50, lightness: 5, hue: 0 } },
  { label: "Muted", adjustments: { saturation: -50, lightness: 0, hue: 0 } },
  { label: "Pastel", adjustments: { saturation: -40, lightness: 20, hue: 0 } },
  { label: "Dark", adjustments: { saturation: 0, lightness: -20, hue: 0 } },
];

export const ColorAdjustDialog = ({ hexValues, open, onOpenChange }: ColorAdjustDialogProps) => {
  const [adjustments, setAdjustments] = useState<ColorAdjustments>(DEFAULT_ADJUSTMENTS);
  const [hasCopied, setHasCopied] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const adjustedColors = hexValues.map((hex) => adjustColor(hex, adjustments));

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(adjustedColors.join(","));
      setHasCopied(true);
      await sleep(1000);
      setHasCopied(false);
    } catch {
      // clipboard not available
    }
  };

  const copySwatch = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      await sleep(1000);
      setCopiedHex(null);
    } catch {
      // clipboard not available
    }
  };

  const updateAdjustment = (key: keyof ColorAdjustments, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setAdjustments(preset.adjustments);
  };

  const formatValue = (value: number, suffix = "") =>
    `${value > 0 ? "+" : ""}${value}${suffix}`;

  return (
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

          <div className="mb-5 space-y-3">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Original
              </p>
              <div className="flex flex-row gap-2">
                {hexValues.map((hex) => (
                  <div
                    key={`orig-${hex}`}
                    style={{ background: hex }}
                    className="h-9 w-9 rounded-full"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Adjusted
              </p>
              <div className="flex flex-row gap-2">
                {adjustedColors.map((hex, index) => (
                  <Tooltip
                    key={`adj-${index}`}
                    content={copiedHex === hex ? "Copied!" : hex}
                  >
                    <button
                      onClick={() => copySwatch(hex)}
                      style={{ background: hex }}
                      className="h-9 w-9 cursor-pointer rounded-full transition-transform hover:scale-110"
                    />
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-5 space-y-4 rounded-xl bg-surface-0 p-4">
            <SliderRow
              label="Saturation"
              value={adjustments.saturation}
              min={-100}
              max={100}
              onChange={(value) => updateAdjustment("saturation", value)}
              displayValue={formatValue(adjustments.saturation)}
            />
            <SliderRow
              label="Lightness"
              value={adjustments.lightness}
              min={-50}
              max={50}
              onChange={(value) => updateAdjustment("lightness", value)}
              displayValue={formatValue(adjustments.lightness)}
            />
            <SliderRow
              label="Hue"
              value={adjustments.hue}
              min={-180}
              max={180}
              onChange={(value) => updateAdjustment("hue", value)}
              displayValue={formatValue(adjustments.hue, "deg")}
            />
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const isActive =
                preset.adjustments.saturation === adjustments.saturation &&
                preset.adjustments.lightness === adjustments.lightness &&
                preset.adjustments.hue === adjustments.hue;
              return (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? "border-brand-500 bg-brand-500/10 text-text-primary"
                      : "border-surface-3 text-text-secondary hover:border-brand-400 hover:text-text-primary"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={copyAll}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-400"
          >
            {hasCopied ? "Copied!" : "Copy adjusted palette"}
          </button>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  displayValue: string;
}

const SliderRow = ({ label, value, min, max, onChange, displayValue }: SliderRowProps) => (
  <div className="flex items-center gap-3">
    <span className="w-20 shrink-0 text-xs text-text-secondary">{label}</span>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="palette-slider flex-1"
    />
    <span className="w-12 shrink-0 text-right font-mono text-xs text-text-muted">
      {displayValue}
    </span>
  </div>
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
