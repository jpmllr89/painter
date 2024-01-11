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

// History to store drawing actions
const history = [];
let historyIndex = -1;

// Undo button click handler
function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    redrawFromHistory();
  }
}

// Redo button click handler
function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    redrawFromHistory();
  }
}

// History list button click handler
function showHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  for (let i = history.length - 1; i >= 0; i--) {
    const action = history[i];
    const button = document.createElement("button");
    button.textContent = `Action ${i + 1}`;
    button.addEventListener("click", () => applyHistoryAction(i));
    historyList.appendChild(button);
  }
}

// Apply a specific action from history
function applyHistoryAction(index) {
  historyIndex = index;
  redrawFromHistory();
}

// Redraw canvas based on the history
function redrawFromHistory() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i <= historyIndex; i++) {
    const action = history[i];
    draw(action.x, action.y, action.color, action.lineWidth);
  }
}

// Update draw function to store actions in history
function draw(x, y, color, lineWidth) {
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "square";
  ctx.strokeStyle = color;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  // Store the action in history
  history.push({ x, y, color, lineWidth });

  // Keep only the last 10 actions in history
  if (history.length > 10) {
    history.shift();
  }

  // Reset historyIndex to the latest action
  historyIndex = history.length - 1;
}
