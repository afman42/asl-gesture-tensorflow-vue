<template>
  <div class="recognizer-container">
    <h1>ASL Gesture Recognizer</h1>

    <div v-if="!isReady" class="status-box">
      <div v-if="!isModelLoaded">Loading Hand Landmark model...</div>
      <div v-if="isModelLoaded && !isWebcamReady">
        Please allow camera access.
      </div>
    </div>
    <div v-if="!cameraSupported" class="error">
      Your browser does not support camera access.
    </div>

    <div class="video-container" :style="{ opacity: isReady ? 1 : 0 }">
      <video
        ref="video"
        class="video-feed"
        autoplay
        playsinline
        @canplay="handleWebcamReady"
      ></video>
      <canvas ref="canvas" class="overlay-canvas"></canvas>
    </div>
    <div class="gesture-output">
      <h2>
        Detected Gesture: <span>{{ recognizedGesture || "..." }}</span>
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from "vue";
import { HandLandmarker } from "@mediapipe/tasks-vision";
import {
  createHandLandmarker,
  detectHands,
} from "@/services/handGestureService";
import { recognizeGesture } from "@/services/gestureClassifier";

// --- Reactive State (No changes here) ---
const video = ref(null);
const canvas = ref(null);
const recognizedGesture = ref(null);
const cameraSupported = ref(true);
const isModelLoaded = ref(false);
const isWebcamReady = ref(false);
const isReady = computed(() => isModelLoaded.value && isWebcamReady.value);
let animationFrameId = null;

// --- Core Logic ---

// 1. Initialize the HandLandmarker model
const initModel = async () => {
  try {
    await createHandLandmarker();
    isModelLoaded.value = true;
    console.log("HandLandmarker model is loaded.");
  } catch (e) {
    console.error("Failed to load model:", e);
    alert("Failed to load the recognition model. Please check the console.");
  }
};

// 2. Start the webcam
const startWebcam = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      video.value.srcObject = stream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert(
        "Could not access webcam. Please allow camera permissions and refresh.",
      );
    }
  } else {
    cameraSupported.value = false;
  }
};

// 3. This function is called by the video element's @canplay event
const handleWebcamReady = () => {
  console.log("Webcam is ready.");
  isWebcamReady.value = true;
};

// 4. The main detection loop
const loop = async () => {
  if (video.value && canvas.value) {
    // Set canvas dimensions once
    if (canvas.value.width !== video.value.videoWidth) {
      canvas.value.width = video.value.videoWidth;
      canvas.value.height = video.value.videoHeight;
    }

    const results = detectHands(video.value); // lastVideoTime is handled inside the service in this simplified version
    const ctx = canvas.value.getContext("2d");
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    if (results && results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(ctx, landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 2 });
        const gesture = recognizeGesture(landmarks);
        recognizedGesture.value = gesture;
      }
    }
  }
  animationFrameId = requestAnimationFrame(loop);
};

// --- Lifecycle Hooks ---

onMounted(() => {
  initModel();
  startWebcam();
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (video.value && video.value.srcObject) {
    video.value.srcObject.getTracks().forEach((track) => track.stop());
  }
});

// NEW: This `watchEffect` is the key to the robust startup.
// It will only run the `loop()` function when `isReady` becomes true.
watchEffect(() => {
  if (isReady.value) {
    console.log("Model and Webcam are ready. Starting detection loop.");
    loop();
  }
});

// Drawing utility functions
function drawConnectors(ctx, landmarks, connections, style) {
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.lineWidth;
  for (const connection of connections) {
    const start = landmarks[connection.start];
    const end = landmarks[connection.end];
    if (start && end) {
      ctx.beginPath();
      ctx.moveTo(start.x * canvas.value.width, start.y * canvas.value.height);
      ctx.lineTo(end.x * canvas.value.width, end.y * canvas.value.height);
      ctx.stroke();
    }
  }
}

function drawLandmarks(ctx, landmarks, style) {
  ctx.fillStyle = style.color;
  for (const landmark of landmarks) {
    if (landmark) {
      ctx.beginPath();
      ctx.arc(
        landmark.x * canvas.value.width,
        landmark.y * canvas.value.height,
        style.lineWidth * 2,
        0,
        2 * Math.PI,
      );
      ctx.fill();
    }
  }
}
</script>

<style scoped>
/* --- Base & Mobile-First Styles --- */
.recognizer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  padding: 1rem;
  width: 100%;
  max-width: 1200px; /* Max width for very large screens */
  margin: 0 auto;
  box-sizing: border-box;
}

/* Fluid Typography using clamp(MIN, PREFERRED, MAX) */
h1 {
  /* Font size will be 4.5vw, but won't go below 1.5rem or above 2.5rem */
  font-size: clamp(1.5rem, 4.5vw, 2.5rem);
  text-align: center;
  margin-bottom: 1rem;
}

.status-box,
.error {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  margin-top: 2rem;
  color: #555;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  text-align: center;
}

/* --- THE CORE RESPONSIVE VIDEO TRICK --- */
.video-container {
  position: relative;
  width: 100%;
  max-width: 640px; /* Max width on larger screens */
  margin: 0 auto; /* Center the container */

  /* Aspect Ratio Box: 4:3 Aspect Ratio (480 / 640 = 0.75) */
  height: 0;
  padding-top: 75%;

  border: 3px solid #007bff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #000;
}

.video-feed,
.overlay-canvas {
  /* Position both video and canvas to fill the aspect-ratio box */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(-1); /* Mirror effect */
}

.gesture-output {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  background-color: #f0f8ff;
  border: 1px solid #cce5ff;
}

.gesture-output h2 {
  margin: 0;
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  color: #333;
  text-align: center;
}

.gesture-output span {
  color: #007bff;
  font-weight: bold;
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  min-width: 50px;
  display: inline-block;
  text-align: center;
}

/* --- Media Queries for Larger Screens (Tablets and Desktops) --- */

/* For tablets and larger devices */
@media (min-width: 768px) {
  .recognizer-container {
    padding: 2rem;
  }

  .video-container {
    /* Allow the video to be a bit larger on tablets */
    max-width: 700px;
  }
}

/* For desktops */
@media (min-width: 1024px) {
  .video-container {
    /* On desktops, we can cap it at a larger size */
    max-width: 800px;
  }
}
</style>
