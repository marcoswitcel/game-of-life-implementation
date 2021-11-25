import { RGBA } from "./colors.js";
import { CellGrid, GridDisplay } from "./life.js";
import { setPageTitle } from "./utils.js";

const GRID_SIZE = 650;
const FPS = 30;

const defaultDeadColor = new RGBA(0,0,100);
const defaultAliveColor = new RGBA(100, 100, 100);
const seed = (15210 + Math.random() * 15275) | 0;

const cellGrid = new CellGrid(GRID_SIZE, GRID_SIZE, true, seed, { deadColor: defaultDeadColor, aliveColor: defaultAliveColor });
const display = new GridDisplay(cellGrid, null,FPS);
// const canvas = display.canvas;
// const ctx = canvas.getContext('2d');
// const fbo = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);


// setPageTitle('Game of Life');

const elementContainer = document.getElementById('canvasWrapper');
/** @type {HTMLInputElement} */ //@ts-expect-error
const backgroundColorInput = document.getElementById('backgroundColorInput');
/** @type {HTMLInputElement} */ //@ts-expect-error
const cellColorInput = document.getElementById('cellColorInput');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');

backgroundColorInput.value = defaultDeadColor.toHexString();
cellColorInput.value = defaultAliveColor.toHexString();


backgroundColorInput.addEventListener('change', (_) => {
    cellGrid.deadColor = RGBA.fromString(backgroundColorInput.value).irgba;
})
cellColorInput.addEventListener('change', (_) => {
    cellGrid.aliveColor = RGBA.fromString(cellColorInput.value).irgba;
    RGBA.fromString(cellColorInput.value);
})

playButton.addEventListener('click', (event) => {
    elementContainer.appendChild(display.canvas);
    display.start();
    setPageTitle('Running - Game of Life');
});

pauseButton.addEventListener('click', (event) => {
    display.stop();
    setPageTitle('Paused - Game of Life');
});
