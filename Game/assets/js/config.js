var SERVER_ADDR = "http://parrot.union.edu:4000";

// It seems that images cannot be scaled on the fly and people advice
// against it for time issues. That means, it is not so easy to
// calculate the size of the obstacles, which are loaded as an image,
// dynamically. So, I am hard coding everything here.

//game attributes

// size of blocks 
var WALL_WIDTH_HEIGHT = 20;
// no. of rows and columns is fixed by the way maps are specified
var ROWS = 24;
var COLUMNS = 24;
//480; assuming 768 high screens - 500 should fit with menu bars etc.
var WIDTH  = WALL_WIDTH_HEIGHT * COLUMNS + 200; 
var HEIGHT = WALL_WIDTH_HEIGHT * ROWS;

var BOARD_WIDTH  = WALL_WIDTH_HEIGHT * COLUMNS;
var BOARD_HEIGHT = WALL_WIDTH_HEIGHT * ROWS;

var PLAYER_WIDTH_HEIGHT = WALL_WIDTH_HEIGHT;


