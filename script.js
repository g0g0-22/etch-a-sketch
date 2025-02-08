const container = document.querySelector('#container');
const resetButton = document.getElementById('reset');
const DIMENSIONS = 64;
let isDrawing = false;
let color = 'black';

const colorSelectors = document.querySelectorAll('.colorSelectors div');
colorSelectors.forEach((selector) => selector.style.backgroundColor = selector.id);

function drawDisplay() {
  container.innerHTML = '';
  for (let i = 0; i < DIMENSIONS * DIMENSIONS; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.width = `${100 / DIMENSIONS}%`;
    pixel.style.height = `${100 / DIMENSIONS}%`;

    // Start drawing on pointer down
    pixel.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isDrawing = true;
      pixel.classList.add(color);
    });

    // Draw on pointer move if in drawing mode
    pixel.addEventListener('pointerover', (e) => {
      e.preventDefault();
      if (isDrawing) {
        pixel.classList.add(color);
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

