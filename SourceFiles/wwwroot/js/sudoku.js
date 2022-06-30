
// NOTE: Coordinates in upper-left corner are (0, 0)! The y-axis is flipped! 

const canvas = document.getElementById('sudoku-canvas');
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.width;
const ctx = canvas.getContext('2d');
const map = new Map(3, 3, canvas.width, 0, 0);
const grids = map.grids;
/**
 * Renders the default map (its grids and tiles), should be called before any rendering
 */

restartGame = () => {
    console.log('game was restarted');
    map.shuffleGrids();
    // yes this should clear the array
    tilesWithValues.length = 0;
};
const boardRenderer =  {
    /** Renders the board up-to-date */
    refreshBoard : () => {
        boardRenderer.renderMapDefault();
        if(clkdTileInfo != null) {
            boardRenderer.rendrerCrossTiles(
                clkdTileInfo.gridRow, 
                clkdTileInfo.gridCol, 
                clkdTileInfo.tileRow,
                clkdTileInfo.tileCol
            );
            boardRenderer.renderClickedTile();
        }
        boardRenderer.renderAllValues();
        console.log('re-rendering is complete');
    },

    renderMapDefault : () => {
        map.grids.forEach(_ => _.forEach(grid => {
            // Render each grid
            grid.fillSqr('red');
            grid.tiles.forEach(_ => _.forEach(tile => {
                // rendering each tile
                tile.outlineSqr();
                tile.fillSqr();
            }));
        }));
    },
    /** Renders a value in a single tile  */
    renderValue : (tile) => {
        // tile.fillSqr();
        // tile.outlineSqr();
        // tile.valueHolder.renderValue('brown');
        if(tile.valueHolder.value == null) 
        { return; }
        ctx.textAlign = 'center';
        ctx.fillStyle = 'brown'
        ctx.font = '30px arial';
        ctx.fillText(tile.valueHolder.value,
                    tile.valueHolder.x,
                    tile.valueHolder.y);
    },
    /**
     * Renders all tiles with **values** in them
     */
    renderAllValues : () => {
        for (let i = 0; i < tilesWithValues.length; i++) {
           boardRenderer.renderValue(tilesWithValues[i]);
       }
    },

    /**
     * Renderes the selected tile without the value
     * */
    renderClickedTile : () => {
        clkdTileInfo.tile.outlineSqr(null);
        clkdTileInfo.tile.fillSqr('blue');
        boardRenderer.renderValue(clkdTileInfo.tile);
    },
    /**
     * Visiually highlights all cross tiles, relative to the base tile
     * @param {Number} baseGR grid row of the base tile
     * @param {Number} baseGC grid col of the base tile
     * @param {Number} baseTR tile row of the base tile
     * @param {Number} baseTC tile col of the base tile
     */
    rendrerCrossTiles : (baseGR, baseGC, baseTR, baseTC) => {
        function highlightTile(tile) {
            tile.fillSqr('green');
        }
        for (let currGR = 0; currGR < grids.length; currGR++) {
            for (let currGC = 0; currGC < grids[currGR].length; currGC++) {
                if(currGR != baseGR && currGC != baseGC) {
                        continue;
                    } 
                let grid = grids[currGR][currGC];
                let isBaseGrid = currGR == baseGR && currGC == baseGC;

                // if found a grid, try do its tiles:
                for (let currTR = 0; currTR < grid.tiles.length; currTR++) {
                    for (let currTC = 0; currTC < grid.tiles[currTR].length; currTC++) {
                        if(isBaseGrid && currTR == baseTR && currTC == baseTC) {
                            continue;
                        }
                        // if found correct cross-grid
                        if((isBaseGrid && (currTR == baseTR || currTC == baseTC)) || 
                        (currGR == baseGR && currTR == baseTR) || 
                        (currGC == baseGC && currTC == baseTC)) {
                            highlightTile(grid.tiles[currTR][currTC]);
                        }
                    }
                }
            }
        }
    }
}

boardRenderer.renderMapDefault();

/** All tiles with values */
const tilesWithValues = [];
/** Contains clicked tile itself,
 *  as well as its position in both 2d tile and grid arrays 
 * */
let clkdTileInfo = null;

// Event Handlers
//--------------------------------------------------\\
window.onkeydown = (event) => {
    // if could set a number to a tile, add it to value pile
    if(clkdTileInfo.tile.setValue(event.key)) {
        tilesWithValues.push(clkdTileInfo.tile);
        boardRenderer.renderClickedTile();
        return;
    }
    switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            console.log("it works!");
            break;
        default:
            break;
    }
    boardRenderer.renderClickedTile();
}

canvas.onclick = (event) => {
    boardRenderer.refreshBoard();
    const eX = event.offsetX;
          eY = event.offsetY;
    clkdTileInfo = getClickedTileInfo(eX, eY);
    // STOP EXECUTION IF TILE WASN'T SELECTED
    if(clkdTileInfo === null) { 
        console.log('aborting')
        return;
    }
    boardRenderer.refreshBoard();
}
//--------------------------------------------------//
/**
 * Gets the clicked tile object 
 * @param {Number} x-coordinate of the click
 * @param {Number} y-coodrinate of the click
 * @return {Object} ref to clicked tile and indecies of the tile in grids & tiles arrays 
 */
