import { CanvasObj, ColorCanvasObj } from '/js/canvas-helper.js'
import { Tile } from '/js/Games/Sudoku/GameField/tile.js'
/**
 * Creates a grid object connected to a sudoku map. Asigns values to the tiles
 * @param {Number} tileAmount An amount of tiles in this grid 
 * @param {Number} x x position of this obj (starts to the left)
 * @param {Number} y y position of this obj (starts on top)
 * @param {Number} gridSize the size of this grid
 * (for example if tiles == 3 => grid is 3x3)
 * @param {NUmber} row A map row in which this grid exists
 * @param {NUmber} col A map col in which this grid exists
 * */
 export function Grid(linkedMap, tileAmount, x, y, gridSize, row, col, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new ColorCanvasObj(parseInt(x), parseInt(y), parseInt(gridSize), outlineColor, fillColor));
    
    this.linkedMap = linkedMap;
    this.gridSize = parseInt(gridSize);
    /** Tiles the current grid obj consists of */
    this.tiles = [];
    this.tileSize = (this.size / 3) - 1;
    this.row = row;
    this.col = col;
    /**
     * 
     */
    this.rescaleAsync = (tileRow, tileCol) => {
        this.x = this.row * map.gridSize;
        this.y = this.col * map.gridSize;
        this.size = this.linkedMap.gridSize;
        this.tiles[tileRow][tileCol].rescaleAsync(tileRow, tileCol);
    }
    /** 
     * Populates the current grid obj with tile objs
     * */ 
    this.createTiles = () => {
        for (let tileRow = 0; tileRow < tileAmount; tileRow++) {
            this.tiles[tileRow] = [];
            for (let tileCol = 0; tileCol < tileAmount; tileCol++) {
                let tile = new Tile(this, x + (this.tileSize * tileRow), y + (this.tileSize * tileCol), this.tileSize, tileRow, tileCol, 'black', '#F5F5F5');
                this.tiles[tileRow][tileCol] = tile;
            }
        }
    }
    /**
     * Checks if the specific value is unique in the same grid
     * @param {Number} value A value to be checked
     * @returns Whether or not the value was unique
     */
    this.checkGridValues = (value) => {
        console.log(`still trying ${value}`);
        return new Promise((resolve, reject) => { 
            // Same-grid check
            outer:
            for(let checkTR = 0; checkTR < 3; checkTR++) {
                for(let checkTC = 0; checkTC < 3; checkTC++) {
                    // // If row is undifined, don't check it 
                    // if(this.tiles[checkTR] === undefined) {
                    //     break outer;
                    // }
                    // // If col is undifined, don't check it
                    // if(this.tiles[checkTR][checkTC] == undefined) {
                    //     break;
                    // }
                    let tile = this.tiles[checkTR][checkTC];

                    console.log(`comparing existing ${tile.valueHolder.value} to ${value}`);
                    // Found a repetitive value
                    if(tile.valueHolder.value == value && tile != null) {
                        console.log(`found a in-same-grid repeat ${value} at [${this.row}, ${this.col}] {${checkTR}, ${checkTC}}`);
                        resolve(false);
                        return;
                    }
                }
            }
            resolve(true);
        });
    }
    this.setAllTileValues = () => {
        // A random value assignment  
        let count = 0;
        outer:
        for (let tileRow = 0; tileRow < tileAmount; tileRow++) {
            for (let tileCol = 0; tileCol < tileAmount; tileCol++) {
                if(!linkedMap.tryRandomValues(this.row, this.col, tileRow, tileCol)) {
                    if(count > 10) {
                        
                    }
                    console.log(`rejected value at [${this.row}, ${this.col}] {${tileRow}, ${tileCol}}`);
                    break;
                }
                else { 
                    console.log(`passed value at [${this.row}, ${this.col}] {${tileRow}, ${tileCol}}`);

                }
                // linkedMap.setTileValue(this.row, this.col, tileRow, tileCol, randInt(9) + 1);
            }
        }
    }
    /**
     * Keeps trying to asign any possible valid value to a single tile
     * @param {Number} baseTR The tile row of the tile
     * @param {Number} baseTC The tile column of the tile
     * @returns Whether or not it is possible to assign any value
     */
     this.tryRandomTileValues = (baseTR, baseTC) => {
        let value = randInt(9) + 1;
        let count = 0;
        while(!linkedMap.checkValue(this.row, this.col, baseTR, baseTC, value)) {
            if (++count >= 9) {
                console.log('exceeded max count');
                return false;
            }
            // Tries the next value 
            if (++value >= 10) { 
                value = 1;
            }
        }
        console.log(`value ${value} is set`)
        this.tiles[baseTR][baseTC].valueHolder.value = value?.toString().substring(0, 1);
        return true;
    }
    /** 
     * Tries to set a value to the tile.
     * @param {Number} baseTR The tile row of the tile
     * @param {Number} baseTC The tile column of the tile
     * @param {String} value value The desired value to be assinged.
     * @returns {Boolean} whether or not the value was placed
    */
    this.setTileValue = (baseTR, baseTC, value) => {
        /** Continue code if this check has passed (tile value is unique) */
        console.log(`trying to set ${value}`);
        if(!this.linkedMap.checkValue(this.row, this.col, baseTR, baseTC, value)) {
            return false;   
        }
        this.tiles[baseTR][baseTC].valueHolder.value = value?.toString().substring(0, 1);
        return true;
    }
}