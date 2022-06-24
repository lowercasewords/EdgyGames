class Sudoku {
    canvas = document.getElementById('sudoku-canvas');
    constructor() {
        if(Sudoku._instance) {
            throw new Error(`Singleton error: Cannot create more than one instance of ${this.constructor.name} class`);
        }
        Sudoku._instance = this;

        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }
}
let sudokuGame = new Sudoku();
// Needed after-instantiation features 
sudokuGame.map = new Map();
restartGame = () => {
    console.log('game was restarted');
    this.map.shuffleGrids();
}

/**
 * Creates a Map obj for a SINGLE game of sudoku
 * @param {any} gridAmount size of each grid (if value == 3, then grids == 3x3 in one map)
 * @param {any} tileAmount size of each tile (if value == 3, then tiles == 3x3 in one grid)
 */
function Map(gridAmount = 3, tileAmount = 3) {
    /** 2d array of map grids */
    this.grids = [[], []];
    for (let row = 0; row < gridAmount; row++) {
        for (let col = 0; col < gridAmount; col++) {
            let grid = new Grid(this, tileAmount);
            this.grids.push(grid);   
        }
    }
    let canvas = sudokuGame.canvas;
    let tilePaths = [];
    /** Self-executing function */
    window.onload = function () {
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        let gridSize = canvas.width / gridAmount;
        let tileSize = gridSize / tileAmount;

        for (let gR = 0; gR < gridAmount; gR++) {
            for (let gC = 0; gC < gridAmount; gC++) {
                for (let tR = 0; tR < tileAmount; tR++) {
                    for (let tC = 0; tC < tileAmount; tC++) {

                        let tilePath = new Path2D();
                        tilePaths.push(tilePath);
                        //tilePath.rect(tileSize * ((gR * 3) + tR), tileSize * ((gC * 3) + tC), tileSize, tileSize);

                        // lane to right
                        ctx.strokeStyle = 'yellow';
                        let currX = tileSize * ((gC * 3) + tC);
                        let currY = tileSize * ((gR * 3) + tR);

                        currX = currX + tileSize;
                        tilePath.moveTo(currX, currY);

                        // lane downwards
                        currY = currY + tileSize;
                        tilePath.lineTo(currX, currY);

                        // lane to left
                        currX = currX - tileSize;
                        tilePath.lineTo(currX, currY);

                        // lane upwards
                        currY = currY - tileSize;
                        tilePath.lineTo(currX, currY);

                        tilePath.closePath();
                        ctx.strokeStyle = 'red';
                        ctx.stroke(tilePath);
                        ctx.fillStyle = 'blue';
                        ctx.fill(tilePath);
                        }
                    }
                }
            }
        }
        // thanks to: https://stackoverflow.com/a/45993653/16256310
        canvas.onclick = function (event) {
            console.log('Registered click');
            let x = event.clientX - canvas.left,
                y = event.clientY - canvas.top;
            
            for (let i = 0; i < tilePaths.length; i++) {
                if (ctx.isPointInStroke(tilePaths[i], x, y)) {
                    console.log(i);
                    ctx.strokeStyle = 'green';
                    ctx.stroke(tilePaths[i]);
                    break;
                }
            }
        }  
        //canvas.addEventListener('click', (event) => {
        //    console.log('click was registered');
        //    if (ctx.isPointInPath(tilePath, event.offsetX, event.offsetY)) {
        //        ctx.fillStyle = 'green';

        //    }
        //    console.log(`${gR}, ${gC}`);
        //    ctx.clearRect(0, 0, canvas.width, canvas.height);
        //    ctx.fill(tilePath);
        //});

    }
    /** Shuffle each tile in each grid */
    this.shuffleGrids = () => this.grids.forEach(_ => _.forEach(grid => {
        grid.shuffleGrids();
    }));
    /** All way check for unique tile 
     * @param {any} row in what grid row char wanted to be put
     * @param {any} col in what grid col char wanted to be put
     * @returns whether or not the char is unique -> could be placed
    */
    function checkTile(row, col, char) {
        /** Should check right side? */
        let right = true;
        // Horizontal all-way check
        for (let i = row; right ? i < this.gridAmount : i >= gridAmount; right ? i++ : i--) {
            if (typeof this.grids[i][col] === undefined) {
                right = !right;
                i = row;

                // IMPLEMENTATION PIECE MISSING FOR CHARACTER VALUE CHECK!!!!
            }
        }
        
        // Vertical all-way check
        for (let i = col; right ? i < this.gridAmount : i >= this.gridAmount; col ? i++ : i--) {
            if (typeof this.grids[row][col] === undefined) {
                right = !right;
                i = row;

                // IMPLEMENTATION PIECE MISSING FOR CHARACTER VALUE CHECK!!!!
            }
        }
    }
    /**
     * Validates if char could be put on the grid
     * @param {any} row row of the grid
     * @param {any} col col of the grid
     * @param {any} char the char that should be put in the grid
     */
    function setTile(row, col, char) {
        let checkResult = checkTile(row, col, char);
        if (checkResult) {
            // Should be using a check
            this.grids[row, col] = char;
        }
    }