function getClickedTileInfo(clickX, clickY) {
    for (let gR = 0; gR < grids.length; gR++) {
        for (let gC = 0; gC < grids[gR].length; gC++) {
            let tiles = grids[gR][gC].tiles;
            for (let tR = 0; tR < tiles.length; tR++) {
                for (let tC = 0; tC < tiles[tR].length; tC++) {
                    if (tiles[tR][tC].inShape(clickX, clickY)) {
                        return {
                            tile: tiles[tR][tC],
                            gridRow: gR,
                            gridCol: gC,
                            tileRow: tR,
                            tileCol: tC
                        }
                    }
                }
            }
        }
    }
    return null;
}



/**
 * Defines a Game Object with default position and render properties
 * @param {Number} width width (and height)
 * @param {Number} x x-coordinate
 * @param {Number} y y-coordinate
 * @param {String} outlineColor default outline color
 * @param {String} fillColor default fill color
 */
function GameObject(width, x, y, outlineColor, fillColor) {
    this.width = parseInt(width);
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.fillColor = fillColor;
    this.outlineColor = outlineColor;
    this.lineWidth = 5;
    this.fillSqr = (color = this.fillColor) => {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.width);
    }
    this.outlineSqr = (color = this.outlineColor) =>  {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = color;
        ctx.strokeRect(this.x, this.y, this.width, this.width);
    }
    /**
     * 
     * @param {Object} shape with 
     * @param {*} pointX 
     * @param {*} pointY 
     * @returns whether or not specified coordinate hit the shape
     */
    this.inShape = (pointX, pointY) => {
        return pointX >= x && pointX <= x + width &&
            pointY >= y && pointY <= y + width;
    }
}


/**
 * Creates a Map obj for a SINGLE game of sudoku
 * @param {Number} gridAmount size of each grid (if value == 3, then grids == 3x3 in one map)
 * @param {Number} tileAmount size of each tile (if value == 3, then tiles == 3x3 in one grid)
 */
function Map(gridAmount, tileAmount, width, x, y, fillColor, outlineColor) {

    Object.setPrototypeOf(this, new GameObject(width, x, y, fillColor, outlineColor));

    // Map fill and default Rendering
    //---------------------------------------------------------------------------------\\
    /** 2d array of map grids */
    this.grids = [];
    let gridSize = canvas.width / gridAmount;
    ctx.lineWidth = 3;
    for (let row = 0; row < gridAmount; row++) {
        this.grids[row] = [];
        for (let col = 0; col < gridAmount; col++) {
            let grid = new Grid(this, tileAmount, gridSize, row * gridSize, col * gridSize, 'red' , 'pink');
            this.grids[row][col] = grid;
        }
    }
    //---------------------------------------------------------------------------------//
    
    /** Shuffle each tile in each grid */
    this.shuffleGrids = () => this.grids.forEach(_ => _.forEach(grid => {
        grid.shuffleGrids();
    }));
    /** All way check for unique tile
     * @param {any} row in what grid row char wanted to be put
     * @param {any} col in what grid col char wanted to be put
     * @return {Boolean} whether or not the char is unique -> could be placed
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
    }
}
/**
 * Creates a grid object connected to a map
 * @param {any} linkedMap A map obj to link to
 * @param {any} tileAmount A size of the current grid 
 * (for example if tiles == 3 => grid is 3x3)
 * */
function Grid(linkedMap, tileAmount, gridWidth, gridX, gridY, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new GameObject(gridWidth, gridX, gridY, outlineColor, fillColor));
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
            tile.outlineSqr();
            this.tiles[row][col] = tile;
        }
    }


    /**
     * Tries to push a unique [value] to [tile] in [arr]
     * @param {any} arr An array to which [tile] should be pushed
     * @param {any} tile The number we're pushed
     * @return {Boolean} Whether or not a [tile] could be pushed into [arr]
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
     * @return {Boolean} Whether or not the value was set
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
    Object.setPrototypeOf(this, new GameObject(width, x, y, outlineColor, fillColor));

    this.grid = linkedGrid;
    // Configuring the value object of this tile
    //--------------------------------------------------------------------------------\\
    this.valueHolder = new function() {
        Object.setPrototypeOf(this, new GameObject(width, x + 30 , y + 40, 'null', 'null'));
        /** Value of the current tile */
        this.value = null
    }
    //--------------------------------------------------------------------------------//
    this.getValue = () => {
        return this.valueHolder.value;
    }
    /**
     * Tries to set the value to tile's value-placeholder
     * @param {*} char 
     * @return {Boolean} was the value set or rejected
     */
    this.setValue = (char) => {
        // extra check
        if(!/\d/.test(char)) { return false; } 
        this.valueHolder.value = char?.toString().substring(0, 1);
        return true;
    }
}

/**
 *  @param {any} n Max number for the range (excluded)
 *  @return {Number} Returns random integer from 0 to n (excluded)
 */
function randInt(n) {
    return Math.floor(Math.random() * n)
};

/**
 * HELPER FUNC:
 * Creates 2D-array with specified sizes
 * @param {size of the main array} s1
 * @param {size of sub arrays} s2
 * @return {Array} correctly sized 2D-array
 */
function defArr(s1, s2) {
    var arr = [];
    for (let i = 0; i < s1; i++) {
        arr.push(new Array(s2));
    }
    return arr;
}