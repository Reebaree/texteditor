const canvas = document.getElementById('textCanvas');
const ctx = canvas.getContext('2d');

let textObjects = [];
let redoStack = [];
let isDragging = false;
let draggedText = null;
let offsetX, offsetY;
let editingTextIndex = -1; // Track the index of the text being edited

// Get toolbar elements
const addTextBtn = document.getElementById('addTextBtn');
const fontSizeInput = document.getElementById('fontSize');
const fontStyleInput = document.getElementById('fontStyle');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

// Draw the canvas and text objects
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    textObjects.forEach(obj => {
        ctx.font = `${obj.fontSize}px ${obj.fontStyle}`;
        ctx.fillText(obj.text, obj.x, obj.y);
    });
}

// Add a default text object to the canvas when "Add Text" is clicked
addTextBtn.addEventListener('click', () => {
    const newText = {
        text: "New Text", // Default text
        x: 50, // Default position
        y: 50, // Default position
        fontSize: parseInt(fontSizeInput.value),
        fontStyle: fontStyleInput.value
    };
    textObjects.push(newText);
    saveState();
    drawCanvas();
});

// Save the current state to enable undo/redo
function saveState() {
    redoStack = [];
    // Add logic for saving state (e.g., deep copy of textObjects)
}

// Handle canvas click to enter edit mode
canvas.addEventListener('click', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if we clicked on any text object
    textObjects.forEach((obj, index) => {
        const textWidth = ctx.measureText(obj.text).width;
        const textHeight = obj.fontSize; // Approximate height of the text
        if (mouseX >= obj.x && mouseX <= obj.x + textWidth && mouseY <= obj.y && mouseY >= obj.y - textHeight) {
            // Set the index of the currently edited text
            editingTextIndex = index;
            enterEditMode(obj);
        }
    });
});

// Create an input element for editing text
function enterEditMode(textObj) {
    if (document.querySelector('input.editing')) {
        return; // Prevent multiple inputs from being created
    }

    const input = document.createElement('input');
    input.value = textObj.text;
    input.style.fontSize = `${textObj.fontSize}px`;
    input.style.fontFamily = textObj.fontStyle;
    input.style.position = 'absolute';
    input.style.top = `${textObj.y}px`;
    input.style.left = `${textObj.x}px`;
    input.className = 'editing';
    canvas.parentElement.appendChild(input); // Append to a parent element for proper positioning

    input.focus();

    input.addEventListener('blur', () => {
        textObj.text = input.value;
        editingTextIndex = -1; // Reset editing index
        drawCanvas();
        canvas.parentElement.removeChild(input); // Remove the input element
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur(); // Trigger blur on Enter key
        }
    });
}

// Implement undo/redo functionalities
undoBtn.addEventListener('click', () => {
    // Implement undo logic
});

redoBtn.addEventListener('click', () => {
    // Implement redo logic
});


// Undo function
undoBtn.addEventListener('click', () => {
    if (textObjects.length > 0) {
        redoStack.push(textObjects.pop());
        drawCanvas();
    }
});

// Redo function
redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        textObjects.push(redoStack.pop());
        drawCanvas();
    }
});

// Save the current state for undo/redo
function saveState() {
    redoStack = []; // Clear the redo stack after each new action
}

// Handle text dragging
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if we clicked on any text object
    textObjects.forEach((obj, index) => {
        const textWidth = ctx.measureText(obj.text).width;
        const textHeight = obj.fontSize; // Approximate height of the text
        if (mouseX >= obj.x && mouseX <= obj.x + textWidth && mouseY <= obj.y && mouseY >= obj.y - textHeight) {
            isDragging = true;
            draggedText = index;
            offsetX = mouseX - obj.x;
            offsetY = mouseY - obj.y;
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && draggedText !== null) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Move the selected text to the new position
        textObjects[draggedText].x = mouseX - offsetX;
        textObjects[draggedText].y = mouseY - offsetY;
        drawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        draggedText = null;
    }
});

// Draw the initial empty canvas
drawCanvas();

