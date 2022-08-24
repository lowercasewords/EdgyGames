import { CanvasObj, StyleCanvasObj } from '/js/Games/canvasHelper.js';
import { Tile } from '/js/Games/Sudoku/GameField/tile.js'
import { gameInfo } from '/js/Games/Sudoku/GameField/main.js'
 /**
 * Creates a grid object connected to a sudoku gameInfo. Asigns values to the tiles
 * @param {Number} x x position of this obj (starts to the left)
 * @param {Number} y y position of this obj (starts on top)
 * @param {Number} gridWidth the size of this grid
 * (for example if tiles == 3 => grid is 3x3)
 * @param {Number} row A gameInfo row in which this grid exists
 * @param {Number} col A gameInfo col in which this grid exists
 * @param {String} outlineColor optional outline color
 * @param {String} fillColor optional fill color
 * */
export class Grid extends StyleCanvasObj{
    constructor(x, y, row, col) {
        super(x, y, gameInfo.gridWidth);
        this.row = row;
        this.col = col;
        /** Tiles the current grid obj consists of */
        this.tiles = [];
        console.log(`x: ${this.x}\n${this.y}`);
    }
    
    /**
     * Populates the current grid obj with tile objs
     */
    createTiles = () => {
        for (let tileRow = 0; tileRow < gameInfo.tileAmount; tileRow++) {
            this.tiles[tileRow] = [];
            for (let tileCol = 0; tileCol < gameInfo.tileAmount; tileCol++) {
                let tile = new Tile(this, this.x + (gameInfo.tileWidth * tileRow), this.y + (gameInfo.tileWidth * tileCol), tileRow, tileCol);
                this.tiles[tileRow][tileCol] = tile;
            }
        }
    };
    /**
     * Recales the current grid
     */
    rescaleGridAsync = async () => {
        this.x = this.row * gameInfo.gridWidth;
        this.y = this.col * gameInfo.gridWidth;
        this.size = gameInfo.gridWidth;
        let promises = [];
        this.tiles.forEach(_ => _.forEach(tile => {
            promises.push(new Promise((resolve, reject) => 
            {
                tile.rescaleTile();
                resolve();
            }));
        }))
        await Promise.all(promises);
    };

    /**
     * Checks if the specific value is unique in the same grid
     * @param {Number} value A value to be checked
     * @returns Whether or not the value was unique
     */
    checkGridValues = (value) => {
        console.log(`still trying ${value}`);
        return new Promise((resolve, reject) => {
            // Same-grid check
            outer: 
            for (let checkTR = 0; checkTR < 3; checkTR++) {
                for (let checkTC = 0; checkTC < 3; checkTC++) {
                    // // If row is undifined, don't check it 
                    // if(this.tiles[checkTR] === undefined) {
                    //     break outer;
                    // }
                    // // If col is undifined, don't check it
                    // if(this.tiles[checkTR][checkTC] == undefined) {
                    //     break;
                    // }
                    let tile = this.tiles[checkTR][checkTC];

                    console.log(`comparing existing ${tile.value} to ${value}`);
                    // Found a repetitive value
                    if (tile.value == value && tile != null) {
                        console.log(`found a in-same-grid repeat ${value} at [${this.row}, ${this.col}] {${checkTR}, ${checkTC}}`);
                        resolve(false);
                        return;
                    }
                }
            }
            resolve(true);
        }
    )};
    setAllTileValues = () => {
        // A random value assignment  
        let count = 0;
        outer: 
        for (let tileRow = 0; tileRow < tileAmount; tileRow++) {
            for (let tileCol = 0; tileCol < tileAmount; tileCol++) {
                if (!gameInfo.tryRandomValues(this.row, this.col, tileRow, tileCol)) {
                    if (count > 10) {
                    }
                    console.log(`rejected value at [${this.row}, ${this.col}] {${tileRow}, ${tileCol}}`);
                    break;
                }
                else {
                    console.log(`passed value at [${this.row}, ${this.col}] {${tileRow}, ${tileCol}}`);
                }
                // gameInfo.setTileValue(this.row, this.col, tileRow, tileCol, randInt(9) + 1);
            }
        }
    };
    /**
     * Keeps trying to asign any possible valid value to a single tile
     * @param {Number} baseTR The tile row of the tile
     * @param {Number} baseTC The tile column of the tile
     * @returns Whether or not it is possible to assign any value
     */
    tryRandomTileValues = (baseTR, baseTC) => {
        let value = randInt(9) + 1;
        let count = 0;
        while (!gameInfo.checkValue(this.row, this.col, baseTR, baseTC, value)) {
            if (++count >= 9) {
                console.log('exceeded max count when adding pre-made values');
                return false;
            }
            // Tries the next value 
            if (++value >= 10) {
                value = 1;
            }
        }
        console.log(`value ${value} is set`);
        this.tiles[baseTR][baseTC].value = value?.toString().substring(0, 1);
        return true;
    };
    /**
     * Tries to set a value to the tile.
     * @param {Number} baseTR The tile row of the tile
     * @param {Number} baseTC The tile column of the tile
     * @param {String} value value The desired value to be assinged.
     * @returns {Boolean} whether or not the value was placed
    */
    setTileValue = (baseTR, baseTC, value) => {
        /** Continue code if this check has passed (tile value is unique) */
        console.log(`trying to set ${value}`);
        if (!this.gameInfo.checkValue(this.row, this.col, baseTR, baseTC, value)) {
            return false;
        }
        this.tiles[baseTR][baseTC].value = value?.toString().substring(0, 1);
        return true;
    };
}