
 // Main sketch: setup, draw, interaction

let lotuses = [];
let flowersInBatch = 0;

// Background color range and current background
let bgStart;
let bgEnd;
let bgColor;

// Text globals (used by Text.js)
let bloomColor;
let dynamicTextSize;
let fontNames = ["Gabriela", "Petit Formal Script"];
let currentFont = "Borel";

let overlayFaded = false;

function hideOverlay() {
  if (overlayFaded) return;
  overlayFaded = true;

  const overlay = document.getElementById("startOverlay");
  overlay.style.opacity = 0;          // fade out

  setTimeout(() => {
    overlay.style.display = "none";   // remove from screen
  }, 900);
}

function preload() {
  // from Sound.js
  loadAllSounds();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();

  bgStart = color("#FFFDD3");
  bgEnd = color("#FFE4D8");
  bgColor = lerpColor(bgStart, bgEnd, random());

  // from Text.js
  pickBloomTextColor();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Background color
  background(bgColor);

  // Draw “bloom” + “by Tannistha”
  drawBloomText();

  // Draw all lotuses
  for (let i = 0; i < lotuses.length; i++) {
    lotuses[i].update();
    lotuses[i].display();
  }
}

function mousePressed() {
  hideOverlay();   // fade overlay right away

  // 🔊 unlock audio context on first click
  if (getAudioContext().state !== "running") {
    userStartAudio();
  }
  // 1) Immediate feedback: note + flower
  playRandomNote();        // from Sound.js

  // Create a new lotus at mouse position
  let s = min(width, height) / 600.0;
  let centerRadius = random(30, 40) * s;
  let newLotus = new Lotus(mouseX, mouseY, centerRadius);
  lotuses.push(newLotus);

  flowersInBatch++;
  if (flowersInBatch >= 10) {
    lotuses = [];
    flowersInBatch = 0;
    bgColor = lerpColor(bgStart, bgEnd, random());
  }

  // change text font + color
  currentFont = random(fontNames);
  pickBloomTextColor();

  // 2) Start ambient slightly later so it doesn't block UI
  setTimeout(() => {
    startAmbientMusic();   // from Sound.js
  }, 300); // 300–500 ms feels good
}
