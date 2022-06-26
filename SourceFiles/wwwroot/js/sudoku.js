let canvas = document.getElementById('sudoku-canvas');
let ctx = canvas.getContext('2d');
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.width;
let map = new Map(3, 3, canvas.width, 0, 0);
restartGame = () => {
    console.log('game was restarted');
    map.shuffleGrids();
};
canvas.onclick = (event) => onTileClick(event);

function onTileClick(event) {
    
    let grids = map.grids;
    let eX = event.offsetX,
        eY = event.offsetY;
    // console.log(`grids.length: ${grids.length}`);
    outer:
    for (let gR = 0; gR < grids.length; gR++) {
        for (let gC = 0; gC < grids[gR].length; gC++) {
            let tiles = grids[gR][gC].tiles;
            for (let tR = 0; tR < tiles.length; tR++) {
                for (let tC = 0; tC < tiles[tR].length; tC++) {
                    if (inShape(tiles[tR][tC], eX, eY)) {
                        tiles[tR][tC].fillSqr('blue');
                        highlightCrossTiles(grids, gR, gC, tR, tC)
                        break outer;
                    }
                }
            }
        }
    }
    /**
     * Visiually highlights all cross tiles, relative to the base tile
     * @param {Array} grids the array of grids
     * @param {Number} baseGR grid row of the base tile
     * @param {Number} baseGC grid col of the base tile
     * @param {Number} baseTR tile row of the base tile
     * @param {Number} baseTC tile col of the base tile
     */
    function highlightCrossTiles(grids, baseGR, baseGC, baseTR, baseTC) {
        function highlightTile(tile) {
            tile.fillSqr('green');
        }
        for (let currGR = 0; currGR < grids.length; currGR++) {
            for (let currGC = 0; currGC < grids[currGR].length; currGC++) {
                if(currGR != baseGR && currGC != baseGC) {
                    // console.log(`skipping unrelated grid,  ${currGR}, ${currGC}`);
                    continue;
                } 
                console.log(`found a grid! ${currGR}, ${currGC}`);
                
                let isBaseGrid = currGR == baseGR && currGC == baseGC;
                console.log(isBaseGrid)
                let grid = grids[currGR][currGC];
                for (let currTR = 0; currTR < grid.tiles.length; currTR++) {
                    for (let currTC = 0; currTC < grid.tiles[currTR].length; currTC++) {
                        let tile = grid.tiles[currTR][currTC];
                        if( !(isBaseGrid && currTR == baseTR && currTC == baseTC) && 
                        ((isBaseGrid && (currTR == baseTR || currTC == baseTC)) || 
                        (currGR == baseGR && currTR == baseTR) || 
                        (currGC == baseGC && currTC == baseTC))) {
                            
                            highlightTile(tile);
                        }
                    }
                }
            }
        }
    }
}
/** 
 * Executes when the mouse enters the boundries of the tile
 */
function onTileEnter(event) {
    let grids = map.grids;
    let eX = event.eX,
        eY = event.eY;
    outer:
    for (let gR = 0; gR < grids.length; gR++) {
        for (let gC = 0; gC < grids[gR].length; gC++) {
            let tiles = grids[gR][gC].tiles;
            for (let tR = 0; tR < tiles.length; tR++) {
                for (let tC = 0; tC < tiles[tR].length; tC++) {
                    if (inShape(tiles[tR][tC], eX, eY)) {
                        tiles[tR][tC].fillSqr('pink');
                        break outer;
                    }
                }
            }
        }
    }
}

function onTileExit(event) {
    let grids = map.grids;
    let eX = event.eX,
        eY = event.eY;
    outer:
    for (let gR = 0; gR < grids.length; gR++) {
        for (let gC = 0; gC < grids[gR].length; gC++) {
            let tiles = grids[gR][gC].tiles;
            for (let tR = 0; tR < tiles.length; tR++) {
                for (let tC = 0; tC < tiles[tR].length; tC++) {
                    if (inShape(tiles[tR][tC], eX, eY)) {
                        tiles[tR][tC].fillSqr();
                        break outer;
                    }
                }
            }
        }
    }
}

function inShape(shape, pointX, pointY) {
    return pointX >= shape.x && pointX <= shape.x + shape.width &&
        pointY >= shape.y && pointY <= shape.y + shape.width;
}

/**
 * Creates a square with coordination information
 * @param {Number} width width (and height)
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 */
function Square(width, x, y, outlineColor, fillColor) {
    this.width = parseInt(width);
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.fillColor = fillColor;
    this.outlineColor = outlineColor;
    this.fillSqr = (color = this.fillColor) => {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.width);
    }
    this.outlineSqr = (color = this.outlineColor) =>  {
        ctx.strokeStyle = color;
        ctx.strokeRect(this.x, this.y, this.width, this.width);
    }
}


/**
 * Creates a Map obj for a SINGLE game of sudoku
 * @param {Number} gridAmount size of each grid (if value == 3, then grids == 3x3 in one map)
 * @param {Number} tileAmount size of each tile (if value == 3, then tiles == 3x3 in one grid)
 */
function Map(gridAmount, tileAmount, width, x, y, fillColor, outlineColor) {
    Object.setPrototypeOf(this, new Square(width, x, y, fillColor, outlineColor));
    /** 2d array of map grids */
    this.grids = [];
    let gridSize = canvas.width / gridAmount;
    ctx.lineWidth = 3;
    for (let row = 0; row < gridAmount; row++) {
        this.grids[row] = [];
        for (let col = 0; col < gridAmount; col++) {
            let grid = new Grid(this, tileAmount, gridSize, row * gridSize, col * gridSize, 'red' , 'pink');
            grid.outlineSqr();
            this.grids[row][col] = grid;
        }
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
        if (checkResult) { }
            // Should be using a check
            this.grids[row, col] = char;
        /** Validates if char could be put on the grid
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
    }
}
/**
 * Creates a grid object connected to a map
 * @param {any} linkedMap A map obj to link to
 * @param {any} tileAmount A size of the current grid 
 * (for example if tiles == 3 => grid is 3x3)
 * */
function Grid(linkedMap, tileAmount, gridWidth, gridX, gridY, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new Square(gridWidth, gridX, gridY, outlineColor, fillColor));
    /** A map obj to which current grid obj is linked to */
    this.map = linkedMap;
    /** Tiles the current grid obj consists of */
    this.tiles = [];
    let tileSize = gridWidth / 3 - 1;
    // Populates the current grid obj with tile objs
    for (let row = 0; row < tileAmount; row++) {
        this.tiles[row] = [];
        for (let col = 0; col < tileAmount; col++) {
            let tile = new Tile(this, tileSize, gridX + (row * tileSize), gridY + (tileSize * col), 'green', 'yellow');
            tile.fillSqr();
            tile.outlineSqr();
            this.tiles[row][col] = tile;
        }
    }


    /**
     * Tries to push a unique [value] to [tile] in [arr]
     * @param {any} arr An array to which [tile] should be pushed
     * @param {any} tile The number we're pushed
     * @returns Whether or not a [tile] could be pushed into [arr]
     */
    function setDefltTiles(arr, tile) {
        let shouldPush = !arr.includes(tile) & typeof tile == Tile;

        if (shouldPush) {
            let int = tile;
            arr[randInt(this.tileRowSize)][randInt(this.tileColSize)] = int;
        }
        return shouldPush;
    };

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

function Tile(linkedGrid, width, x, y, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new Square(width, x, y, outlineColor, fillColor));
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