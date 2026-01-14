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
let brushSize = 5;
let currentColor = "#000000";
let isEraser = false;

/* ========= CONTROLS ========= */

// Color picker → Brush mode
document.getElementById("colorPicker").addEventListener("input", (e) => {
  currentColor = e.target.value;
  isEraser = false;
});

// Brush size
document.getElementById("brushSize").addEventListener("input", (e) => {
  brushSize = e.target.value;
});

// Clear
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
  link.href = canvas.toDataURL("image/png");
  link.download = `drawing-${Date.now()}.png`;
  link.click();
});

/* ========= DRAW LOGIC ========= */

function startDraw(x, y) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(x, y) {
  if (!drawing) return;

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
}

function stopDraw() {
  drawing = false;
  ctx.beginPath();
}

/* ========= TOUCH EVENTS (MOBILE) ========= */

canvas.addEventListener("touchstart", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  startDraw(
    touch.clientX - rect.left,
    touch.clientY - rect.top
  );
  e.preventDefault();
});

canvas.addEventListener("touchmove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  draw(
    touch.clientX - rect.left,
    touch.clientY - rect.top
  );
  e.preventDefault();
});

canvas.addEventListener("touchend", stopDraw);

/* ========= MOUSE EVENTS (DESKTOP) ========= */

canvas.addEventListener("mousedown", (e) => {
  startDraw(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  draw(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);
