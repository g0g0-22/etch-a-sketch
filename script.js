const container = document.querySelector('#container');
const resetButton = document.getElementById('reset');
const DIMENSIONS = 64;
let isDrawing = false;
let color = 'black';
let grid = true;
let lastpixel = null;
let activeEraser = false;
let previousColor = null;
const eraser = document.getElementById('eraser');
const eraserTopBox = document.getElementById('light');
//Toggles the eraser on and off.
eraser.addEventListener('click', () => {
  activeEraser = !activeEraser;
  if(color !== 'white'){
    previousColor = color;
  }
  if(activeEraser) {
    color = 'white';
  } else {
    color = previousColor;
  }  

  
  //Deselects all color selectors.
  if(!activeEraser){
    const previousColorSelector = document.getElementById(previousColor);
    previousColorSelector.classList.toggle('active');
  }
  else{
    colorSelectors.forEach((selector) => {
      selector.classList.remove('active');
    });
  }
  eraser.classList.toggle('activeEraser');
  eraserTopBox.classList.toggle('activeEraserTopBox');
  
});


//Toggles pixel borders (grid) on and off.
const gridToggle = document.getElementById('gridToggle');
gridToggle.addEventListener('click', () => {
  const gridIcons = gridToggle.querySelectorAll('.gridIconBox');
  gridIcons.forEach((icon) => {
    icon.classList.toggle('active');
  });
  const pixels = document.querySelectorAll('.pixel');
  pixels.forEach((pixel) => {
    pixel.classList.toggle('no-grid');
  });
  grid = !grid;
});

// Selects the color of the pixel.
const colorSelectors = document.querySelectorAll('.colorSelectors div');
colorSelectors.forEach((selector) => {
  selector.style.backgroundColor = selector.id

  selector.addEventListener('click', () => {
    colorSelectors.forEach((selector) => {
      selector.classList.remove('active');
    });
    color = selector.id;
    selector.classList.add('active');
    if(activeEraser) {
      eraser.classList.toggle('activeEraser');
      eraserTopBox.classList.toggle('activeEraserTopBox');
      activeEraser = false;
    }
  });
  
  
  
});

// Updates the color of the pixel.
function updatePixelColor(pixel) {
  pixel.classList.remove('black', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'gray');
  pixel.classList.add(color);
}

//Draws the display, creates the pixels and adds event listeners.
function drawDisplay() {
  container.innerHTML = '';
  for (let i = 0; i < DIMENSIONS * DIMENSIONS; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.width = `${100 / DIMENSIONS}%`;
    pixel.style.height = `${100 / DIMENSIONS}%`;

    if(!grid) {
      pixel.classList.add('no-grid');
    }

    // Start drawing on pointer down
    pixel.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isDrawing = true;
      lastpixel = pixel;
      updatePixelColor(pixel);
    });

    // Draw on pointer move if in drawing mode
    pixel.addEventListener('pointerenter', (e) => {
      e.preventDefault();
      if (isDrawing) {
        updatePixelColor(pixel);
        lastpixel = pixel;
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

