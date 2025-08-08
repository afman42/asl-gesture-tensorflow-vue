import { describe, it, expect, vi, beforeEach } from "vitest";
import { recognizeGesture } from "./gestureClassifier";

// ===================================================================
// ## THE DEFINITIVE FIX using vi.hoisted()
// ===================================================================

// 1. Use vi.hoisted() to create a variable that can be safely
//    used inside a hoisted vi.mock() call.
const { mockEstimateFn } = vi.hoisted(() => {
  return { mockEstimateFn: vi.fn() };
});

// 2. Now, our mock for fingerpose can safely reference mockEstimateFn
//    because vi.hoisted() ensures it's initialized first.
vi.mock("fingerpose", () => ({
  GestureEstimator: vi.fn().mockImplementation(() => ({
    estimate: mockEstimateFn,
  })),
  GestureDescription: vi.fn().mockImplementation(() => ({
    addCurl: vi.fn(),
    addDirection: vi.fn(),
  })),
  Finger: { all: [] },
  FingerCurl: {},
  FingerDirection: {},
}));

describe("gestureClassifier", () => {
  // We reset our hoisted mock before each test.
  beforeEach(() => {
    mockEstimateFn.mockClear();
  });

  it("should return the name of the gesture with the highest score", () => {
    const mockFingerposeResult = {
      gestures: [
        { name: "V", score: 8.5 },
        { name: "L", score: 9.5 },
      ],
    };
    mockEstimateFn.mockReturnValue(mockFingerposeResult);

    const result = recognizeGesture([{ x: 0, y: 0, z: 0 }]);

    expect(result).toBe("L");
    expect(mockEstimateFn).toHaveBeenCalledTimes(1);
  });

  it("should return null when no gestures meet the confidence score", () => {
    mockEstimateFn.mockReturnValue({ gestures: [] });
    const result = recognizeGesture([{ x: 0, y: 0, z: 0 }]);
    expect(result).toBe(null);
  });

  it("should handle null or empty landmark input gracefully", () => {
    expect(recognizeGesture(null)).toBe(null);
    expect(recognizeGesture([])).toBe(null);
    expect(mockEstimateFn).not.toHaveBeenCalled();
  });
});
