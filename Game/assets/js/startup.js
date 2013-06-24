var socket = io.connect(SERVER_ADDRESS);

var playerNumber;

var player;
var partner;
var ball;
var goal;

window.onload = function(){
	Crafty.init(WIDTH, HEIGHT);
	Crafty.scene("load");
};

/* Loads the game assets */
Crafty.scene("load", function(){
	
	Crafty.background('#000');
	
	//load box image
    Crafty.sprite(CELL_SIZE, "images/box.png", {
    	box : [0,0]
    });
    
    //when box, tutorial, and game images are loaded, do the function
	Crafty.load(["images/box.png", "images/tutorial.png", "images/game.png", "images/reset.png"], function() {
		initializeStaticListeners();
		Crafty.scene("menu");
	});
	
	//displays a loading message
	Crafty.e("2D, DOM, Text").attr({w:WIDTH-20, x: 10, y: 10})
                             .text("LOADING")
                             .css({"text-align": "left", "color":"#fff"});
});

/* Displays a menu screen */
Crafty.scene("menu", function(){
	unbindKeyListeners();
	
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

/* initializes all the listeners that do not ever need to change 
 * ONLY CALLED ONCE AT STARTUP
 */
function initializeStaticListeners(){
	
	socket.on('message', function(message){
		$("#data_received").append("<br/><b>" + message +"</b>");

    	var objDiv = document.getElementById("data_received");
    	objDiv.scrollTop = objDiv.scrollHeight;
	});
	
	socket.on("block", function(x, y){
		var box = drawBox(x, y);
		
		if(box.hit("Player") != false){
			socket.emit("alert", "The box hit your partner.");
			box.destroy();
		}else if(box.hit("Ball") != false){
			socket.emit("alert", "The box hit the ball.");
			box.destroy();
		}else
			blocksPlaced.push(box);
			
		if (blocksPlaced.length > 3){
			blocksPlaced[0].destroy();
			blocksPlaced = blocksPlaced.slice(1);
		}
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
	
	socket.on("advance", function(parsedMap, backgroundImage, instruction){
		if(parsedMap)
			advance(parsedMap, backgroundImage, instruction);
		else{
			socket.emit("gameOver");
			Crafty.scene("menu");
		}
	});
	
	socket.on('restart', function(){
		Crafty.scene("level");
	});
	
	socket.on('alert', function(message){
		alert(message);
	});
	
	socket.on("partnerDisconnect", function(){
		Crafty.scene("menu");
	});
}

/* unbinds key listeners */
function unbindKeyListeners(){
	$(document).unbind("keyup");
	$("#msg").unbind("keyup");
	$("#data_received").html("");
}
