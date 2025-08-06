<template>
  <div class="recognizer-container">
    <h1>ASL Gesture Recognizer</h1>
    <div v-if="loading" class="loading">Loading Model & Starting Webcam...</div>
    <div v-if="!cameraSupported" class="error">
      Your browser does not support camera access.
    </div>
    <div class="video-container" :style="{ opacity: loading ? 0 : 1 }">
      <video
        ref="video"
        class="video-feed"
        autoplay
        playsinline
        @loadeddata="onVideoLoaded"
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
import { ref, onMounted, onUnmounted } from "vue";
// *** FIX: Import HandLandmarker directly from the library ***
import { HandLandmarker } from "@mediapipe/tasks-vision";
import {
  createHandLandmarker,
  detectHands,
} from "../services/handGestureService";
import { recognizeGesture } from "../services/gestureClassifer";

const video = ref(null);
const canvas = ref(null);
const loading = ref(true);
const recognizedGesture = ref(null);
const cameraSupported = ref(true);

let lastVideoTime = -1;
let animationFrameId = null;

const startWebcam = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      video.value.srcObject = stream;
    } catch (error) {
      console.error("Error accessing webcam: ", error);
      alert(
        "Could not access webcam. Please allow camera permissions and refresh the page.",
      );
    }
  } else {
    cameraSupported.value = false;
  }
};

const loop = async () => {
  if (video.value && video.value.readyState >= 3) {
    const results = detectHands(video.value, lastVideoTime);
    lastVideoTime = video.value.currentTime;

    const ctx = canvas.value.getContext("2d");
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    if (results && results.landmarks) {
      for (const landmarks of results.landmarks) {
        // *** FIX: Use the imported HandLandmarker object directly ***
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

const onVideoLoaded = () => {
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  loop(); // Start the detection loop only after video is loaded
};

onMounted(async () => {
  try {
    await createHandLandmarker();
    await startWebcam();
  } catch (e) {
    console.error("Initialization failed:", e);
    alert("Failed to initialize. Please check the console for details.");
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (video.value && video.value.srcObject) {
    video.value.srcObject.getTracks().forEach((track) => track.stop());
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
.recognizer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  padding: 20px;
}
.loading,
.error {
  font-size: 1.5rem;
  margin-top: 50px;
  color: #555;
}
.video-container {
  position: relative;
  width: 640px;
  height: 480px;
  border: 3px solid #007bff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.video-feed {
  width: 100%;
  height: 100%;
  transform: scaleX(-1); /* Mirror effect */
}
.overlay-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(-1); /* Match the video flip */
}
.gesture-output {
  margin-top: 25px;
  padding: 15px 30px;
  border-radius: 10px;
  background-color: #f0f8ff;
  border: 1px solid #cce5ff;
}
.gesture-output h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}
.gesture-output span {
  color: #007bff;
  font-weight: bold;
  font-size: 2rem;
  min-width: 50px;
  display: inline-block;
  text-align: center;
}
</style>
