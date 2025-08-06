import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

// --- Static ASL Alphabet Gestures --- //

// Note: J and Z are dynamic gestures and cannot be detected with this method.

// LETTER: A
const aGesture = new GestureDescription("A");
// Thumb: is stretched out, pointing up
aGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
aGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
aGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9);
aGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9);
// All other fingers: are fully curled in a fist
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  aGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  aGesture.addDirection(finger, FingerDirection.VerticalUp, 1.0);
}

// LETTER: B
const bGesture = new GestureDescription("B");
// All fingers: are straight and pointing up
for (let finger of Finger.all) {
  bGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  bGesture.addDirection(finger, FingerDirection.VerticalUp, 1.0);
}
// Thumb: is slightly curled and crosses the palm
bGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
bGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
bGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// LETTER: C
const cGesture = new GestureDescription("C");
// All fingers are half-curled to form a 'C' shape
for (let finger of Finger.all) {
  cGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
  cGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9);
  cGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9);
}

// LETTER: D
const dGesture = new GestureDescription("D");
// Index finger: is straight and pointing up
dGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
dGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
// Other fingers: are curled and touch the Thumb
for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
  dGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}
dGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);

// LETTER: E
const eGesture = new GestureDescription("E");
// All fingers are fully curled, Thumb is tucked in
for (let finger of Finger.all) {
  eGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  eGesture.addDirection(finger, FingerDirection.VerticalUp, 0.9);
  eGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 1.0);
  eGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 1.0);
}

// LETTER: F
const fGesture = new GestureDescription("F");
// Index finger touches the Thumb to form a circle
fGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
// Other fingers are straight and pointing up
for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
  fGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  fGesture.addDirection(finger, FingerDirection.VerticalUp, 1.0);
}

// LETTER: I
const iGesture = new GestureDescription("I");
// Pinky is straight and pointing up
iGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
iGesture.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
// Other fingers are curled in a fist
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
  iGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// LETTER: L
const lGesture = new GestureDescription("L");
// Thumb and Index finger are straight
lGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
lGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
// Other fingers are curled
for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
  lGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// LETTER: O
const oGesture = new GestureDescription("O");
// All fingers are half-curled, forming a circle
for (let finger of Finger.all) {
  oGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
}

// LETTER: S
const sGesture = new GestureDescription("S");
// All fingers are fully curled into a fist, Thumb is in front
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  sGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}
sGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

// LETTER: U
const uGesture = new GestureDescription("U");
// Index and Middle fingers are straight and together
uGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
uGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
uGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
uGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
// Other fingers are curled
for (let finger of [Finger.Ring, Finger.Pinky]) {
  uGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// LETTER: V
const vGesture = new GestureDescription("V");
// Index and Middle fingers are straight and spread apart (like 'U' but apart)
vGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
vGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.9);
vGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
vGesture.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 0.9);
// Other fingers are curled
for (let finger of [Finger.Ring, Finger.Pinky]) {
  vGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// LETTER: W
const wGesture = new GestureDescription("W");
// Index, Middle, and Ring fingers are straight
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
  wGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  wGesture.addDirection(finger, FingerDirection.VerticalUp, 1.0);
}
// Pinky and Thumb are curled
wGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// LETTER: Y
const yGesture = new GestureDescription("Y");
// Thumb and Pinky are straight
yGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
yGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
// Other fingers are curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
  yGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// Export all gestures
export const gestures = [
  aGesture,
  bGesture,
  cGesture,
  dGesture,
  eGesture,
  fGesture,
  iGesture,
  lGesture,
  oGesture,
  sGesture,
  uGesture,
  vGesture,
  wGesture,
  yGesture,
];
