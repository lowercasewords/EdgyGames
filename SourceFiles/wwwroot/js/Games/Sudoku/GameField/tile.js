import { gameInfo } from './main.js';
import { CanvasObj, StyleCanvasObj } from '/js/Games/canvasHelper.js'

 /**
 * Creates a tile linked to the grid
 * @param {any} linkedGrid a grid obj to link to
 * @param {Number} x position of the tile on x-axis
 * @param {Number} y position of the tile on y-axis (0 is at the top)
 * @param {Number} tileWidth size of this tile in pixels
 * */
export class Tile extends StyleCanvasObj{
    constructor(x, y, row, col, linkedGrid) {
        super(x, y, gameInfo.tileWidth);
        this.row = row;
        this.col = col;
        this.linkedGrid = linkedGrid;
        this.valuesHolder = new StyleCanvasObj(this.x + 15, this.y + 30, this.size / 1.5);
        /** Value of the current tile */
        this.valuesHolder.value = null;
    }
    

    get value() {
        this.valueHolder.value;
    }
    /**
     * Rescales one Tile
     */
    rescaleTile = () => {
        this.x = (this.row * gameInfo.tileWidth) * this.linkedGrid.x;
        this.y = (this.col * gameInfo.tileWidth) * this.linkedGrid.y;
        this.size = gameInfo.tileWidth;
    };
     /**
     * Has a chance of setting a random value to the tile
     * @param {Tile} tile A tile to which a random value **could** be set
     * @param {Number} from 0 to 100, a chance of creating a random value
     * */
    static trySetDefault = (tile, chance) => {
        if (randInt(100) < chance) {
            let value = randInt(9) + 1;
            if (this.linkedGrid.checkValue(this.row, this.col, tile.row, tile.col, value)) {
                tile.valueHolder.value = value;
            }
        }
    }
    /** Characters that could be a value */
    static possibleValues = /[1-9]/;
    
}