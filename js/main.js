// Get the canvas and its 2d context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Default brush color
let currentColor = "#000";
let lineThickness = 5;
let isFilling = false;

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
  draw(
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop,
    currentColor,
    lineThickness
  );
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    draw(
      e.clientX - canvas.offsetLeft,
      e.clientY - canvas.offsetTop,
      currentColor,
      lineThickness
    );
  }
});

canvas.addEventListener("mouseup", () => {
  isFilling = false;
  isDrawing = false;
  ctx.beginPath();
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
  isFilling = false;
  ctx.beginPath();
});

// Draw on the canvas
function draw(x, y, color, lineWidth) {
  if (isFilling) {
    fill();
    return;
  } else {
    ctx.lineWidth = lineThickness;
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
    button.textContent = `Action: ${action.x}, ${action.y}, ${action.color}, ${action.lineWidth}`;
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

// ... (Your existing code)

// Fill button click handler
function fill() {
  isFilling = true;
  const fillColor = currentColor;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const stack = [{ x: startX, y: startY }];

  while (stack.length) {
    const { x, y } = stack.pop();

    // Check if the current pixel is transparent or not the target color
    if (checkPixel(imageData, x, y, fillColor)) {
      continue;
    }

    // Fill the pixel with the selected color
    setPixel(imageData, x, y, fillColor);

    // Add adjacent pixels to the stack
    stack.push({ x: x + 1, y });
    stack.push({ x: x - 1, y });
    stack.push({ x, y: y + 1 });
    stack.push({ x, y: y - 1 });
  }

  // Update the canvas with the filled region
  ctx.putImageData(imageData, 0, 0);
}

// Check if a pixel needs to be filled
function checkPixel(imageData, x, y, fillColor) {
  const index = (y * imageData.width + x) * 4;
  const currentColor = [
    imageData.data[index],
    imageData.data[index + 1],
    imageData.data[index + 2],
    imageData.data[index + 3],
  ];

  return (
    imageData.data[index + 3] === 0 || // Check if the pixel is transparent
    (currentColor[0] === fillColor[0] &&
      currentColor[1] === fillColor[1] &&
      currentColor[2] === fillColor[2] &&
      currentColor[3] === fillColor[3]) // Check if the pixel is already the target color
  );
}

// Set the color of a pixel
function setPixel(imageData, x, y, fillColor) {
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = fillColor[0];
  imageData.data[index + 1] = fillColor[1];
  imageData.data[index + 2] = fillColor[2];
  imageData.data[index + 3] = fillColor[3];
}
