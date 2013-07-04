var level;

var map;
var map2;
var background;

var blocksPlaced;
var portals1;
var portals2;

var levelHints;
var hintsManager;

Crafty.scene("level", function(){
	
	/*Clear all objects*/
	blocksPlaced = [];
	portals1 = [];
	portals2 = [];
	
	Crafty.load([background], function(){
		Crafty.background("url("+background+")");

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
				socket.emit("restart");
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
	
	if(instruction)
		$("#data_received").html("<b class=\"gameinfo\">" + instruction +"</b>");
	
	level++;
	
	gameLog("Level Started");
	
	Crafty.scene("level");
}

