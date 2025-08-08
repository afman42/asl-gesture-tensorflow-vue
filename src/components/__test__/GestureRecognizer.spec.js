import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import GestureRecognizer from "../GestureRecognizer.vue";

// ===================================================================
// ## 1. MOCKING MODULES
// We mock our own services to isolate the component.
// ===================================================================
vi.mock("@/services/handGestureService", () => ({
  createHandLandmarker: vi.fn(),
  detectHands: vi.fn(),
}));

vi.mock("@/services/gestureClassifier", () => ({
  recognizeGesture: vi.fn(),
}));

// We mock the MediaPipe library to provide necessary constants.
vi.mock("@mediapipe/tasks-vision", () => ({
  HandLandmarker: {
    HAND_CONNECTIONS: [], // Dummy value for drawing connectors
  },
}));

// ===================================================================
// ## 2. MOCKING BROWSER APIs
// The most important fix is here. We create a fake webcam API.
// ===================================================================
// Define a mock for the mediaDevices API
const mockMediaDevices = {
  getUserMedia: vi.fn(async () => {
    // Return a promise that resolves, simulating the user allowing camera access
    return Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }], // Mock the stream object
    });
  }),
};

// Use `beforeEach` to ensure our mocks are reset before each test
beforeEach(() => {
  // Reset mock history before each test
  vi.clearAllMocks();

  // Attach the mock to the global `navigator` object
  // Vitest runs in an environment where `navigator` exists but `mediaDevices` might not.
  Object.defineProperty(window.navigator, "mediaDevices", {
    writable: true,
    value: mockMediaDevices,
  });
});

// ===================================================================
// ## 3. THE TESTS
// ===================================================================
describe("GestureRecognizer.vue", () => {
  it("renders the initial loading state correctly", () => {
    const wrapper = mount(GestureRecognizer);
    expect(wrapper.find(".status-box").text()).toContain(
      "Loading Hand Landmark model...",
    );
  });

  it("calls initialization functions on mount", async () => {
    // We need to import the service to check if its functions were called
    const handGestureService = await import("@/services/handGestureService");

    mount(GestureRecognizer);

    // Check that our startup functions were called when the component was mounted
    expect(handGestureService.createHandLandmarker).toHaveBeenCalled();
    expect(window.navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
  });

  it("displays a detected gesture name after the app is ready", async () => {
    const wrapper = mount(GestureRecognizer);

    // Simulate the component becoming ready
    wrapper.vm.isModelLoaded = true;
    wrapper.vm.isWebcamReady = true;
    await wrapper.vm.$nextTick(); // Wait for Vue to process the state change

    // Simulate a gesture being detected and updating the state
    wrapper.vm.recognizedGesture = "Victory";
    await wrapper.vm.$nextTick(); // Wait for the DOM to update with the new gesture

    const gestureSpan = wrapper.find(".gesture-output span");
    expect(gestureSpan.text()).toBe("Victory");
  });
});
