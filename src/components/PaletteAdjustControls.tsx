import { useState } from "react";
import { adjustColor, type ColorAdjustments, DEFAULT_ADJUSTMENTS } from "~/utils/colorAdjust";
import { sleep } from "~/utils/sleep";
import { Tooltip } from "~/components/Tooltip";

interface PaletteAdjustControlsProps {
  hexValues: string[];
}

const PRESETS: Array<{ label: string; adjustments: ColorAdjustments }> = [
  { label: "Original", adjustments: { saturation: 0, lightness: 0, hue: 0 } },
  { label: "Vivid", adjustments: { saturation: 50, lightness: 5, hue: 0 } },
  { label: "Muted", adjustments: { saturation: -50, lightness: 0, hue: 0 } },
  { label: "Pastel", adjustments: { saturation: -40, lightness: 20, hue: 0 } },
  { label: "Dark", adjustments: { saturation: 0, lightness: -20, hue: 0 } },
];

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
    <span className="w-12 shrink-0 text-right font-mono text-xs tabular-nums text-text-muted">
      {displayValue}
    </span>
  </div>
);

export const PaletteAdjustControls = ({ hexValues }: PaletteAdjustControlsProps) => {
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
    <div className="flex flex-col gap-5">
      <div className="space-y-3">
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
              <Tooltip key={`adj-${index}`} content={copiedHex === hex ? "Copied!" : hex}>
                <button
                  onClick={() => copySwatch(hex)}
                  style={{ background: hex }}
                  className="h-9 w-9 cursor-pointer rounded-full ring-2 ring-transparent transition-all duration-200 hover:scale-110 hover:ring-white/30"
                />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl bg-surface-0 p-4">
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

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const isActive =
            preset.adjustments.saturation === adjustments.saturation &&
            preset.adjustments.lightness === adjustments.lightness &&
            preset.adjustments.hue === adjustments.hue;
          return (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className={`rounded-full border px-3 py-1 text-xs transition-all duration-200 ${
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
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-400"
      >
        {hasCopied ? "Copied!" : "Copy adjusted palette"}
      </button>
    </div>
  );
};
