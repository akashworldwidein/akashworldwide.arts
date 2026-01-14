const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fit screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height =
    window.innerHeight - document.querySelector(".toolbar").offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;
let currentColor = "#000000";
let brushSize = 5;
let isEraser = false;

// Color picker (switch back to brush)
document.getElementById("colorPicker").addEventListener("change", (e) => {
  currentColor = e.target.value;
  isEraser = false;
});

// Brush / eraser size
document.getElementById("brushSize").addEventListener("input", (e) => {
  brushSize = e.target.value;
});

// Clear canvas
document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
});

// Eraser button
document.getElementById("eraser").addEventListener("click", () => {
  isEraser = true;
});

// Save / Download drawing
document.getElementById("save").addEventListener("click", () => {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = `drawing-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Touch Events (Mobile)
canvas.addEventListener("touchstart", (e) => {
  drawing = true;
  ctx.beginPath();
  drawTouch(e);
});

canvas.addEventListener("touchmove", drawTouch);

canvas.addEventListener("touchend", () => {
  drawing = false;
  ctx.beginPath();
});

// Mouse Events (Desktop support)
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  drawLine(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});

// Draw for touch
function drawTouch(e) {
  if (!drawing) return;

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  drawLine(x, y);
  e.preventDefault();
}

// Common draw function
function drawLine(x, y) {
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";

  if (isEraser) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = currentColor;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}
