import { describe, expect, it } from "vitest";
import { entranceFrames, motionTokens, sheetFrames } from "@/lib/motion";

describe("shared motion rules", () => {
  it("uses the requested entrance easing", () => { expect(motionTokens.easing.entrance).toEqual([0.16, 1, 0.3, 1]); });
  it("uses the requested transition easing", () => { expect(motionTokens.easing.transition).toEqual([0.76, 0, 0.24, 1]); });
  it("uses 120/18 for soft springs", () => { expect(motionTokens.spring.soft).toMatchObject({ stiffness: 120, damping: 18 }); });
  it("uses 300/24 for snappy springs", () => { expect(motionTokens.spring.snappy).toMatchObject({ stiffness: 300, damping: 24 }); });
  it("uses 150ms micro motion", () => { expect(motionTokens.duration.micro).toBe(0.15); });
  it("uses 350ms standard motion", () => { expect(motionTokens.duration.standard).toBe(0.35); });
  it("uses 700ms entrances", () => { expect(motionTokens.duration.entrance).toBe(0.7); });
  it("uses 1100ms hero motion", () => { expect(motionTokens.duration.hero).toBe(1.1); });
  it("staggers by 60–80ms", () => { expect(motionTokens.stagger).toBeGreaterThanOrEqual(0.06); expect(motionTokens.stagger).toBeLessThanOrEqual(0.08); });
  it("keeps all entrance travel within 16–24px", () => {
    for (const frames of [entranceFrames, sheetFrames]) { expect(frames.y[0]).toBeGreaterThanOrEqual(16); expect(frames.y[0]).toBeLessThanOrEqual(24); expect(frames.y[1]).toBe(0); }
  });
  it("only animates transform and opacity on entrance", () => { expect(Object.keys(entranceFrames)).toEqual(["opacity", "y"]); expect(Object.keys(sheetFrames)).toEqual(["opacity", "y"]); });
  it("presses to exactly 0.97", () => { expect(motionTokens.scale.press).toBe(0.97); });
});