var level;

var map;
var map2;
var background;

var blocksPlaced;
var portals1;
var portals2;

var levelHints;
var hintsManager;

var leveltimer;

Crafty.scene("level", function(){
    
    /*Clear all objects*/
    blocksPlaced = [];
    portals1 = [];
    portals2 = [];
    
    Crafty.load([background], function(){
	Crafty.background("#ffffff url("+background+") no-repeat");

	Crafty.e("2D, DOM, Image, Mouse")
	    .attr({
		x:BOARD_WIDTH + CELL_SIZE, 
		y:BOARD_HEIGHT - 2*CELL_SIZE,
		w:100,
		h:40,
		z:1
	    })
	    .image("/images/reset.png")
	    .bind("Click", function(){
		gameLog("Level Reset");
		socket.emit("restart");
		blocksPlaced = [];

/*		console.log ("Level Restarted");
    		$("#chat").empty();
    		postMessage ("Level Restarted", false);
*/		

	    });
	
	drawLevel();
	drawHints();
	
	mode.setupLevel();
    });
    
}, function(){
    hintsManager.destroy();
});

function advance(backgroundImage, instruction, parsedMap1, parsedMap2){
    map 		= parsedMap1;
    map2		= parsedMap2;
    background 	= backgroundImage;
    leveltimer = 0
    
    if(instruction)
	$("#data_received").html("<b class=\"gameinfo\">" + instruction +"</b>");
    
    level++;
    
    gameLog("Level Started");
    
    Crafty.scene("level");
}



/*
window.onload = function(){
    var clientTime1 = getTime();
    socket.emit ('synchronizing');
    socket.on ('synchronizing', function (serverTime) {
	var clientTime2 = new Date().getTime();
	gameLog ("clientTime1:"+clientTime1+";serverTime:"+serverTime+";clientTime2:"+clientTime2);
	Crafty.init(WIDTH, HEIGHT);
	Crafty.scene("load");
    });
};
*/