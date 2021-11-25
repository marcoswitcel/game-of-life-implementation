import { RGBA } from "./colors.js";
import { mulberry32 } from "./prng.js";
import { canvasFactory } from "./utils.js";

// const NUMBER_OF_NEIGHBOURS = Symbol('Cell.numberOfNeighbours');

export class Cell {
    constructor(alive = 0, t = null, tr = null, r = null, br = null, b = null, bl = null, l = null, tl = null) {
        this.temp =  0,
        this.alive =  alive,
        // Vizinhas
        this.t  = t;
        this.tr = tr;
        this.r  = r;
        this.br = br;
        this.b  = b;
        this.bl = bl;
        this.l  = l;
        this.tl = tl;
    }

    static from({ alive = 0, t = null, tr = null, r = null, br = null, b = null, bl = null, l = null, tl = null }) {
        return new Cell(alive, t, tr, r, br, b, bl, l, tl)
    }

    /**
     * 
     * @param {Cell[]} cells 
     */
    static swap(cells) {
        for (const cell of cells) {
            cell.alive = cell.temp;
        }
    }

    /**
     * 
     * @param {Cell[]} cells 
     */
    static computeNextGenState(cells) {
        /**
         * @note Regras:
         * Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure[1]).
         * Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).
         * Any live cell with two or three live neighbours lives, unchanged, to the next generation.
         * Any dead cell with exactly three live neighbours will come to life.
         * 
         * @url fonte: https://www.conwaylife.com/wiki/Conway%27s_Game_of_Life
         */
        for (const cell of cells) {
            const numberOfNeighbours = cell.numberOfNeighboursAlive();
    
            if (cell.alive === 0) {
                if (numberOfNeighbours === 3) {
                    cell.temp = 1;
                } else {
                    cell.temp = 0;
                }                
            } else {
                if (numberOfNeighbours === 2 || numberOfNeighbours === 3) {
                    cell.temp = 1;
                } else {
                    cell.temp = 0;
                }
            }
        }
    }

    computeNextGenState() {
        const numberOfNeighbours = this.numberOfNeighboursAlive();

        if (this.alive && (numberOfNeighbours === 2 || numberOfNeighbours === 3)) {
            this.temp = 1;
        } else if (numberOfNeighbours === 3) {
            this.temp = 1;
        } else {
            this.temp = 0;
        }
    }

    /**
     * 
     * @returns {Number} Retorna o número de vizinhos vivos
     */
    numberOfNeighboursAlive() {
        return (
            this.t.alive +
            this.tr.alive +
            this.r.alive +
            this.br.alive +
            this.b.alive +
            this.bl.alive +
            this.l.alive +
            this.tl.alive
        );
    }
}

export class CellGrid {
    constructor(gridWidth, gridHeight, autoInit = false, autoSeed = null, options = {}) {
        /** @const */
        this.WIDTH = gridWidth;
        /** @const */
        this.HEIGHT = gridHeight;

        this.grid = Array(gridWidth * gridHeight)
            .fill(null)
            .map(() => new Cell);

        if (autoInit) {
            this.init();
        }
        if (autoSeed) {
            this.seed(autoSeed);
        }

        this.generation = 0;

        this.deadColor = options.deadColor ? options.deadColor.irgba : new RGBA(50, 50, 50).irgba;
        this.aliveColor = options.aliveColor ? options.aliveColor.irgba : new RGBA(100, 100, 100).irgba;

        this.deadColor |= 0;
        this.aliveColor |= 0;
    }

