import { canvas } from './main.js';
import { CanvasObj, StyleCanvasObj } from '/js/Games/canvasHelper.js'
import { gameInfo, ctx } from '/js/Games/Sudoku/GameField/main.js';
/** 
 * Contains handle method to draw everything on the gameInfo!
 * */
export const mapRenderer = {
    /**
     * Asyncronously rescales the components to match the intended position on the canvas, 
     * usually done window on resize
     */
     rescaleMap: async () => {
        console.log('rescaling...');
        // console.time('rescale started:');
        gameInfo.rescaleAsync();
        // console.timeEnd('rescaling');
        this.renderMap();
    },
    /** Renders the board up-to-date */
    renderMap: () => {
        console.log('Rendering the map...');
        this.rescaleAsync();
        ctx.lineWidth = 5;
        // Render each grid and tile
        gameInfo.grids.forEach(_ => _.forEach(grid => {
            this.renderGrid(grid);
        }));
        // Render selection
        if(gameInfo.clkdTileInfo != null) {
            this.rendrerCrossTiles(
                gameInfo.clkdTileInfo.gR, 
                gameInfo.clkdTileInfo.gC, 
                gameInfo.clkdTileInfo.tR,
                gameInfo.clkdTileInfo.tC
                );
            this.renderClickedTile();
        }
        console.log(gameInfo);
    },
    /** 
     * Renders the grid with its tiles
     * @param {Grid} grid Grid to render
     */
    renderGrid: (grid) => {
        grid.tiles.forEach(_ => _.forEach(tile => {
            grid.outline(ctx, 'red');
            this.renderTile(tile);
        }));
    },
    /**
     * Renders individual tile
     * @param {Tile} tile tile to render
     */
    renderTile: (tile) => {
        tile.fill(ctx);
        tile.outline(ctx, 'black');
        this.renderTileValue(tile);
    },
    /**
     * Renders the value of specified tile
     * @param {Tile} tile the tile which value should be rendered
     */
    renderTileValue: (tile) => {
        // if this tile has a value
        if(tile.value == null) {
            return;
        }
        // ctx.textAlign = 'center';
        ctx.fillStyle = 'brown'
        ctx.font = '35px arial';
        ctx.fillText(tile.value,
            tile.valueHolder.x,
            tile.valueHolder.y);
    },
    /**
     * Renderes the selected tile with the value
     * */
    renderClickedTile: () => {
        if(gameInfo.clkdTileInfo.tile == null) {
            return;
        }
        let clickedTile = gameInfo.clkdTileInfo.tile;
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
    rendrerCrossTiles: (baseGR, baseGC, baseTR, baseTC) => {
        function highlightTile(tile) {
            tile.fill(ctx, '#e3e3c7');
        }
        for (let currGR = 0; currGR < gameInfo.grids.length; currGR++) {
            for (let currGC = 0; currGC < gameInfo.grids[currGR].length; currGC++) {
                if(currGR != baseGR && currGC != baseGC) {
                        continue;
                    } 
                let grid = gameInfo.grids[currGR][currGC];
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
}
Object.freeze(mapRenderer);