import { canvasFactory, clear } from "./utils.js";
import { RGBA } from "./colors.js";
import { CellGrid } from "./life.js";


const GRID_SIZE = 800;
// const GRID_SIZE = 500;

const canvas = canvasFactory({
    width: GRID_SIZE,
    height: GRID_SIZE,
    appendTo: document.body
});

const ctx = canvas.getContext('2d');
const fbo = ctx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);

const grid = new CellGrid(GRID_SIZE, GRID_SIZE, true, { deadColor: new RGBA(0,0,100).irgba });

grid.seed();


let lastTime = 0;
let elapsedTime = 0;
requestAnimationFrame(function update(time) {
    
    const deltatime = time - lastTime;
    lastTime = time;
    elapsedTime = elapsedTime + deltatime;

    
    if (elapsedTime < 1000/2) {
        requestAnimationFrame(update);
        return;
    }
    
    elapsedTime = 0;
    
    
    
    grid.nextGen();
    
    grid.render(fbo);
    
    ctx.putImageData(fbo, 0, 0);

    requestAnimationFrame(update);
});
