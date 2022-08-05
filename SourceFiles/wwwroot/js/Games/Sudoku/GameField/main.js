import { Grid } from '/js/Games/Sudoku/GameField/grid.js';
import { mapRenderer } from '/js/Games/Sudoku/GameField/mapRenderer.js';
// NOTE: Coordinates in upper-left corner are (0, 0)! The y-axis is flipped! 
// NOTE: Calls for starter map creation and rendering happens on the bottom

export const canvas = document.getElementById('sudoku-canvas-map');
export const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green'
ctx.fillRect(100, 100);
// Percentile chance of a single tile to be filled with deafult value
let tileChance = 10;

let gridAmount = 3;
let tileAmount = 3;

/** Represents the single Sudoku Map! When game starts, map creates nXn 2d array of grids
 * and each one of them has nXn 2d array of tiles (n is a player specified size)
 * Each tile in the grids is filled with values to ensure a possible victory, some 
 * values are then deleted depending on the 'chance' variable
 */
export const map = new function () {
    // Object.setPrototypeOf(this, )
    this.gridAmount = parseInt(gridAmount);
    this.tileAmount = parseInt(tileAmount);

    /** 2d array of map grids */
    this.grids = [];
    /** Physical size of the game map */
    this.size = canvas.width;
    /** Physical size of each grid in pixels */
    this.gridSize = null;
    /** Info about currently clicked tile */
    this.clkdTileInfo = {
        tile : null,
        gR : null,
        gC : null,
        tC : null,
        tR : null 
    }
    /**
     * Updates the clicked tile object 
     * @param {Number} x-coordinate of the click
     * @param {Number} y-coodrinate of the click
     */
    this.updateClickedTile = (clickX, clickY) => {
        for (let gR = 0; gR < map.grids.length; gR++) {
            for (let gC = 0; gC < map.grids[gR].length; gC++) {
                let tiles = map.grids[gR][gC].tiles;
                for (let tR = 0; tR < tiles.length; tR++) {
                    for (let tC = 0; tC < tiles[tR].length; tC++) 
                    {
                        if (tiles[tR][tC].inShape(clickX, clickY)) 
                        {
                            this.clkdTileInfo.tile = tiles[tR][tC];
                            this.clkdTileInfo.gR = gR;
                            this.clkdTileInfo.gC = gC;
                            this.clkdTileInfo.tC = tC;
                            this.clkdTileInfo.tR = tR;
                            return;
                        }
                    }
                }
            }
        }
        this.clkdTileInfo.tile = null;
        this.clkdTileInfo.gR = null;
        this.clkdTileInfo.tC = null;
        this.clkdTileInfo.gC = null;
        this.clkdTileInfo.tR = null;
    }

    this.startGame = () => {
        this.createBoard();
    }
    this.endGame = () => {
        // Do something
    }
    
    /**
     * Initializes the grids and tiles of the map
     * @param {Number} gridAmount amount of grids
     * @param {Number} tileAmount amount of tiles 
     */
    this.createBoard = () => {
        ctx.lineWidth = 3;
        for (let row = 0; row < this.gridAmount; row++) {
            this.grids[row] = [];
            for (let col = 0; col < this.gridAmount; col++) {
                let grid = new Grid(this, this.tileAmount, row * this.gridSize, col * this.gridSize, this.gridSize, row, col, 'null' , 'pink');
                this.grids[row][col] = grid;
                grid.createTiles();
            }
        }
    }


    // Size changing methods
    //------------------------------------------\\
    /** 
     * Updates grid size and ALL ITS COMPONENTS,
     * Self-executing
     */
     this.updatedGridSize = async function() {
        this.gridSize = canvas.width / this.gridAmount;
        for (let gridRow = 0; gridRow < this.grids.length; gridRow++) {
            for (let gridCol = 0; gridCol < this.grids[gridRow].length; gridCol++) {
                let grid = this.grids[gridRow][gridCol];
                new Promise((resolve, reject) => grid.rescaleAsync(gridRow, gridCol));
            }
        }
    }
    //------------------------------------------//


    // Value check methods
    //------------------------------------------------------------------------\\
    /** 
     * Checks whether or not the value is not repeating accross the map or inside of its grid
     * @param {Number} baseGR The grid row of the tile
     * @param {Number} baseGC The grid column of the tile
     * @param {Number} baseGR The tile row of the tile
     * @param {Number} baseGC The tile column of the tile
     * @returns True if value is not repeating -> value was set to a tile, otherwise false
     */
    this.checkValue = async (baseGR, baseGC, baseTR, baseTC, value) => {
        let horizCheck = checkValuesHoriz(this.grids, baseGR, baseGC, baseTR, baseTC, value);
        let vertCheck = checkValuesVert(this.grids, baseGR, baseGC, baseTR, baseTC, value);
        
        let gridCheck = this.grids[baseGR][baseGC].checkGridValues(value);
        return (await Promise.all([horizCheck, vertCheck, gridCheck])).every(result => result == true);
    }
    /**
     * Checks if the specific value is unique horizontally across the grids in one tile lane
     * @param {Number} baseGR Grid row of the value
     * @param {Number} baseGC Grid column of the value 
     * @param {Number} baseTR Tile row of the value 
     * @param {Number} baseTC Tile column of the value 
     * @param {Number} value The value to be checked
     * @returns Whether or not the value is unique horizontally
     */
    function checkValuesHoriz(grids, baseGR, baseGC, baseTR, baseTC, value) {
        console.log('horizontally')
        return new Promise((resolve, rejected) => {
            // Horizontal Check
            for (let checkGR = 0; checkGR < grids.length; checkGR++) {
                let tiles = grids[checkGR][baseGC].tiles;
                for(let checkTR = 0; checkTR < grids[checkGR][baseGC].tiles.length; checkTR++) {
                    // skips non-existing grids
                    if(grids[checkGR][baseGC] == undefined && baseGR != checkGR) {
                        resolve(true);
                        return;
                    }
                    // skips base tile & tiles with no value
                    if(checkGR == baseGR && checkTR == baseTR 
                        || tiles[checkTR][baseTC]?.valueHolder.value == undefined) {
                        continue;
                    }
                    // if a repeating one
                    if(tiles[checkTR][baseTC].valueHolder.value == value) {
                        resolve(true);
                        return;
                    }
                }
            }
            resolve(true); 
        });
    }
    /**
     * Checks if the specific value is unique vertically across the grids in one tile lane
     * @param {Number} baseGR Grid row of the value
     * @param {Number} baseGC Grid column of the value 
     * @param {Number} baseTR Tile row of the value 
     * @param {Number} baseTC Tile column of the value 
     * @param {Number} value The value to be checked
     * @returns Whether or not the value is unique vertically
     */
    function checkValuesVert(grids, baseGR, baseGC, baseTR, baseTC, value) {
        // Vertical Check
        return new Promise((resolve, reject) => {
            for (let checkGC = 0; checkGC < grids[baseGR].length; checkGC++) {
                let tiles = grids[baseGR][checkGC].tiles;
                console.log(tiles);
                for(let checkTC = 0; checkTC < grids[baseGR][checkGC].tiles[baseTR].length; checkTC++) {
                    // skips non-existing grids
                    if(grids[baseGR][checkGC] == undefined && baseGC != checkGC) {
                        resolve(true);
                        return;
                    }
                    // skips base tile & tiles with no value
                    if(checkGC == baseGC && checkTC == baseTC 
                        || tiles[baseTR][checkTC]?.valueHolder.value == undefined) {
                            continue;
                    }
                    // if a repeating one
                    if(tiles[baseTR][checkTC].valueHolder.value == value) {
                        resolve(false);
                        return;
                    }
                }
            }
            resolve(true);
        });
    }
    //------------------------------------------------------------------------//
}

// After map business
//---------------------------------------------------\\
map.createBoard();
mapRenderer.renderMap();
console.log('map should be rendered now');
console.log(map)
//---------------------------------------------------//


/**
 *  @param {any} n Max number for the range (excluded)
 *  @return {Number} Returns random integer from 0 to n (excluded)
 */
function randInt(n) {
    return Math.floor(Math.random() * n)
};
