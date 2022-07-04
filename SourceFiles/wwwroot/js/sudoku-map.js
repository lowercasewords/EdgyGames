import { ColorCanvasObj } from './canvas-helper.js'
// NOTE: Coordinates in upper-left corner are (0, 0)! The y-axis is flipped! 
// NOTE: Calls for starter map creation and rendering happens on the bottom

const canvas = document.getElementById('sudoku-canvas');
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.width;
const ctx = canvas.getContext('2d');

let gridAmount = 3;
let tileAmount = 3;
let mapX = 0;
let mapY = 0;

const map = new Map(mapX, mapY, canvas.width);
const mapRenderer = new MapRenderer(map);
const tilesWithValues = [];
let clkdTileInfo = null;

map.createBoard();
mapRenderer.renderMap();

/** Contains clicked tile itself,
 *  as well as its position in both 2d tile and grid arrays 
 * */


/** Represents the sudoku map! Starts out most of the logic
 * @param {Number} x position of this map on x-asis
 * @param {Number} y position of this map on y-axis (y-axis is 0 at the top/descends)
 * @param {Number} width width the map and its elements
 */
function Map(x, y, width) {
    if(Map.INSTANCE) {
        throw Error(`Cannot create more than one instance of ${this.constructor.call}`);
    }
    Map.INSTANCE = this;
    Object.setPrototypeOf(this, new CanvasObj(parseInt(x), parseInt(y), parseInt(canvas.width)));
    console.log(width)
    /** 2d array of map grids */
    this.grids = [];
    /** Physical size of the grid in px */
    this.gridSize = this.width / gridAmount;
    /**
     * Initializes the grids and tiles of the map
     * @param {Number} gridAmount amount of grids
     * @param {Number} tileAmount amount of tiles 
     */
    this.createBoard = () => {
        gridAmount = parseInt(gridAmount);
        tileAmount = parseInt(tileAmount);
        ctx.lineWidth = 3;
        for (let row = 0; row < gridAmount; row++) {
            this.grids[row] = [];
            for (let col = 0; col < gridAmount; col++) {
                let grid = new Grid(tileAmount, row * this.gridSize, col * this.gridSize, this.gridSize, 'null' , 'pink');
                grid.createTiles();
                this.grids[row][col] = grid;
            }
        }
    }
    //---------------------------------------------------------------------------------//
    
    /** Shuffle each tile in each grid */
    this.shuffleGrids = () => this.grids.forEach(_ => _.forEach(grid => {
        grid.shuffleTiles();
    })),
    /** Tries to set a value to the tile 
     * @param {any} gR in what grid row value wanted to be put
     * @param {any} gC in what grid col value wanted to be put
     * @param {String} value value to check
     * @return {Boolean} whether or not the value was placed
    */
    this.setTile = (baseGR, baseGC, baseTR, baseTC, tile, value) => {
    
        console.log('check horizontal');
        for (let checkGR = 0; checkGR < gridAmount; checkGR++) {
            let tiles = this.grids[checkGR][baseGC].tiles;
            for(let checkTR = 0; checkTR < tileAmount; checkTR++) {
                // skips base tile & tiles with no value
                if(checkGR == baseGR && checkTR == baseTR 
                    || tiles[checkTR][baseTC].valueHolder.value == undefined) {
                        continue;
                }
                // if a repeating one
                if(tiles[checkTR][baseTC].valueHolder.value == value) {
                    console.log('found a repeating value');
                    return false;
                }
            }
        }
        console.log('check vertical');
        for (let checkGC = 0; checkGC < gridAmount; checkGC++) {
            let tiles = this.grids[baseGR][checkGC].tiles;
            for(let checkTC = 0; checkTC < tileAmount; checkTC++) {
                // skips base tile & tiles with no value
                if(checkGC == baseGC && checkTC == baseTC 
                    || tiles[baseTR][checkTC].valueHolder.value == undefined) {
                        continue;
                }
                // if a repeating one
                if(tiles[baseTR][checkTC].valueHolder.value == value) {
                    console.log('found a repeating value');
                    return false;
                }
            }
        }
        console.log('checking for the value in the same grid');
        let tiles = this.grids[baseGR][baseGC].tiles;
        for(let checkTR = 0; checkTR < tileAmount; checkTR++) {
            for (let checkTC = 0; checkTC < gridAmount; checkTC++) {
                // console.log(tiles[checkTR][checkTC]);
                if(tiles[checkTR][checkTC].valueHolder.value == value) {
                    return false;
                }
            }
        }
        tile.valueHolder.value = value?.toString().substring(0, 1);
        console.log('everything is done');
        return true;
    }
    this.startGame = () => {
        console.log('game was restarted');
        this.shuffleGrids();
        // yes this should clear the array
        if(tilesWithValues !== undefined) {
            tilesWithValues.length = 0; 
        }
    }
    this.endGame = () => {
        // Do something
    }
}