    /**
     * 
     */
    init() {
        const grid = this.grid;

        const FIRST_CELL_OF_THE_LINE = 0;
        const LAST_CELL_OF_THE_LINE = this.WIDTH - 1;
        const FIRST_LINE = 0;
        const LAST_LINE = this.HEIGHT - 1;

        for (let x = this.WIDTH; x--;) {
            for (let y = this.HEIGHT; y--;) {
                const JUMPED_LINES = y * this.WIDTH;
                const cell = grid[JUMPED_LINES + x];

                const RIGHT = (x < LAST_CELL_OF_THE_LINE) ? x + 1 : FIRST_CELL_OF_THE_LINE;
                const LEFT = (x > FIRST_CELL_OF_THE_LINE) ? x - 1 : LAST_CELL_OF_THE_LINE;
                const TOP = (y > FIRST_LINE) ? y - 1 : LAST_LINE;
                const BOTTOM = (y < LAST_LINE) ? y + 1 : FIRST_LINE; 

                // left , right
                cell.l = grid[JUMPED_LINES + LEFT];
                cell.r = grid[JUMPED_LINES + RIGHT];
                // top , bottom
                cell.t = grid[TOP * this.WIDTH + x];
                cell.b = grid[BOTTOM * this.WIDTH + x];
                // top-right
                cell.tr = grid[TOP * this.WIDTH + RIGHT];
                // bottom-right
                cell.br = grid[BOTTOM * this.WIDTH + RIGHT];
                // bottom-left
                cell.bl = grid[BOTTOM * this.WIDTH + LEFT];
                // top-left
                cell.tl = grid[TOP * this.WIDTH + LEFT];

            }
        }
    }

    seed(seed) {
        const seeder = mulberry32(seed);
        const grid = this.grid;

        for (let x = this.WIDTH; x--;) {
            for (let y = this.HEIGHT; y--;) {
                const cell = grid[y * this.WIDTH + x];
                
               cell.alive = +(seeder() > 0.8);
            }
        }

        this.generation = 0;
    }

    nextGen() {

        Cell.computeNextGenState(this.grid);
        Cell.swap(this.grid);

        this.generation++;
    }

    /**
     * 
     * @param {ImageData} fbo 
     */
    render(fbo) {

        const deadColor = this.deadColor;
        const aliveColor = this.aliveColor;
        const uint32bitArray =  new Uint32Array(fbo.data.buffer);

        for (let i = this.grid.length; i--;) {
            uint32bitArray[i] = this.grid[i].alive ? aliveColor : deadColor;
        }

    }
}

export class GridDisplay {
    /**
     * @param {CellGrid} cellGrid 
     * @param {HTMLElement} [appendTo] Elemento ao qual o canvas deve ser adicionado,
     * caso não quiser adicionar o canvas ao elemento automaticamente,
     * pode ignorar esse atributo
     */
    constructor(cellGrid, appendTo = null, FPS = 20) {
        /** @const @type {CellGrid} */
        this.cellGrid = cellGrid;
        /** @const @type {HTMLCanvasElement} */
        this.canvas = canvasFactory({
            width: cellGrid.WIDTH,
            height: cellGrid.HEIGHT,
            pixelated: true,
            appendTo: appendTo
        });

        this.FPS = 1000/FPS;

        this.ctx = this.canvas.getContext('2d');
        this.fbo = this.ctx.getImageData(0, 0, cellGrid.WIDTH, cellGrid.HEIGHT);
        /** @type {'paused'|'running'|'not-started'} */
        this.state = 'not-started';
    }

    start() {
        if (this.state === 'not-started' || this.state === 'paused') {
            this.state = 'running';
            let lastTime = 0;
            let elapsedTime = 0;

            const update = (time) => {
                if (this.state === 'paused') return;

                const deltatime = time - lastTime;
                lastTime = time;
                elapsedTime = elapsedTime + deltatime;
    
                
                if (elapsedTime < this.FPS) {
                    requestAnimationFrame(update);
                    return;
                }
                
                elapsedTime = 0;
                
                // console.time('asd');
                this.cellGrid.nextGen();
                // console.timeEnd('asd');
                this.cellGrid.render(this.fbo);
                this.ctx.putImageData(this.fbo, 0, 0);
    
                requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        }

    }

    stop() {
        if (this.state === 'running') {
            this.state = 'paused';
        }
    }
}