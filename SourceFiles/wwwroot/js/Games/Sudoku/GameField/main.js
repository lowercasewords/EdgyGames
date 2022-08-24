import { Grid } from '/js/Games/Sudoku/GameField/grid.js';
import { mapRenderer } from '/js/Games/Sudoku/GameField/mapRenderer.js';
// NOTE: Coordinates in upper-left corner are (0, 0)! The y-axis is flipped! 
// NOTE: Calls for starter gameInfo creation and rendering happens on the bottom

export const canvas = document.getElementById('sudoku-canvas-map');
export const ctx = canvas.getContext('2d');

// Percentile chance of a single tile to be filled with deafult value
let tileChance = 10;

/** Represents the single Sudoku Map! When game starts, gameInfo creates nXn 2d array of grids
 * and each one of them has nXn 2d array of tiles (n is a player specified size)
 * Each tile in the grids is filled with values to ensure a possible victory, some 
 * values are then deleted depending on the 'chance' variable
 */
export const gameInfo = new class{
    constructor() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    /** Info about currently clicked tile */
    clkdTileInfo = null;

    /** 2d array of gameInfo grids */
    grids = [];

    gridWidth = canvas.width / 3 - 1;
    gridHeight = canvas.height / 3 - 1;
    tileWidth = this.gridWidth / 3 - 1;
    tileHeight = this.gridHeight / 3 - 1;

    /** Amount of grids SQUARED */
    gridAmount = 3;
    /** Amount of tiles SQUARED */
    tileAmount = 3;
    
    startGame = (gridAmount = 3, tileAmount = 3) => {
        gameInfo.gridAmount = gridAmount;
        gameInfo.tileAmount = tileAmount;
        this.createBoard();
        mapRenderer.renderMap();
        console.log('Game starts!');
        console.info(gameInfo);
    }
    endGame = () => {
        throw new Error('Nothing was implemented yet!');
    }
    /**
     * Initializes the grids and tiles of the gameInfo
     * @param {Number} gridAmount amount of grids
     * @param {Number} tileAmount amount of tiles 
     */
    createBoard = () => {
        // ctx.lineWidth = 3;
        // gameInfo.updateSize();
        for (let row = 0; row < gameInfo.gridAmount; row++) {
            gameInfo.grids[row] = [];
            for (let col = 0; col < gameInfo.gridAmount; col++) {
                let grid = new Grid(row * gameInfo.gridWidth, col * gameInfo.gridHeight, row, col);
                gameInfo.grids[row][col] = grid;
                grid.createTiles();
            }
        }
        // gameInfo.updateSize();
    }
    
    /**
     * Rescales the size of the gameInfo an its components to fit the canvas
     */
    rescaleAsync = async () => {
        // gameInfo.updateSize();
        for (let gridRow = 0; gridRow < gameInfo.grids.length; gridRow++) {
            for (let gridCol = 0; gridCol < gameInfo.grids[gridRow].length; gridCol++) {
                let grid = gameInfo.grids[gridRow][gridCol];
                await new Promise((resolve, reject) => {
                        grid.rescaleGridAsync(gridRow, gridCol)
                        resolve();
                    }
                );
            }
        }
    }
    /** 
     * Updates grid size and ALL ITS COMPONENTS
     */
    // updateSize() {
    //     console.info(`canvas.width = ${canvas.width}`);
    //     console.info(`canvas.offsetWidth: ${canvas.offsetWidth}`);
    //     console.info(`canvas.clientWidth: ${canvas.clientWidth}`);
    //     gameInfo.gridWidth = canvas.width / gameInfo.gridAmount - 1;
    //     gameInfo.tileWidth = gameInfo.gridWidth / gameInfo.tileAmount - 1;
    // }
    /**
     * Updates the clicked tile object 
     * @param {Number} x-coordinate of the click
     * @param {Number} y-coodrinate of the click
     */
    updateClickedTile = (clickX, clickY) =>{
        for (let gR = 0; gR < gameInfo.grids.length; gR++) {
            for (let gC = 0; gC < gameInfo.grids[gR].length; gC++) {
                let tiles = gameInfo.grids[gR][gC].tiles;
                for (let tR = 0; tR < tiles.length; tR++) {
                    for (let tC = 0; tC < tiles[tR].length; tC++) 
                    {
                        if (tiles[tR][tC].inShape(clickX, clickY)) 
                        {
                            gameInfo.clkdTileInfo.tile = tiles[tR][tC];
                            return;
                        }
                    }
                }
            }
        }
    }

    /** 
     * Checks whether or not the value is not repeating accross the gameInfo or inside of its grid
     * @param {Number} baseGR The grid row of the tile
     * @param {Number} baseGC The grid column of the tile
     * @param {Number} baseGR The tile row of the tile
     * @param {Number} baseGC The tile column of the tile
     * @returns True if value is not repeating -> value was set to a tile, otherwise false
     */
    checkValue = async (baseGR, baseGC, baseTR, baseTC, value) => {
        let horizCheck = checkValuesHoriz(gameInfo.grids, baseGR, baseGC, baseTR, baseTC, value);
        let vertCheck = checkValuesVert(gameInfo.grids, baseGR, baseGC, baseTR, baseTC, value);
        let gridCheck = gameInfo.grids[baseGR][baseGC].checkGridValues(value);
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
    checkValuesHoriz = async (grids, baseGR, baseGC, baseTR, baseTC, value) => {
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
                        || tiles[checkTR][baseTC]?.value == undefined) {
                        continue;
                    }
                    // if a repeating one
                    if(tiles[checkTR][baseTC].value == value) {
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
    checkValuesVert = (grids, baseGR, baseGC, baseTR, baseTC, value) => {
        // Vertical Check
        return new Promise((resolve, reject) => {
            for (let checkGC = 0; checkGC < grids[baseGR].length; checkGC++) {
                let tiles = grids[baseGR][checkGC].tiles;
                
                for(let checkTC = 0; checkTC < grids[baseGR][checkGC].tiles[baseTR].length; checkTC++) {
                    // skips non-existing grids
                    if(grids[baseGR][checkGC] == undefined && baseGC != checkGC) {
                        resolve(true);
                        return;
                    }
                    // skips base tile & tiles with no value
                    if(checkGC == baseGC && checkTC == baseTC 
                        || tiles[baseTR][checkTC]?.value == undefined) {
                            continue;
                    }
                    // if a repeating one
                    if(tiles[baseTR][checkTC].value == value) {
                        resolve(false);
                        return;
                    }
                }
            }
            resolve(true);
        });
    }
}


/**
 *  @param {any} n Max number for the range (excluded)
 *  @return {Number} Returns random integer from 0 to n (excluded)
 */
function randInt(n) {
    return Math.floor(Math.random() * n)
}