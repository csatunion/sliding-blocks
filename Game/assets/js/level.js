var level;

var map;
var background;

var blocksPlaced = [];
var portals1 = [];
var portals2 = [];

var levelHints;

Crafty.scene("level", function(){
	
	/*Clear all objects*/
	blocksPlaced = [];
	portals1 = [];
	portals2 = [];
	
	Crafty.e("2D, DOM, Image")
		.attr({x:0, y:0, z:-1})
		.image(background);
		
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
	
	/*
	hintsManager = Crafty.e("HintsManager");
	hintsManager.addHint(drawArrow(player.x, player.y, 90), "Test", function(){console.log("Hello1");});
	hintsManager.addHint(drawArrow(player.x, player.y, 270), "Block", function(){console.log("Hello2");});
	hintsManager.addHint(drawArrow(ball.x, ball.y, 270), "Block", function(){console.log("Hello3");});
	hintsManager.addHint(drawArrow(ball.x, ball.y, 90), "Block", function(){console.log("Hello4");});
	*/
});

function advance(parsedMap, backgroundImage, instruction){
	map 		= parsedMap;
	background 	= backgroundImage;

	$("#data_received").html("<b class=\"gameinfo\">" + instruction +"</b>");
	level++;
	
	Crafty.scene("level");
}