/**
 * Creates a grid object connected to a map
 * @param {any} linkedMap A map obj to link to
 * @param {any} tileAmount A size of the current grid 
 * (for example if tiles == 3 => grid is 3x3)
 * */
function Grid(linkedMap, tileAmount) {
    /** A map obj to which current grid obj is linked to */
    this.map = linkedMap;
    /** Tiles the current grid obj consists of */
    this.tiles = [[], []];

    // Populates the current grid obj with tile objs
    for (let row = 0; row < tileAmount; row++) {
        for(let col = 0; col < tileAmount; col++) {
            let tile = new Tile(this);
            this.tiles.push(tile);
        }
    }

    
    /**
     * Tries to push a unique [value] to [tile] in [arr]
     * @param {any} arr An array to which [tile] should be pushed
     * @param {any} tile The number we're pushed
     * @returns Whether or not a [tile] could be pushed into [arr]
     */
    setDefltTiles = (arr, tile) => {
        let shouldPush = !arr.includes(tile) & typeof tile == Tile;

        if (shouldPush) {
            let int = tile;
            arr[randInt(this.tileRowSize)][randInt(this.tileColSize)] = int;
        }
        return shouldPush;
    }

    /**
     * Tries to place a char in the tile in the grid.
     * Invoked automatically by it's Map object, don't call directly!
     * @param {any} row Tile row 
     * @param {any} col Tile col
     * @param {any} char Character value for the tile
     * @returns Whether or not the value was set
     */
    function setTile(row, col, char) {
        this.tiles[row][col] = char;

        //!!! MAKE A CHECK FOR INVALID CHARACTER VALUE!!!
    }
}

/** 
 * Creates a tile linked to the grid
 * @param {any} linkedGrid a grid obj to link to
 * */
function Tile(linkedGrid) {
    /** Value of the current tile */
    this.value;
    this.grid = linkedGrid;

    /** Overrided to return a value the tile represets as a String */
    function toString() {
        return this.value; 
    }  
    /**
     * Limits the input value length to one & type to number
     * @param {any} el the element of whose input should be limited
     */
    function limit(el) {
        if (el.value.length > 1) {
            el.value = el.value.substr(0, 1);
        }
        if (typeof el.value != Number) {
            el.value = null;
        }
    }
}

/**
 *  HELPER FUNC: Returns random integer from 0 to n (excluded)
 *  @param {any} n Max number for the range (excluded)
 */
function randInt(n) {
    return Math.floor(Math.random() * n)
};


/**
 * HELPER FUNC:
 * Creates 2D-array with specified sizes
 * @param {size of the main array} s1
 * @param {size of sub arrays} s2
 * @returns correctly sized 2D-array
 */
function defArr(s1, s2) {
    var arr = [];
    for (let i = 0; i < s1; i++) {
        arr.push(new Array(s2));
    }
    return arr;
}