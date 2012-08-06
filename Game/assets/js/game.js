var socket = io.connect(SERVER_ADDR);  //"http://localhost:4000");

// //game attributes
// var WIDTH  = 500; //768; assuming 768 high screens - 500 should fit with menu bars etc.
// var HEIGHT = 500; //768;                                           
// // no. of rows and columns is fixed by the way maps are specified
// var ROWS = 24; //var ROWS = Math.floor(WIDTH/WALL_WIDTH_HEIGHT);
// var COLUMNS = 24; //var COLUMNS = Math.floor(HEIGHT/WALL_WIDTH_HEIGHT);
// // size of blocks variable
// var WALL_WIDTH_HEIGHT = HEIGHT / ROWS; //32;                           	
// var BOARD_WIDTH  = WIDTH - WALL_WIDTH_HEIGHT;               
// var BOARD_HEIGHT = HEIGHT - WALL_WIDTH_HEIGHT;

//arrays of obstacles
var blocksPlaced = [];
var portals1 = [];           
var portals2 = [];

//attributes receieved from the server
var channelNumber;                                         
var playerNumber;                                        
var nick;

//log attributes
var logText = "";
var time;


window.onload = function(){
    Crafty.init(WIDTH,HEIGHT); //768, 768);
    Crafty.scene("loading");    
}

window.onbeforeunload = function(){
    //if(playerNumber == 1)
    socket.emit("log", logText);
    socket.emit("partnerDisconnected", channelNumber);
}

// function logTime(){
//     currentTime = new Date();
//     currentTime = currentTime.getMinutes() + ":" + currentTime.getSeconds();
//     log  = log + "\n" + currentTime; 
// }

function gameLog(logmsg) {
    currentTime = new Date();
    logtime = currentTime.toDateString()+","+currentTime.toTimeString()+","+currentTime.getTime();
    logentry = logtime +","+ playerNumber +","+ logmsg;
    logText = logText + "\n" + logentry;
}