import * as React from "react";
import { Select } from "@base-ui/react/select";
import { UNSPLASH_COLORS, type UnsplashColor } from "~/schemas/ImageSearchParams";

const COLOR_META: Record<UnsplashColor, { label: string; swatch: string }> = {
  black_and_white: { label: "Black & White", swatch: "bg-gradient-to-r from-black to-white" },
  black: { label: "Black", swatch: "bg-black" },
  white: { label: "White", swatch: "bg-white border border-white/30" },
  yellow: { label: "Yellow", swatch: "bg-yellow-400" },
  orange: { label: "Orange", swatch: "bg-orange-500" },
  red: { label: "Red", swatch: "bg-red-500" },
  purple: { label: "Purple", swatch: "bg-purple-500" },
  magenta: { label: "Magenta", swatch: "bg-pink-500" },
  green: { label: "Green", swatch: "bg-green-500" },
  teal: { label: "Teal", swatch: "bg-teal-500" },
  blue: { label: "Blue", swatch: "bg-blue-500" },
};

const ColorSwatch = ({ color }: { color: UnsplashColor }) => (
  <span className={`inline-block h-3.5 w-3.5 shrink-0 rounded-full ${COLOR_META[color].swatch}`} />
);

type ColorFilterProps = {
  value: UnsplashColor | undefined;
  onChange: (color: UnsplashColor | undefined) => void;
};

export const ColorFilter = ({ value, onChange }: ColorFilterProps) => {
  const handleValueChange = (newValue: string | null) => {
    onChange(UNSPLASH_COLORS.find((c) => c === newValue));
  };

  return (
    <Select.Root value={value ?? ""} onValueChange={handleValueChange}>
      <Select.Trigger className="flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text-secondary backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-text-primary focus:ring-2 focus:ring-brand-400 focus:outline-none data-[popup-open]:bg-white/10">
        {value ? (
          <>
            <ColorSwatch color={value} />
            <Select.Value />
          </>
        ) : (
          <Select.Value placeholder="Filter by color" />
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 text-text-muted"
        >
          <path
            fillRule="evenodd"
            d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={8} className="z-50">
          <Select.Popup className="overflow-hidden rounded-xl border border-white/10 bg-surface-1 py-1 shadow-xl backdrop-blur-xl transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <Select.List>
              <Select.Item
                value=""
                className="flex cursor-default items-center gap-2.5 px-3 py-2 text-sm text-text-muted hover:bg-surface-3 data-[highlighted]:bg-surface-3"
              >
                <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-dashed border-text-muted" />
                <Select.ItemText>Any color</Select.ItemText>
                <Select.ItemIndicator className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-brand-500">
                    <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>

              <div className="my-1 border-t border-white/10" />

              {UNSPLASH_COLORS.map((color) => (
                <Select.Item
                  key={color}
                  value={color}
                  className="flex cursor-default items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-surface-3 data-[highlighted]:bg-surface-3"
                >
                  <ColorSwatch color={color} />
                  <Select.ItemText>{COLOR_META[color].label}</Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-brand-500">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
