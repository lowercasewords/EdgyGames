import { canvas, ctx, gameInfo } from '/js/Games/Sudoku/GameField/main.js';
import { mapRenderer } from '/js/Games/Sudoku/GameField/mapRenderer.js';
import { resize } from '/js/Games/canvasHelper.js';

/**
 * Corrects the scaling of the canvas elements 
 */
function correctCanvas() {
    resize(canvas, mapRenderer.rescaleAsync);
    // ctx.fillStyle = 'red';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Event Handlers
//--------------------------------------------------\\
window.addEventListener(('load'), event => {
    correctCanvas();
})
window.addEventListener('resize', (event) => {
    // ctx.scale(canvas.width, canvas.height);
    correctCanvas();
});

window.addEventListener('onkeydown', (event) => {
    // if could set a number to a tile, add it to value pile;
    if(gameInfo.clkdTileInfo?.tile == null) {
        return;
    }
    let clickedGrid = gameInfo.grids[gameInfo.clkdTileInfo.gR][gameInfo.clkdTileInfo.gC];
     //tries to set the players value to the tile
    if(Tile.prototype.possibleValues.test(event.key) 
        && clickedGrid.setTileValue(gameInfo.clkdTileInfo.tR, gameInfo.clkdTileInfo.tC, event.key)) 
    {
        mapRenderer.renderClickedTile();
        return;
    }

    const key = event.key.toLowerCase();
    // Moving on the board using keyboard keys, instead of clicks
    movingWithKeys: 
    if(/(arrow(up|down|left|right)|[wasd])/.test(key)) {  
        let gridsLength = gameInfo.grids.length;
        let tilesLength = gameInfo.grids[gameInfo.clkdTileInfo.gR][gameInfo.clkdTileInfo.gC].tiles.length;
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
        if(direction == 1 || direction == 4 ? (gameInfo.clkdTileInfo[tile] > 0) : (gameInfo.clkdTileInfo[tile] < tilesLength - 1)) {
            direction == 1 || direction == 4 ? gameInfo.clkdTileInfo[tile] -= 1 : gameInfo.clkdTileInfo[tile] += 1;
        }
        // if it's the last tile, but there are grids further still
        else if(direction == 1 || direction == 4 ? gameInfo.clkdTileInfo[grid] > 0 : gameInfo.clkdTileInfo[grid] < gridsLength - 1) {
            direction == 1 || direction == 4 ? gameInfo.clkdTileInfo[grid] -= 1 : gameInfo.clkdTileInfo[grid] += 1;
            direction == 1 || direction == 4 ? gameInfo.clkdTileInfo[tile] = tilesLength - 1 : gameInfo.clkdTileInfo[tile] = 0;
        }
        // reasigning the reference to a tile itself
        gameInfo.clkdTileInfo.tile = gameInfo.grids[gameInfo.clkdTileInfo.gR][gameInfo.clkdTileInfo.gC].tiles[gameInfo.clkdTileInfo.tR][gameInfo.clkdTileInfo.tC];
        mapRenderer.renderMap();
    }
});

canvas.addEventListener('onclick', (event) => {
    mapRenderer.renderMap();
    const eX = event.offsetX,
          eY = event.offsetY;
    gameInfo.updateClickedTile(eX, eY);
    console.log(eX + ", " + eY);
    mapRenderer.renderMap();
});
//--------------------------------------------------\\