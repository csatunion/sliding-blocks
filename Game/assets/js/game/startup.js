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

var partnerView;

var progress;


/* window.onload = function(){
    var clientTime1 = new Date().getTime();
    socket.emit ('synchronizing');
    socket.on ('synchronizing', function (serverTime) {
	var clientTime2 = new Date().getTime();
	gameLog ("clientTime1:"+clientTime1+";serverTime:"+serverTime+";clientTime2:"+clientTime2);
	Crafty.init(WIDTH, HEIGHT);
	Crafty.scene("load");
    });
}; */


function initGame () {
    var clientTime1 = new Date().getTime();
    socket.emit ('synchronizing');
    socket.on ('synchronizing', function (serverTime) {
	var clientTime2 = new Date().getTime();
	gameLog ("clientTime1:"+clientTime1+";serverTime:"+serverTime+";clientTime2:"+clientTime2);
	Crafty.init(WIDTH, HEIGHT);
	Crafty.scene("load");
    });
};


/* Loads the game assets */
Crafty.scene("load", function(){
	
	Crafty.background('#000');
	
	//load box image
    Crafty.sprite(CELL_SIZE, "images/box.png", {
    	Box : [0,0],
    	PartnerBox : [0,0]
    });
	
    Crafty.sprite(CELL_SIZE, "images/goal.png", {
    	Goal : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/ball.png", {
    	BallSprite : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/Player1orange.png", {
    	PlayerOneSprite : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/Player2green.png", {
    	PlayerTwoSprite : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/bouncy-box.png", {
    	BouncyBox : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/portal.png", {
    	Portal : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/teleporter.png", {
    	Teleporter : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/ball-gate.png", {
    	BallGate : [0,0]
    });

    Crafty.sprite(CELL_SIZE, "images/player-gate.png", {
    	PlayerGate : [0,0]
    });

	Crafty.load(["images/box.png", "images/tutorial.png", "images/game.png", "images/reset.png", "images/pirate-map.png"], function() {
		setupMode();
		initializeStaticListeners();
		Crafty.scene("menu");
	});
	
	//displays a loading message
	Crafty.e("2D, DOM, Text").attr({w:WIDTH-20, x: 10, y: 10})
                             .text("LOADING")
                             .css({"text-align": "left", "color":"#fff"});
                             
	//Crafty.e("FPS").bind("MessureFPS", function(fps){console.log(fps);});
});

/* Displays a menu screen */
Crafty.scene("menu", function(){
	unbindKeyListeners();
	unbindModeListeners();
	
	Crafty.background('#000');

	//Instructions Part 1
	Crafty.e("2D, DOM, Image, Mouse")
		.attr({x:WIDTH * 0.45 - 50, y: BOARD_HEIGHT * 0.17, w: 100, h: 40, z: 1})
		.image("images/instructionsone.png")
		.bind("Click", 
			function(){
			$("#instructionsone-stage").css("z-index", "11").load("html/ione.html",
				function () {
					initInstructions();
				});
		});
	

	//Individual Tutorial
	Crafty.e("2D, DOM, Image, Mouse")
		.attr({x:WIDTH * 0.45 - 50, y: BOARD_HEIGHT * 0.3, w: 100, h: 40, z: 1})
		.image("images/individualtutorial.png")
		.bind("Click", function(){
			Crafty.scene("tutorial");
		});


	//Instructions Part 2
	Crafty.e("2D, DOM, Image, Mouse")
		.attr({x:WIDTH * 0.45 - 50, y: BOARD_HEIGHT * 0.43, w: 100, h: 40, z: 1})
		.image("images/instructionstwo.png")
		.bind("Click", function(){
			$("#instructionstwo-stage").css("z-index", "11").load("html/itwo.html",
				function () {
					initInstructions();
				});
		});


	//Two Player Tutorial
	Crafty.e("2D, DOM, Image, Mouse")
		.attr({x:WIDTH * 0.45 - 55, y: BOARD_HEIGHT * 0.56, w: 100, h: 40, z: 1})
		.image("images/twoplayertutorial.png")
		.bind("Click", function(){
			Crafty.scene("twotutorial");
		});	


	//Game
	Crafty.e("2D, DOM, Image, Mouse")
		.attr({x:WIDTH * 0.5 - 50, y: BOARD_HEIGHT * 0.69, w: 100, h: 40, z: 1})
		.image("images/game.png")
		.bind("Click", function(){
			Crafty.scene("game");
		});

	
		

    		$('#msg').bind("keyup", function(key){
			//enter key
			if(key.which == 13){
				var message = $('#msg').val().replace('\n','');
			    gameLog (message);
				$('#msg').val("");
				$("#data_received").append("<div class='message_spacing'></br></div><i>" + message +"</i>");

				var objDiv = document.getElementById("data_received");
				objDiv.scrollTop = objDiv.scrollHeight;
			}
		});

    socket.emit ('ready');

});


/* Initializes all the listeners that do not ever need to change */
function initializeStaticListeners(){
	
	socket.on('message', function(message){
		$("#data_received").append("<div class='message_spacing'></br></div><b>" + message +"</b>");

    	var objDiv = document.getElementById("data_received");
    	objDiv.scrollTop = objDiv.scrollHeight;
    	
    	gameLog("message: "  + message);
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
	
	socket.on("advance", function(parsedMap, backgroundImage, instruction, parsedMap2){
		if(parsedMap) {
		    //console.log ("Yay! Got a parsed map and " + instruction);
			advance(backgroundImage, instruction, parsedMap, parsedMap2);
		} else{
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
	    socket.emit("gameOver");
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
	Crafty.unbind("PlayerMoved");
	Crafty.unbind("BallMoved");
	Crafty.unbind("Block");
}

/* emits logging messages to server */
function gameLog(message){
	var currentTime = new Date();
	socket.emit("log", currentTime, currentTime.getTime(), playerNumber, MODE, level, message);
}
