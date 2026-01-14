const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Resize canvas
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

// Color picker = Brush mode
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
});

// Eraser
document.getElementById("eraser").addEventListener("click", () => {
  isEraser = true;
});

// Save
document.getElementById("save").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `drawing-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

/* =========================
   TOUCH EVENTS (MOBILE)
========================= */
canvas.addEventListener("touchstart", (e) => {
  drawing = true;
  ctx.beginPath();

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.moveTo(
    touch.clientX - rect.left,
    touch.clientY - rect.top
  );

  e.preventDefault();
});

canvas.addEventListener("touchmove", (e) => {
  if (!drawing) return;

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  drawLine(
    touch.clientX - rect.left,
    touch.clientY - rect.top
  );

  e.preventDefault();
});

canvas.addEventListener("touchend", () => {
  drawing = false;
  ctx.beginPath();
});

/* =========================
   MOUSE EVENTS (DESKTOP)
========================= */
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

/* =========================
   DRAW FUNCTION
========================= */
function drawLine(x, y) {
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";

  if (isEraser) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = currentColor;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.moveTo(x, y);
}
