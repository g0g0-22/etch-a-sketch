const container = document.querySelector('#container');
const resetButton = document.getElementById('reset');
const DIMENSIONS = 16;
let isDrawing = false;

function drawDisplay() {
    container.innerHTML = '';
  for (let i = 0; i < DIMENSIONS * DIMENSIONS; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.width = `${100 / DIMENSIONS}%`;
    pixel.style.height = `${100 / DIMENSIONS}%`;

    // Start drawing on pointer down
    pixel.addEventListener('pointerdown', () => {
      isDrawing = true;
      pixel.classList.add('active');
    });

    // Draw on pointer move if in drawing mode
    pixel.addEventListener('pointerover', () => {
      if (isDrawing) {
        pixel.classList.add('active');
      }
    });

    container.appendChild(pixel);
  }
}

// Listen for pointer up on the window so that drawing stops even if the pointer leaves the grid.
window.addEventListener('pointerup', () => {
  isDrawing = false;
});


drawDisplay();

resetButton.addEventListener('click', drawDisplay);

