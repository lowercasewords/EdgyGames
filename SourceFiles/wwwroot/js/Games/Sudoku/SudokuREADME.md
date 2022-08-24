This file contains the general overview of how this code works!

main.js:
    gameInfo is the object that controls the map throught method calls and rules, like amount of grids and tiles, the spawn chances.

grid.js AND tile.js:
    contain their respective class declarations: Grid class and Tile class. Every Grid object is created by gameInfo and contains Tile objects. Each tile has a reference to the Grid obj creator. A Tile obj contains the value 

options.js:
    Contains the settings for the user, controls what happens before and after the game.