var SERVER_ADDR = "http://localhost:4000";

//game attributes
var WIDTH  = 500; //768; assuming 768 high screens - 500 should fit with menu bars etc.
var HEIGHT = 500; //768;                                           
// no. of rows and columns is fixed by the way maps are specified
var ROWS = 24; //var ROWS = Math.floor(WIDTH/WALL_WIDTH_HEIGHT);
var COLUMNS = 24; //var COLUMNS = Math.floor(HEIGHT/WALL_WIDTH_HEIGHT);
// size of blocks variable
var WALL_WIDTH_HEIGHT = HEIGHT / ROWS; //32;                           	
var BOARD_WIDTH  = WIDTH - WALL_WIDTH_HEIGHT;               
var BOARD_HEIGHT = HEIGHT - WALL_WIDTH_HEIGHT;

var PLAYER_WIDTH_HEIGHT = WALL_WIDTH_HEIGHT;