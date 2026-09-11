import { describe, expect, it } from "vitest";
import { adjustColor, DEFAULT_ADJUSTMENTS } from "./colorAdjust";

describe("adjustColor", () => {
  it("returns the same color for zero adjustments", () => {
    expect(adjustColor("#3366cc", DEFAULT_ADJUSTMENTS)).toBe("#3366cc");
  });

  it("rotates hue and wraps around 360", () => {
    expect(adjustColor("#ff0000", { ...DEFAULT_ADJUSTMENTS, hue: 120 })).toBe("#00ff00");
    expect(adjustColor("#ff0000", { ...DEFAULT_ADJUSTMENTS, hue: -240 })).toBe("#00ff00");
  });

  it("clamps saturation and lightness to their ranges", () => {
    expect(adjustColor("#ff0000", { ...DEFAULT_ADJUSTMENTS, saturation: -100 })).toBe("#808080");
    expect(adjustColor("#ff0000", { ...DEFAULT_ADJUSTMENTS, lightness: 100 })).toBe("#ffffff");
    expect(adjustColor("#ff0000", { ...DEFAULT_ADJUSTMENTS, lightness: -100 })).toBe("#000000");
  });
});
