import { CanvasObj, ColorCanvasObj } from './canvas-helper.js'
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
let tileChance = 50;

const map = new Map(mapX, mapY, canvas.width);
const mapRenderer = new MapRenderer(map);
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
function Map(x, y, width, gridAmount = 3, tileAmount = 3) {
    // SingleTon
    if(Map.INSTANCE) {
        throw Error(`Cannot create more than one instance of ${this.constructor.call}`);
    }
    Map.INSTANCE = this;


    Object.setPrototypeOf(this, new CanvasObj(parseInt(x), parseInt(y), parseInt(canvas.width)));

    this.gridAmount = gridAmount;
    this.tileAmount = tileAmount;
    this.width = width;
    /** 2d array of map grids */
    this.grids = [];
    /** Physical width of each grid in px */
    this.gridWidth = this.width / gridAmount;
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
                let grid = new Grid(this, tileAmount, row * this.gridWidth, col * this.gridWidth, this.gridWidth, row, col, 'null' , 'pink');
                this.grids[row][col] = grid;
                grid.createTiles();
            }
        }
    }
    //---------------------------------------------------------------------------------//

    /** 
     * Tries to set a value to the tile 
     * @param {Number} baseGR The grid row of the tile
     * @param {Number} baseGC The grid column of the tile
     * @param {String} value value to check
     * @returns {Boolean} whether or not the value was placed
    */
    this.setTile = (baseGR, baseGC, baseTR, baseTC, tile, value) => {
        /** Continue code if this check has passed (tile value is unique) */
        if(!this.checkValue(baseGR, baseGC, baseTR, baseTC, value)) {
            return false;
        }
        tile.valueHolder.value = value?.toString().substring(0, 1);
        return true;
    }
    
    /** 
     * Checks whether or not the value is not repeating accross the map
     * @param {Number} baseGR The grid row of the tile
     * @param {Number} baseGC The grid column of the tile
     * @param {Number} baseGR The tile row of the tile
     * @param {Number} baseGC The tile column of the tile
     * @returns {Boolean} true if value is not repeating -> value was set to a tile, otherwise false
     */
    this.checkValue = (baseGR, baseGC, baseTR, baseTC, value) => {
        // Horizontal Check
        for (let checkGR = 0; checkGR < this.grids.length; checkGR++) {
            let tiles = this.grids[checkGR][baseGC].tiles;
            for(let checkTR = 0; checkTR < this.grids[checkGR][baseGC].tiles.length; checkTR++) {
                // skips base tile & tiles with no value
                if(checkGR == baseGR && checkTR == baseTR 
                    || tiles[checkTR][baseTC].valueHolder.value == undefined) {
                        continue;
                }
                // if a repeating one
                if(tiles[checkTR][baseTC].valueHolder.value == value) {
                    return false;
                }
            }
        }
        // Vertical Check
        for (let checkGC = 0; checkGC < this.grids[baseGR].length; checkGC++) {
            let tiles = this.grids[baseGR][checkGC].tiles;
            for(let checkTC = 0; checkTC < this.grids[baseGR][checkGC].tiles[baseTR].length; checkTC++) {
                // skips base tile & tiles with no value
                if(checkGC == baseGC && checkTC == baseTC 
                    || tiles[baseTR][checkTC].valueHolder.value == undefined) {
                        continue;
                }
                // if a repeating one
                if(tiles[baseTR][checkTC].valueHolder.value == value) {
                    return false;
                }
            }
        }
        // Same-grid check
        for(let checkTR = 0; checkTR < this.grids[baseGR][baseGC].tiles.length; checkTR++) {
            for (let checkTC = 0; checkTC < this.grids[baseGR][[baseGC]].tiles[baseTR].length; checkTC++) {
                if(this.grids[baseGR][baseGC].tiles[checkTR][checkTC].valueHolder.value == value) {
                    return false;
                }
            }
        }
        return true;
    }
    this.startGame = () => {
        this.createBoard();
    }
    this.endGame = () => {
        // Do something
    }
}

/**
 * Creates a grid object connected to a map
 * @param {Number} tileAmount An amount of tiles in this grid 
 * @param {Number} x x position of this obj (starts to the left)
 * @param {Number} y y position of this obj (starts on top)
 * @param {Number} gridWidth the width of this grid
 * (for example if tiles == 3 => grid is 3x3)
 * @param {NUmber} row A map row in which this grid exists
 * @param {NUmber} col A map col in which this grid exists
 * */
 function Grid(linkedMap, tileAmount, x, y, gridWidth, row, col, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new ColorCanvasObj(parseInt(x), parseInt(y), parseInt(gridWidth), outlineColor, fillColor));
    
    this.linkedMap = linkedMap;
    this.gridWidth = parseInt(gridWidth);
    /** Tiles the current grid obj consists of */
    this.tiles = [];
    this.tileSize = (this.gridWidth / 3) - 1;
    this.outlineColor = outlineColor;
    this.fillColor = fillColor;
    this.row = row;
    this.col = col;
    /** 
     * Populates the current grid obj with tile objs
     * */ 
    this.createTiles = () => {
        for (let tileRow = 0; tileRow < tileAmount; tileRow++) {
            this.tiles[tileRow] = [];
            for (let tileCol = 0; tileCol < tileAmount; tileCol++) {
                let tile = new Tile(this, x + (this.tileSize * tileRow), y + (this.tileSize * tileCol), this.tileSize, tileRow, tileCol, 'black', '#F5F5F5');
                Tile.prototype.trySetDefault(tile, tileChance);
                this.tiles[tileRow][tileCol] = tile;
            }
        }
    }
}

