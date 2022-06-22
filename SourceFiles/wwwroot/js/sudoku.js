var gameField = document.getElementById('sudoku-game-field');

function startGame() {
    let map = new Map();

}

/**
 * Creates a Map obj for a SINGLE game of sudoku
 * @param {any} gridSize size of each grid (if value == 3, then grids == 3x3 in one map)
 * @param {any} tileSize size of each tile (if value == 3, then tiles == 3x3 in one grid)
 */
function Map(gridSize = 3, tileSize = 3) {
    /** 2d array of map grids */
    this.grids = [[], []];
    // Partial configuration of this obj's HTMLElements
    // ---------------------------------------- \\
    this.mapEl = document.createElement('div');
    this.mapEl.setAttribute('class', 'sudoku-map');
    gameField.appendChild(this.mapEl);
    
    let tblEl = document.createElement('tbl');
    tblEl.setAttribute('class', 'sudoku-game-table');
    this.mapEl.appendChild(tblEl);
    // ---------------------------------------- \\
    
    // Populates the Map with Grids 
    for (let row = 0; row < gridSize; row++) {
        let tblRowEl = document.createElement('tr');
        tblRowEl.setAttribute('class', 'sudoku-grid-row');
        for (let col = 0; col < gridSize; col++) {
            console.log('\nadding #' + (row + col + 1) + ' grid');
            let grid = new Grid(this, tileSize);
            this.grids.push(grid);
            
            let tblDataEl = document.createElement('td');
            tblDataEl.appendChild(grid.gridEl);
            tblRowEl.appendChild(tblDataEl);
        }
        tblEl.appendChild(tblRowEl);
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
        for (let i = row; right ? i < this.gridSize : i >= gridSize; right ? i++ : i--) {
            if (typeof this.grids[i][col] === undefined) {
                right = !right;
                i = row;

                // IMPLEMENTATION PIECE MISSING FOR CHARACTER VALUE CHECK!!!!
            }
        }
        
        // Vertical all-way check
        for (let i = col; right ? i < this.gridSize : i >= this.gridSize; col ? i++ : i--) {
            if (typeof this.grids[row][col] === undefined) {
                right = !right;
                i = row;

                // IMPLEMENTATION PIECE MISSING FOR CHARACTER VALUE CHECK!!!!
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
            // Should be using a check
            this.grids[row, col] = char;
        }
    }
}
/**
 * Creates a grid object connected to a map
 * @param {any} linkedMap A map obj to link to
 * @param {any} tileSize A size of the current grid 
 * (for example if tiles == 3 => grid is 3x3)
 * */
function Grid(linkedMap, tileSize) {
    /** A map obj to which current grid obj is linked to */
    this.map = linkedMap;
    /** Tiles the current grid obj consists of */
    this.tiles = [[], []];

    // Partial configuration of this obj's HTMLElements
    // ---------------------------------------- \\
    this.gridEl = document.createElement('div');
    this.gridEl.setAttribute('class', 'sudoku-grid');
    this.map.mapEl.appendChild(this.gridEl);
    let tileTblEl = document.createElement('tbl');
    tileTblEl.setAttribute('class', 'sudoku-tile-table');
    this.gridEl.appendChild(tileTblEl);
    // ---------------------------------------- //
    
    // Populates the current grid obj with tile objs
    for (let row = 0; row < tileSize; row++) {

        let tblRowEl = document.createElement('tr');
        for(let col = 0; col < tileSize; col++) {
            console.log('\tadding #' + (row + col + 1) + ' tile');
            let tile = new Tile(this);
            this.tiles.push(tile);

            let tblDataEl = document.createElement('td');
            tblDataEl.appendChild(tile.tileEl);
            tblRowEl.appendChild(tblDataEl);
        }
        tileTblEl.appendChild(tblRowEl);
    }

    
    /**
     * Tries to push a unique [value] to [tile] in [arr]
     * @param {any} arr An array to which [tile] should be pushed
     * @param {any} tile The number we're pushed
     * @returns Whether or not a [tile] could be pushed into [arr]
     */
    function setDefltTiles(arr, tile) {
        let shouldPush = !arr.includes(tile) & typeof tile == Tile;

        if (shouldPush) {
            let int = tile;
            arr[randInt(this.tileRowSize)][randInt(this.tileColSize)] = int;
        }
        return shouldPush;
    }

    /**
     * Tries to place a char in the tile in the grid.
     * Invoked automatically by it's Map object, don't call directly!
     * @param {any} row Tile row 
     * @param {any} col Tile col
     * @param {any} char Character value for the tile
     * @returns Whether or not the value was set
     */
    function setTile(row, col, char) {
        this.tiles[row][col] = char;

        //!!! MAKE A CHECK FOR INVALID CHARACTER VALUE!!!
    }
}

/** 
 * Creates a tile linked to the grid
 * @param {any} linkedGrid a grid obj to link to
 * */
function Tile(linkedGrid) {
    /** Value of the current tile */
    this.value;
    this.grid = linkedGrid;

    // Partial configuration of this obj's HTMLElements
    // ------------------------------------------------------ \\ 
    this.tileEl = document.createElement('div');
    this.tileEl.setAttribute('class', 'sudoku-tile');
    this.grid.gridEl.appendChild(this.tileEl);

    this.tileInputEl = document.createElement('input');
    this.tileInputEl.setAttribute('class', 'sudoku-tile-input');
    this.tileInputEl.setAttribute('type', 'button');
    this.tileInputEl.setAttribute('onkeydown', 'limit(this)');
    this.tileInputEl.setAttribute('onkeyup', 'limit(this)');
    this.tileEl.appendChild(this.tileInputEl);
    // ------------------------------------------------------ //

    /** Overrided to return a value the tile represets as a String */
    function toString() {
        return this.value; 
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
 *  HELPER FUNC: Returns random integer from 0 to n (excluded)
 *  @param {any} n Max number for the range (excluded)
 */
function randInt(n) {
    return Math.floor(Math.random() * n)
};


/**
 * HELPER FUNC:
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