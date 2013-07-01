var socket = io.connect(SERVER_ADDRESS);

var playerNumber;
var mode;

var player;
var ball;
var goal;

var partner;
var partnerBall;
var partnerBlocksPlaced;
var partnerObstacles;

var partnerView = 0;

window.onload = function(){
	Crafty.init(WIDTH, HEIGHT);
	Crafty.scene("load");
};

/* Loads the game assets */
Crafty.scene("load", function(){
	
	Crafty.background('#000');
	
	//load box image
    Crafty.sprite(CELL_SIZE, "images/box.png", {
    	Box : [0,0],
    	PartnerBox : [0,0]
    });
    
	Crafty.load(["images/box.png", "images/tutorial.png", "images/game.png", "images/reset.png"], function() {
		setupMode();
		initializeStaticListeners();
		Crafty.scene("menu");
	});
	
	//displays a loading message
	Crafty.e("2D, DOM, Text").attr({w:WIDTH-20, x: 10, y: 10})
                             .text("LOADING")
                             .css({"text-align": "left", "color":"#fff"});
                             
	Crafty.e("FPS").bind("MessureFPS", function(fps){console.log(fps);});
});

/* Displays a menu screen */
Crafty.scene("menu", function(){
	unbindKeyListeners();
	unbindModeListeners();
	
	Crafty.background('#000');

	Crafty.e("2D, DOM, Image, Mouse")
		.attr({x:WIDTH * 0.5 - 50, y: BOARD_HEIGHT * 0.4, w: 100, h: 40, z: 1})
		.image("images/tutorial.png")
		.bind("Click", function(){
			Crafty.scene("tutorial");
		});
	
	Crafty.e("2D, DOM, Image, Mouse")
		.attr({x:WIDTH * 0.5 - 50, y: BOARD_HEIGHT * 0.53, w: 100, h: 40, z: 1})
		.image("images/game.png")
		.bind("Click", function(){
			Crafty.scene("game");
		});
});

/* Initializes all the listeners that do not ever need to change */
function initializeStaticListeners(){
	
	socket.on('message', function(message){
		$("#data_received").append("<br/><b>" + message +"</b>");

    	var objDiv = document.getElementById("data_received");
    	objDiv.scrollTop = objDiv.scrollHeight;
    	
    	gameLog("Message: "  + message);
	});
	
	socket.on("block", function(x, y){
		var box = drawBox(x, y);
			
		if(box.x + box.w > player.x && box.x < player.x + player.w && box.y + box.h > player.y && box.y < player.y + player.h){
			socket.emit("alert", "The box hit your partner.");
			box.destroy();
		}else if(ball && box.x + box.w > ball.x && box.x < ball.x + ball.w && box.y + box.h > ball.y && box.y < ball.y + ball.h){
			socket.emit("alert", "The box hit the ball.");
			box.destroy();
		}else{
			blocksPlaced.push(box);
			
			if (blocksPlaced.length > 3){
				blocksPlaced[0].destroy();
				blocksPlaced = blocksPlaced.slice(1);
			}
		}
		Crafty.trigger("Block");
		gameLog("block: " + x + " " + y);
	});
	
	socket.on('teleport', function(x, y, direction){
		drawBall(x, y);
		
        if(direction == 0)
            ball.move.right = true;
        else if (direction == 180)
			ball.move.left = true;
        else if(direction == 90)
        	ball.move.up = true;
        else if(direction == 270)
            ball.move.down = true;
	});
	
	socket.on("advance", function(backgroundImage, instruction, parsedMap, parsedMap2){
		if(parsedMap)
			advance(backgroundImage, instruction, parsedMap, parsedMap2);
		else{
			socket.emit("gameOver");
			gameLog("Game Over");
			Crafty.scene("menu");
		}
	});
	
	socket.on('restart', function(){
		gameLog("Level Restarted");
		Crafty.scene("level");
	});
	
	socket.on('alert', function(message){
		alert(message);
	});
	
	socket.on("partnerDisconnect", function(){
		gameLog("Game Over");
		Crafty.scene("menu");
	});
}

/* unbinds key listeners */
function unbindKeyListeners(){
	$(document).unbind("keyup");
	$("#msg").unbind("keyup");
	$("#data_received").html("");
}

/* unbinds mode listeners */
function unbindModeListeners(){
	mode.unbind("PlayerMoved");
	mode.unbind("BallMoved");
	mode.unbind("Block");
}

/* emits logging messages to server */
function gameLog(message){
	var currentTime = new Date();
	socket.emit("log", currentTime, currentTime.getTime(), playerNumber, MODE, level, message);
}
