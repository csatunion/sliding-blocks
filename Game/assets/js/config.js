var SERVER_ADDRESS = "http://parrot.union.edu:4000";

/* GAME ATTRIBUTES */

//Enables level skipping with the page up-dn keys
var DEBUG = true;

//0 is no view of other player
//1 is only see other player
//2 is alt key screen switch
var MODE = 2;

//how often logging data is sent
var LOG_INTERVAL = 200;

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


//TODO : finalize level advancing + restarting + game over/partner disconnect
//TODO : look at the keyboard controls
//TODO : animate the movement of ball and player
//TODO : implement the rest of the obstacles
//TODO : background doesn't display unless you move sometimes (explore canvas drawing)
//TODO : Level editor changes
//TODO : finalize hints
//TODO : improve the frequency of mode position transmission