/**
 * Creates a grid object connected to a map
 * @param {Number} linkedMap A map obj to link to
 * @param {Number} tileAmount A size of the current grid 
 * @param {Number} x x position of this obj (starts to the left)
 * @param {Number} y y position of this obj {starts on top}
 * (for example if tiles == 3 => grid is 3x3)
 * */
 function Grid(tileAmount, x, y, gridWidth, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new ColorCanvasObj(x, y, gridWidth, outlineColor, fillColor));
    /** A map obj to which current grid obj is linked to */
    /** Tiles the current grid obj consists of */
    this.tiles = [];
    this.tileSize = (gridWidth / 3) - 1;
    /** 
     * Populates the current grid obj with tile objs
     * */ 
    this.createTiles = () => {
        for (let row = 0; row < tileAmount; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < tileAmount; col++) {
                let tile = new Tile(this, x + (this.tileSize * row), y + (this.tileSize * col), this.tileSize,  'green', 'yellow');
                this.tiles[row][col] = tile;
            }
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
}

/** 
 * Creates a tile linked to the grid
 * @param {any} linkedGrid a grid obj to link to
 * */

function Tile(linkedGrid, x, y, width, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new ColorCanvasObj(x, y, width, outlineColor, fillColor));

    this.grid = linkedGrid;
    // Configuring the value object of this tile
    //--------------------------------------------------------------------------------\\
    this.valueHolder = {
        /** Value of the current tile */
        value : null
    }
    Object.setPrototypeOf(this.valueHolder, new ColorCanvasObj(x + 30 , y + 40, width, 'null', 'null'));
    //--------------------------------------------------------------------------------//
    this.getValue = () => {
        return this.valueHolder.value;
    }
}

