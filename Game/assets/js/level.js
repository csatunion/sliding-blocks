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
		Crafty.e("2D, DOM, Image")
			.attr({x:0, y:0, z:0})
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
		
		if(MODE == 1){
			partner = Crafty.e("2D, DOM, Color").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1});
			if(playerNumber == 1)
				partner.color("green");
			else
				partner.color("red");
				
			socket.emit("updatePartner", player.x, player.y);
		}else if(MODE == 2){
			partnerBlocksPlaced = [];
			partnerObstacles = [];
			partnerView = 0;
			
			partner = Crafty.e("2D, DOM, Color").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1});
			if(playerNumber == 1)
				partner.color("green");
			else
				partner.color("red");
			
			partnerBall = Crafty.e("2D, DOM, Color").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}).color("purple");
			partnerBlocksPlaced.push(Crafty.e("2D, DOM, PartnerBox").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}));
			partnerBlocksPlaced.push(Crafty.e("2D, DOM, PartnerBox").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}));
			partnerBlocksPlaced.push(Crafty.e("2D, DOM, PartnerBox").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}));
		}
	});
	
	/*
	hintsManager = Crafty.e("HintsManager");
	hintsManager.addHint(drawArrow(player.x, player.y, 90), "Test", function(){console.log("Hello1");});
	hintsManager.addHint(drawArrow(player.x, player.y, 270), "Block", function(){console.log("Hello2");});
	hintsManager.addHint(drawArrow(ball.x, ball.y, 270), "Block", function(){console.log("Hello3");});
	hintsManager.addHint(drawArrow(ball.x, ball.y, 90), "Block", function(){console.log("Hello4");});
	*/
});

function advance(backgroundImage, instruction, parsedMap1 ,parsedMap2){
	map 		= parsedMap1;
	map2		= parsedMap2;
	background 	= backgroundImage;
	
	$("#data_received").html("<b class=\"gameinfo\">" + instruction +"</b>");
	level++;
	
	gameLog("Level Started");
	
	Crafty.scene("level");
}