/** 
 * Creates a tile linked to the grid
 * @param {any} linkedGrid a grid obj to link to
 * @param {Number} x position of the tile on x-axis
 * @param {Number} y position of the tile on y-axis (0 is at the top)
 * @param {Number} width width of this tile in pixels
 * */
function Tile(linkedGrid, x, y, width, row, col, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new ColorCanvasObj(parseInt(x), parseInt(y), parseInt(width), outlineColor, fillColor));
    
    this.linkedGrid = linkedGrid;
    this.row = row;
    this.col = col;
    /** Characters that could be a value */
    Tile.prototype.possibleValues = /[1-9]/;

    /** 
     * Has a chance of setting a random value to the tile  
     * @param {Tile} tile A tile to which a random value **could** be set
     * @param {Number} from 0 to 100, a chance of creating a random value
     * */
    Tile.prototype.trySetDefault = (tile, chance) => {
        if(randInt(100) < chance) {
            let value = randInt(9) + 1;
            if(this.linkedGrid.linkedMap.checkValue(this.linkedGrid.row, this.linkedGrid.col, this.row, this.col, value)){
                tile.valueHolder.value = value;
            }
        }
    }
    
    // Configuring the value object of this tile
    //--------------------------------------------------------------------------------\\
    this.valueHolder = {
        /** Value of the current tile */
        value : null,
    }
    Object.setPrototypeOf(this.valueHolder, new ColorCanvasObj(x + 30 , y + 40, width, 'null', 'null'));
    //--------------------------------------------------------------------------------//
    this.getValue = () => {
        return this.valueHolder.value;
    }
}

/** 
 * Contains handle method to draw everything on the map! 
 * @param {Map} map to render
 * */
function MapRenderer(map) {
    /** Renders the board up-to-date */
    this.renderMap = () => {
        // Render each grid and tile
        map.grids.forEach(_ => _.forEach(grid => {
            this.renderGrid(grid);
        }));
        // Render selection
        if(clkdTileInfo != null) {
            this.rendrerCrossTiles(
                clkdTileInfo.gR, 
                clkdTileInfo.gC, 
                clkdTileInfo.tR,
                clkdTileInfo.tC
                );
            this.renderClickedTile();
        }
    }
    /** 
     * Renders the grid with its tiles
     * @param {Grid} grid Grid to render
     */
    this.renderGrid = (grid) => {
        grid.outline(ctx, null);
        grid.tiles.forEach(_ => _.forEach(tile => {
            this.renderTile(tile);
        }));
    }
    // Methods for rendering tiles
    //----------------------------------------------------------------\\
    //----------------------------------------------------------------\\
    /**
     * Renders individual tile
     * @param {Tile} tile tile to render
     */
    this.renderTile = (tile) => {
        tile.outline(ctx);
        tile.fill(ctx)
        this.renderTileValue(tile);
    }
    /**
     * Renders the value of specified tile
     * @param {Tile} tile the tile which value should be rendered
     */
    this.renderTileValue = (tile) => {
        // if this tile has a value
        if(tile.valueHolder.value == null) 
        {
            return;
        }
        ctx.textAlign = 'center';
        ctx.fillStyle = 'brown'
        ctx.font = '30px arial';
        ctx.fillText(tile.valueHolder.value,
            tile.valueHolder.x,
            tile.valueHolder.y);
    }
    /**
     * Renderes the selected tile with the value
     * */
    this.renderClickedTile = () => {
        if(clkdTileInfo == null) {
            return;
        }
        let clickedTile = clkdTileInfo.tile;
        clickedTile.outline(ctx, null);
        clickedTile.fill(ctx, 'blue');
        this.renderTileValue(clickedTile);
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
            tile.fill(ctx, '#e3e3c7');
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
                            this.renderTileValue(grid.tiles[currTR][currTC]);
                        }
                    }
                }
            }
        }
    }
    //----------------------------------------------------------------//
    //----------------------------------------------------------------//
}

// Event Handlers
//--------------------------------------------------\\
window.onkeydown = (event) => {
    // if could set a number to a tile, add it to value pile;
    if(clkdTileInfo == null) {
        return;
    }
    // tries to set the players value to the tile
    if(Tile.prototype.possibleValues.test(event.key) && map.setTile(clkdTileInfo.gR, clkdTileInfo.gC,
        clkdTileInfo.tR, clkdTileInfo.tC,
        clkdTileInfo.tile, event.key)) 
    {
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
        // reasigning the reference to a tile itself
        clkdTileInfo.tile = map.grids[clkdTileInfo.gR][clkdTileInfo.gC].tiles[clkdTileInfo.tR][clkdTileInfo.tC];
        mapRenderer.renderMap();
    }
}

canvas.onclick = (event) => {
    mapRenderer.renderMap();
    const eX = event.offsetX,
          eY = event.offsetY;
    clkdTileInfo = getClickedTileInfo(eX, eY);
    mapRenderer.renderMap();
}
//--------------------------------------------------//


/**
 * Gets the clicked tile object 
 * @param {Number} x-coordinate of the click
 * @param {Number} y-coodrinate of the click
 * @returns {Object} ref to clicked tile and indecies of the tile in grids & tiles arrays 
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
