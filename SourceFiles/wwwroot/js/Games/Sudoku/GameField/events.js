import { canvas, map } from '/js/Games/Sudoku/GameField/main.js';
import { mapRenderer } from '/js/Games/Sudoku/GameField/mapRenderer.js';
// Event Handlers
//--------------------------------------------------\\
window.addEventListener('resize', (event) => {
    resize(mapRenderer.resize(mapRenderer.rescaleAsync());
    console.log('resized');
});

window.onkeydown = (event) => {
    // if could set a number to a tile, add it to value pile;
    if(map.clkdTileInfo?.tile == null) {
        return;
    }
    let clickedGrid = map.grids[map.clkdTileInfo.gR][map.clkdTileInfo.gC];
    // tries to set the players value to the tile
    if(Tile.prototype.possibleValues.test(event.key) 
        && clickedGrid.setTileValue(map.clkdTileInfo.tR, map.clkdTileInfo.tC, event.key)) 
    {
        mapRenderer.renderClickedTile();
        return;
    }

    const key = event.key.toLowerCase();
    // Moving on the board using keyboard keys, instead of clicks
    movingWithKeys: 
    if(/(arrow(up|down|left|right)|[wasd])/.test(key)) {  
        let gridsLength = map.grids.length;
        let tilesLength = map.grids[map.clkdTileInfo.gR][map.clkdTileInfo.gC].tiles.length;
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
        if(direction == 1 || direction == 4 ? (map.clkdTileInfo[tile] > 0) : (map.clkdTileInfo[tile] < tilesLength - 1)) {
            direction == 1 || direction == 4 ? map.clkdTileInfo[tile] -= 1 : map.clkdTileInfo[tile] += 1;
        }
        // if it's the last tile, but there are grids further still
        else if(direction == 1 || direction == 4 ? map.clkdTileInfo[grid] > 0 : map.clkdTileInfo[grid] < gridsLength - 1) {
            direction == 1 || direction == 4 ? map.clkdTileInfo[grid] -= 1 : map.clkdTileInfo[grid] += 1;
            direction == 1 || direction == 4 ? map.clkdTileInfo[tile] = tilesLength - 1 : map.clkdTileInfo[tile] = 0;
        }
        // reasigning the reference to a tile itself
        map.clkdTileInfo.tile = map.grids[map.clkdTileInfo.gR][map.clkdTileInfo.gC].tiles[map.clkdTileInfo.tR][map.clkdTileInfo.tC];
        mapRenderer.renderMap();
    }
}

canvas.onclick = (event) => {
    mapRenderer.renderMap();
    const eX = event.offsetX,
          eY = event.offsetY;
    map.updateClickedTile(eX, eY);
    console.log(eX + ", " + eY);
    mapRenderer.renderMap();
}