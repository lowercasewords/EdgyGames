var gameBox = document.getElementById('game-box');

function startGame() {
    console.log("game has started");
    let map = new Map();
    let previousMapId = document.getElementById(map.mapElement.getAttribute('id'));
    if (previousMapId == undefined) {
        gameBox.appendChild(previousMapId);
    } else {
        gameBox.replaceChild(previousMapId, map.mapElement);
    }
}

Map.prototype.gridRowSize = 3;
Map.prototype.gridColSize = 3;

/** A collection of 2D grids, row and col start at 0 */
function Map() {
    console.log(this.gridRowSize);
    this.grids = defArr(this.gridRowSize, this.gridColSize);
    this.mapElement = document.createElement("div");
    this.mapElement.setAttribute("id", "sudoku-map");

    /** Populates the Map with Grids */
    for (let row = 0; row < this.gridRowSize; row++) {
        for (let col = 0; col < this.gridColSize; col++) {
            this.grids[row, col] = new Grid();
        }
    }
    /** All way check for unique tile 
     * @param {any} row in what grid row char wanted to be put
     * @param {any} col in what grid col char wanted to be put
     * @returns whether or not the char is unique -> could be placed
    */
    function checkTile(row, col, char) {
        /** Should check right side? */
        let right = true;
        // Horizontal all-way check
        for (let i = row; right ? i < this.gridRowSize : i >= this.gridRowSize; right ? i++ : i--) {
            if (typeof grids[i][col] === undefined) {
                right = !right;
                i = row;
            }
        }
        // Vertical all-way check
        for (let i = col; rght ? i < this.gridColSize : i >= this.gridColSize; col ? i++ : i--) {
            if (typeof grids[row][col] === undefined) {
                right = !right;
                i = row;
            }
        }
    }

    /**
     * Validates if char could be put on the grid
     * @param {any} row row of the grid
     * @param {any} col col of the grid
     * @param {any} char the char that should be put in the grid
     */
    function setTile(row, col, char) {
        let checkResult = checkTile(row, col, char);
        if (checkResult) {
            grids[row, col] = char;
        }
    }
}

Grid.prototype['this.tileRowSize'] = 3;
Grid.prototype['this.tileColSize'] = 3;
/** A collection of 2D tiles, row and col start at 0 */
function Grid() {
    this.tiles = defArr(this.tileRowSize, this.tileColSize);
    /** Returns random integer from 0 to n (excluded) */
    let randInt = function (n) { return Math.floor(Math.random() * n) };

    var gridElement = document.createElement("div");

    /** Randomly populates the grid with tiles */
    for (let i = 0; i < randInt(n); i++) {
        addUniqueTile(tiles[randint(this.tileRowSize)][randInt(tile)], randInt(9));
    }
    /**
     * Tries to place a char in the tile in the grid.
     * Invoked automatically by it's Map object, don't call directly!
     * @param {any} row
     * @param {any} col
     * @param {any} char
     */
    function setTile(row, col, char) {
        tiles[row][col] = char;
    }
}
/** Creates */
function Tile() {
    this.number;

    this.tileElement = document.createElement('input');
    tileElement.setAttribute('type', 'text');
    tileElement.setAttribute('onkeydown', 'limit(this)');
    tileElement.setAttribute('onkeyup', 'limit(this)');


    /** Overrided to return a number the tile represets as a String */
    function toString() {
        return this.number;
    }

    /**
     * Limits the input value length to one & type to number
     * @param {any} el the element of whose input should be limited
     */
    function limit(el) {
        if (el.value.length > 1) {
            el.value = el.value.substr(0, 1);
        }
        if (typeof el.value != Number) {
            el.value = null;
        }
    }
}

/**
 * Tries to push a unique [tile] to [arr]
 * @param {any} arr an array to which [tile] should be pushed
 * @param {any} tile the number we're pushed
 * @returns whether or not a [tile] could be pushed into [arr]
 */
function addUniqueTile(arr, tile) {
    let shouldPush = !arr.includes(tile) & typeof Tile;
    if (shouldPush) {
        let int = tile;
        arr.push(int);
    }
    return shouldPush;
}
/**
 * Creates 2D-array with specified sizes
 * @param {size of the main array} s1
 * @param {size of sub arrays} s2
 * @returns correctly sized 2D-array
 */
function defArr(s1, s2) {
    var arr = [];
    for (let i = 0; i < s1; i++) {
        arr.push(new Array(s2));
    }
    return arr;
}