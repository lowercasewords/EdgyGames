import { canvas } from './main.js';
import { CanvasObj, StyleCanvasObj, rescaleCanvas } from '/js/Games/canvasHelper.js'
import { gameInfo, ctx } from '/js/Games/Sudoku/GameField/main.js';
/** 
 * Contains handle method to draw everything on the gameInfo!
 * */
export const mapRenderer = {
    /** Renders the board up-to-date */
    renderMap: () => {
        rescaleCanvas(canvas);
        // Render each grid and tile
        gameInfo.grids.forEach(_ => _.forEach(grid => {
            mapRenderer.renderGrid(grid);
        }));
        // Render selection
        if(gameInfo.clkdTileInfo != null) {
            mapRenderer.rendrerCrossTiles(
                gameInfo.clkdTileInfo.row, 
                gameInfo.clkdTileInfo.col, 
                gameInfo.clkdTileInfo.linkedGrid.row,
                gameInfo.clkdTileInfo.linkedGrid.col
                );
            mapRenderer.renderClickedTile();
        }
        console.info(`canvas.width ${canvas.width} | canvas.height: ${canvas.height}`);
        console.info(`canvas.clientWidth ${canvas.clientWidth} | canvas.clientWidth: ${canvas.clientHeight}`);
    },
    /** 
     * Renders the grid with its tiles
     * @param {Grid} grid Grid to render
     */
    renderGrid: (grid) => {
        ctx.lineWidth = 2;
        grid.tiles.forEach(_ => _.forEach(tile => {
            grid.outline(ctx, 'red');
            ctx.fillStyle = 'yellow';
            ctx.fillRect(grid.x, grid.y, 5, 5);
            ctx.fillStyle = 'green';
            ctx.fillRect(grid.x + grid.width, grid.y + grid.height, 5, 5);
            mapRenderer.renderTile(tile);
        }));
    },
    /**
     * Renders individual tile
     * @param {Tile} tile tile to render
     */
    renderTile: (tile) => {
        ctx.lineWidth = 2;
        tile.fill(ctx);
        tile.outline(ctx, 'black');
        mapRenderer.renderTileValue(tile);
    },
    /**
     * Renders the value of specified tile
     * @param {Tile} tile the tile which value should be rendered
     */
    renderTileValue: (tile) => {
        // if mapRenderer tile has a value
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
        mapRenderer.renderTileValue(clickedTile);
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
                            mapRenderer.renderTileValue(grid.tiles[currTR][currTC]);
                        }
                    }
                }
            }
        }
    }
}
Object.freeze(mapRenderer);