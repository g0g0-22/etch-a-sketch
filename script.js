const container = document.querySelector('#container');
const resetButton = document.getElementById('reset');
const eraser = document.getElementById('eraser');
const eraserTopBox = document.getElementById('light');
const gridSizeButton = document.getElementById('grid-size');

let DIMENSIONS = 64;
let isDrawing = false;
let color = 'black';
let grid = true;
let activeEraser = false;
let previousColor = null;
let pixelGrid = [];


gridSizeButton.addEventListener('click', () => {
  let newSize = prompt("Enter your desired height/widht!");
  if (newSize === null || newSize.trim() === "") return;

  newSize = parseInt(newSize);
  if(isNaN(newSize) || newsize<=0) return;
  if(newSize>100) DIMENSIONS=100;
  
  DIMENSIONS = newSize;
  drawDisplay(); 
})
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
  //Re-selects previously active color selector.
  if(!activeEraser){
    const previousColorSelector = document.getElementById(previousColor);
    previousColorSelector.classList.toggle('active');
  }
  else{//Removes active class from all color selectors.
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
function plotPixel(x,y) {
  pixelGrid[y][x].element.classList.remove('black', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'gray');
  pixelGrid[y][x].element.classList.add(color);
  pixelGrid[y][x].color = color;
}

function drawLineVertical(x0,y0,x1,y1){

  if(y0>y1){
      [x0, x1] = [x1, x0];
      [y0, y1] = [y1, y0];
  }

  let dx = x1 - x0;
  let dy = y1 - y0;
  let dir = (dx < 0 ? -1 : 1);
  dx*=dir;
  let pixels = [];
  if(dy!=0){
      let x = x0;
      let p = 2*dx-dy;
      for(let i = 0; i<=dy; i++){
          plotPixel(x, y0+i);
          if(p>=0){
              x+=dir; 
              p-=2*dy
          }
          p+=2*dx;
      }
  }
}

function drawLineHorizontal(x0,y0,x1,y1){

  if(x0>x1){
      [x0, x1] = [x1, x0];
      [y0, y1] = [y1, y0];
  }

  let dx = x1 - x0;
  let dy = y1 - y0;
  let dir = (dy < 0 ? -1 : 1);
  dy*=dir;
  if(dx!=0){
      let y = y0;
      let p = 2*dy-dx;
      for(let i = 0; i<=dx; i++){
          plotPixel(x0+i,y);
          if(p>=0){
              y+=dir;
              p-=2*dx
          }
          p+=2*dy;
      }
  }
}

function drawLine(x0,y0,x1,y1){
  if(Math.abs(x1-x0)>Math.abs(y1-y0))
      drawLineHorizontal(x0,y0,x1,y1)
  else
      drawLineVertical(x0,y0,x1,y1);
}

//creates a 2D array representing the grid.
function createPixelGrid() {
  pixelGrid = [];
  for(let y = 0; y < DIMENSIONS; y++){
    let row = [];
    for(let x = 0; x < DIMENSIONS; x++){
      row.push({x,y,color: null, element: null});
    }
    pixelGrid.push(row);
  }
}

//Draws the display, creates the pixels and adds event listeners.
function drawDisplay() {
  console.log("drawDisplay() is running!")
  container.innerHTML = '';
  pixelGrid = [];
  for(let y = 0; y < DIMENSIONS; y++ ){
    pixelGrid[y] = [];

    for (let x = 0; x < DIMENSIONS ; x++) {

      const pixel = document.createElement('div');
      pixel.classList.add('pixel');
      pixel.dataset.x = x;
      pixel.dataset.y = y;
      pixel.style.width = `${100 / DIMENSIONS}%`;
      pixel.style.height = `${100 / DIMENSIONS}%`;
      //pixel.textContent = `x=${x}, y=${y}`;


      if(!grid) pixel.classList.add('no-grid');
      
      pixelGrid[y][x] = {x,y,color:null,element:pixel}

      // Start drawing on pointer down
      pixel.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        isDrawing = true;
        let x = parseInt(pixel.dataset.x);
        let y = parseInt(pixel.dataset.y);
        plotPixel(x,y);
        lastPixel = {x,y};
      });

      // Draw on pointer move if in drawing mode
      pixel.addEventListener('pointerenter', (e) => {
        e.preventDefault();
        if (isDrawing) {
          let x = parseInt(pixel.dataset.x);
          let y = parseInt(pixel.dataset.y);
          if (lastPixel) {
            drawLine(lastPixel.x, lastPixel.y, x, y); 
          }
          lastPixel = { x, y }; 
        }
      });
      container.appendChild(pixel);
    }
  }
}



// Listen for pointer up on the window so that drawing stops even if the pointer leaves the grid.
window.addEventListener('pointerup', () => {
  isDrawing = false;
  lastPixel = null;
});


drawDisplay();
resetButton.addEventListener('click', drawDisplay);

