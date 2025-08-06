import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let handLandmarker = undefined;
let runningMode = "VIDEO"; // Can be 'IMAGE' or 'VIDEO'

// A wrapper function to create and initialize the HandLandmarker
export const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "CPU", //CPU (device spec kentang) | GPU (device spec non kentang)
    },
    runningMode: runningMode,
    numHands: 2, // Max number of hands to detect
  });

  console.log("HandLandmarker model loaded.");
};

// The main function to detect hands from a video frame
export const detectHands = (videoElement, lastVideoTime) => {
  if (!handLandmarker) {
    console.log("HandLandmarker is not initialized yet.");
    return null;
  }

  const startTimeMs = performance.now();
  if (videoElement.currentTime !== lastVideoTime) {
    // The core detection logic
    const results = handLandmarker.detectForVideo(videoElement, startTimeMs);
    return results;
  }
  return null;
};
