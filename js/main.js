// Get the canvas and its 2d context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Default brush color
let currentColor = "#000";

// Change the brush color using the color picker
function changeColor() {
  const colorPicker = document.getElementById("colorPicker");
  currentColor = colorPicker.value;
}

// Event listeners for mouse movements
let isDrawing = false;

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  draw(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    draw(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.beginPath();
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
  ctx.beginPath();
});

// Draw on the canvas
function draw(x, y) {
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}
