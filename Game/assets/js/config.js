var SERVER_ADDRESS = "http://localhost:4000";

/* GAME ATTRIBUTES */

//Enables level skipping with the SHIFT key
var DEBUG = true;

//0 is no view of other player
//1 is alt key screen switch
//2 is only see other player
var MODE = 0;

//size of each cell
var CELL_SIZE = 20;

//number of rows and columns
var ROWS = 24;
var COLS = 24;

//480; assuming 768 high screens - 500 should fit with menu bars etc.
var WIDTH  = CELL_SIZE * COLS + 200; 
var HEIGHT = CELL_SIZE * ROWS;

//size of the game board
var BOARD_WIDTH  = CELL_SIZE * COLS;
var BOARD_HEIGHT = CELL_SIZE * ROWS; 

