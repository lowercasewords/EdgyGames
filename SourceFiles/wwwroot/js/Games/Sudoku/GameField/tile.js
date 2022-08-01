import { CanvasObj, ColorCanvasObj } from '/js/Games/canvas-helper.js'

/** 
 * Creates a tile linked to the grid
 * @param {any} linkedGrid a grid obj to link to
 * @param {Number} x position of the tile on x-axis
 * @param {Number} y position of the tile on y-axis (0 is at the top)
 * @param {Number} tileSize size of this tile in pixels
 * */
 export function Tile(linkedGrid, x, y, tileSize, row, col, outlineColor, fillColor) {
    Object.setPrototypeOf(this, new ColorCanvasObj(parseInt(x), parseInt(y), parseInt(tileSize), outlineColor, fillColor));

    this.linkedGrid = linkedGrid;
    this.row = row;
    this.col = col;

    this.rescaleAsync = async (tileRow, tileCol) => {
        for (let tileRow = 0; tileRow < linkedGrid.tiles.size; tileRow++) {
            for(let tileCol = 0; tileCol < linkedGrid.tiles[tileRow].length; tileCol++) {
                this.x = tileRow * linkedGrid.x;
                this.y = tileCol * linkedGrid.y;
                this.size = linkedGrid.tileSize;
            }
        }
    }
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
            if(this.linkedGrid.checkValue(this.row, this.col, tile.row, tile.col, value)){
                tile.valueHolder.value = value;
                Object.freeze(tile.valueHolder);
            }
        }
    }
    
    // Configuring the value object of this tile
    //--------------------------------------------------------------------------------\\
    this.valueHolder = {
        /** Value of the current tile */
        value : null,
    }
    Object.setPrototypeOf(this.valueHolder, new ColorCanvasObj(x + 15, y + 30, this.width, 'null', 'null'));
    // this.valueHolder.fill(ctx, 'red')
    //--------------------------------------------------------------------------------//

    this.getValue = () => {
        return this.valueHolder.value;
    }
}