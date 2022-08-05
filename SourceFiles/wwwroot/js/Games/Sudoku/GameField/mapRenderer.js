import { CanvasObj, ColorCanvasObj } from '/js/Games/canvasHelper.js'
import { map, ctx } from '/js/Games/Sudoku/GameField/main.js';
/** 
 * Contains handle method to draw everything on the map!
 * */
export const mapRenderer = new function () {
    /** Renders the board up-to-date */
    this.renderMap = () => {
        // Render each grid and tile
        map.grids.forEach(_ => _.forEach(grid => {
            this.renderGrid(grid);
        }));
        // Render selection
        if(map.clkdTileInfo != null) {
            this.rendrerCrossTiles(
                map.clkdTileInfo.gR, 
                map.clkdTileInfo.gC, 
                map.clkdTileInfo.tR,
                map.clkdTileInfo.tC
                );
            this.renderClickedTile();
        }
    }
    /**
     * Asyncronously rescales the components to match the intended position on the canvas, 
     * usually done window on resize
     */
    this.rescaleAsync = async () => {
        if (map.grids == undefined) {
            return;
        }
        map.updatedGridSize();
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
        if(tile.valueHolder.value == null) {
            return;
        }
        // ctx.textAlign = 'center';
        ctx.fillStyle = 'brown'
        ctx.font = '35px arial';
        ctx.fillText(tile.valueHolder.value,
            tile.valueHolder.x,
            tile.valueHolder.y);
    }
    /**
     * Renderes the selected tile with the value
     * */
    this.renderClickedTile = () => {
        if(map.clkdTileInfo.tile == null) {
            return;
        }
        let clickedTile = map.clkdTileInfo.tile;
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
}