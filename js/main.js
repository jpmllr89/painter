// Get the canvas and its 2d context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Default brush color
let currentColor = "#000";
let lineThickness = 5;

// Change the brush color using the color picker
function changeColor() {
  const colorPicker = document.getElementById("colorPicker");
  currentColor = colorPicker.value;
}

// Open the brush thickness popup
function openThicknessPopup() {
  const thicknessPopup = document.getElementById("thicknessPopup");
  thicknessPopup.style.display = "block";
}

// Close the brush thickness popup
function closeThicknessPopup() {
  const thicknessPopup = document.getElementById("thicknessPopup");
  thicknessPopup.style.display = "none";
}

// Change the brush thickness using the slider
function changeThickness() {
  const thicknessSlider = document.getElementById("thicknessSlider");
  lineThickness = thicknessSlider.value;
  ctx.lineCap = "round"; // Set line cap to round for smoother lines
  ctx.lineJoin = "round"; // Set line join to round for smoother corners
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
  ctx.lineWidth = lineThickness;
  ctx.lineCap = "square";
  ctx.strokeStyle = currentColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}