/** Contains handle method to draw everything on the map! */
function MapRenderer(map) {
    /** Renders the board up-to-date */
    this.refreshBoard = () => {
        this.renderMap();
        if(clkdTileInfo != null) {
            this.rendrerCrossTiles(
                    clkdTileInfo.gR, 
                    clkdTileInfo.gC, 
                    clkdTileInfo.tR,
                    clkdTileInfo.tC
                );
                this.renderClickedTile();
            }
        this.renderAllValues();
    },
    /**
     * Renders the default map without values, should be called before any rendering
     */

    this.renderMap = () => {
        map.grids.forEach(_ => _.forEach(grid => {
            // Render each grid
            grid.outline(ctx,'red');
            grid.tiles.forEach(_ => _.forEach(tile => {
                // rendering each tile
                tile.outline(ctx);
                tile.fill(ctx);
            }));
        }));
    },
    /** Renders a value in a single tile  */
    this.renderValue = (tile) => {
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
    this.renderAllValues = () => {
        for (let i = 0; i < tilesWithValues.length; i++) {
           this.renderValue(tilesWithValues[i]);
       }
    },

    /**
     * Renderes the selected tile with the value
     * */
    this.renderClickedTile = () => {
        let clickedTile = clkdTileInfo.tile;
        clickedTile.outline(ctx, null);
        clickedTile.fill(ctx, 'blue');
        this.renderValue(clickedTile);
    },
    /**
     * Visiually highlights all cross tiles, relative to the base tile
     * @param {Number} baseGR grid row of the base tile
     * @param {Number} baseGC grid col of the base tile
     * @param {Number} baseTR tile row of the base tile
     * @param {Number} baseTC tile col of the base tile
     */
    this.rendrerCrossTiles = (baseGR, baseGC, baseTR, baseTC) => {
        function highlightTile(tile) {
            tile.fill(ctx, 'green');
        }
        for (let currGR = 0; currGR < map.grids.length; currGR++) {
            for (let currGC = 0; currGC < map.grids[currGR].length; currGC++) {
                if(currGR != baseGR && currGC != baseGC) {
                        continue;
                    } 
                let grid = map.grids[currGR][currGC];
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

// Event Handlers
//--------------------------------------------------\\
window.onkeydown = (event) => {
    // if could set a number to a tile, add it to value pile;
    if(clkdTileInfo == null) {
        return;
    }
    // tries to set the key value to the tile
    if(/[1-9]/.test(event.key) && map.setTile(clkdTileInfo.gR, clkdTileInfo.gC,
        clkdTileInfo.tR, clkdTileInfo.tC,
        clkdTileInfo.tile, event.key)) 
    {
        tilesWithValues.push(clkdTileInfo.tile);
        mapRenderer.renderClickedTile();
        return;
    }
    const key = event.key.toLowerCase();
    // Moving on the board using keyboard keys, instead of clicks
    movingWithKeys: 
    if(/(arrow(up|down|left|right)|[wasd])/.test(key)) {  
        let gridsLength = map.grids.length;
        let tilesLength = map.grids[clkdTileInfo.gR][clkdTileInfo.gC].tiles.length;
        // 1 == up, 2 == right, 3 == down, 4 == left
        let direction = 0;
        switch (key) {
            case 'arrowup':
            case 'w':
                direction = 1;
                break;
            case 'arrowright':
            case 'd':
                direction = 2
                break;
            case 'arrowdown':
            case 's':
                direction = 3;
                break;
            case 'arrowleft':
            case 'a':
                direction = 4;
                break;
            default:
                direction = 0;
                break;
        }
        // exits if direction is invalid
        if(direction <= 0 || direction > 4) {
            break movingWithKeys;
        }
        // getting appropriate property name
        const tile = direction == 1 || direction == 3 ? 'tC' : 'tR',
              grid = direction == 1 || direction == 3 ? 'gC' : 'gR';

        // if it's not the last tile in specific direction
        if(direction == 1 || direction == 4 ? (clkdTileInfo[tile] > 0) : (clkdTileInfo[tile] < tilesLength - 1)) {
            direction == 1 || direction == 4 ? clkdTileInfo[tile] -= 1 : clkdTileInfo[tile] += 1;
        }
        // if it's the last tile, but there are grids further still
        else if(direction == 1 || direction == 4 ? clkdTileInfo[grid] > 0 : clkdTileInfo[grid] < gridsLength - 1) {
            direction == 1 || direction == 4 ? clkdTileInfo[grid] -= 1 : clkdTileInfo[grid] += 1;
            direction == 1 || direction == 4 ? clkdTileInfo[tile] = tilesLength - 1 : clkdTileInfo[tile] = 0;
        }
        // console.log(`direction: ${direction}`)
        // reasigning the reference to a tile itself
        clkdTileInfo.tile = map.grids[clkdTileInfo.gR][clkdTileInfo.gC].tiles[clkdTileInfo.tR][clkdTileInfo.tC];
        mapRenderer.refreshBoard();
    }
}

canvas.onclick = (event) => {
    mapRenderer.refreshBoard();
    const eX = event.offsetX,
          eY = event.offsetY;
    clkdTileInfo = getClickedTileInfo(eX, eY);
    mapRenderer.refreshBoard();
}
//--------------------------------------------------//


/**
 * Gets the clicked tile object 
 * @param {Number} x-coordinate of the click
 * @param {Number} y-coodrinate of the click
 * @return {Object} ref to clicked tile and indecies of the tile in grids & tiles arrays 
 */
function getClickedTileInfo(clickX, clickY) {
    for (let gR = 0; gR < map.grids.length; gR++) {
        for (let gC = 0; gC < map.grids[gR].length; gC++) {
            let tiles = map.grids[gR][gC].tiles;
            for (let tR = 0; tR < tiles.length; tR++) {
                for (let tC = 0; tC < tiles[tR].length; tC++) {
                    if (tiles[tR][tC].inShape(clickX, clickY)) {
                        return {
                            tile: tiles[tR][tC],
                            gR: gR,
                            gC: gC,
                            tC: tC,
                            tR: tR
                        }
                    }
                }
            }
        }
    }
    return null;
}

/**
 *  @param {any} n Max number for the range (excluded)
 *  @return {Number} Returns random integer from 0 to n (excluded)
 */
function randInt(n) {
    return Math.floor(Math.random() * n)
};
