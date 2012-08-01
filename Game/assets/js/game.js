var socket = io.connect("http://localhost:4000");

//game attributes
var WIDTH  = 768;                                           
var HEIGHT = 768;                                           
var WALL_WIDTH_HEIGHT = 32;      
                         	
var ROWS = WIDTH/WALL_WIDTH_HEIGHT;
var COLUMNS = HEIGHT/WALL_WIDTH_HEIGHT;
var BOARD_WIDTH  = WIDTH - WALL_WIDTH_HEIGHT;               
var BOARD_HEIGHT = HEIGHT - WALL_WIDTH_HEIGHT;

//arrays of obstacles
var blocksPlaced = [];
var portals1 = [];           
var portals2 = [];

//attributes receieved from the server
var channelNumber;                                         
var playerNumber;                                        
var nick;

//log attributes
var log = "\n";
var time;


window.onload = function(){
	Crafty.init(WIDTH, HEIGHT);
	Crafty.scene("loading");    
}

window.onbeforeunload = function(){
	if(playerNumber == 1)
        socket.emit("log", log);
    socket.emit("partnerDisconnected", channelNumber);
}

function logTime(){
	currentTime = new Date();
    currentTime = currentTime.getMinutes() + ":" + currentTime.getSeconds();
    log  = log + "\n" + currentTime; 
}
