import * as fp from "fingerpose";
import { gestures } from "./gesture";

// Create a new GestureEstimator
const GE = new fp.GestureEstimator(gestures);

// This function takes the hand landmarks from MediaPipe and returns the best matching gesture.
export const recognizeGesture = (landmarks) => {
  // Make sure we have landmarks
  if (!landmarks || landmarks.length === 0) {
    return null;
  }

  // fingerpose expects landmarks in a specific format (an array of arrays),
  // so we need to convert from MediaPipe's array of objects.
  const formattedLandmarks = landmarks.map((point) => [
    point.x,
    point.y,
    point.z,
  ]);

  // Estimate the gesture with a confidence score of 8.0 or higher
  // You can adjust this score to be more or less strict.
  const gestureEstimates = GE.estimate(formattedLandmarks, 8.0);

  // If any gestures were detected
  if (gestureEstimates.gestures.length > 0) {
    // Find the gesture with the highest confidence score
    const bestGesture = gestureEstimates.gestures.reduce((prev, current) => {
      return prev.score > current.score ? prev : current;
    });

    // Return the name of the best-matching gesture
    return bestGesture.name;
  }

  // If no gesture was detected with high enough confidence
  return null;
};
