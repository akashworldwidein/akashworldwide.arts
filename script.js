const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Resize canvas for full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector(".toolbar").offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;
let currentColor = "#000000";
let brushSize = 5;

// Color picker
document.getElementById("colorPicker").addEventListener("change", (e) => {
  currentColor = e.target.value;
});

// Brush size
document.getElementById("brushSize").addEventListener("input", (e) => {
  brushSize = e.target.value;
});

// Clear canvas
document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
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
  draw(e);
});

canvas.addEventListener("touchmove", draw);

canvas.addEventListener("touchend", () => {
  drawing = false;
  ctx.beginPath();
});

// Mouse Events (Optional – Desktop support)
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

// Drawing function for touch
function draw(e) {
  if (!drawing) return;

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  drawLine(x, y);
  e.preventDefault();
}

// Common draw line function
function drawLine(x, y) {
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}
