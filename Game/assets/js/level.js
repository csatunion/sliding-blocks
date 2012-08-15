//level attributes
var level = 4;
var currentMap;

//arrays of obstacles
var blocksPlaced = [];
var buttonEffects = [];
var portals1 = [];           
var portals2 = [];

var bg = "";

Crafty.scene('loading', function(){
	
	//displays a loading message
	Crafty.background('#000');
	message = Crafty.e("2D, DOM, Text").attr({w:WIDTH-20, x: 10, y: 10})
                                       .text("LOADING")
                                       .css({"text-align": "left", "color":"#fff"});
                                       
	//load wall/block image
    Crafty.sprite(WALL_WIDTH_HEIGHT, "images/crate_20.png", {
    	wall : [0,0]
    });
        	
    //when crate is loaded do the function
	Crafty.load(["images/crate.png"], function() {
			
		//displays a waiting for other player message
	    message.text("WAITING FOR ANOTHER PLAYER");
	    socket.emit("ready");
	    
	    socket.on("setup", function(number, channel){

	    	playerNumber   = number;
    		channelNumber  = channel;
    		time = new Date();
			gameLog("levelstart:" + level);
    		Crafty.scene("main");
	    });
	});
});
    
//the main game scene
//is called once after the setup to create all the client event listeners
Crafty.scene("main", function() {
	
	//don't want to create duplicate event listeners if they replay
	//so it only makes the event listeners on the first playthrough
	if(firstPlayThrough){
		//triggers to notify the players to move to the next level
		//passes them the level they need to draw as data
    	socket.on("advance", function(data){
    	
    		if(data == -1)
    			Crafty.scene("end");
    		else{
    			currentMap = data;
       	    	Crafty.scene("level");
        	}
    	});
	
		socket.on("background", function(bg_name){
    		bg = bg_name;
	    	Crafty.e("2D, DOM, Image")
			.attr({x: 0, y: 0, z: -1})
			.image(bg);
		});    

    	//triggers to notify the player tha their partner finished the level (they both move on to the next level)
    	socket.on("alertOtherPlayer", function(){
    		level++;
    		//go to a between level screen
    	});
    
    	//triggers when the players need to restart the level
    	socket.on("restart", function(){
	    	gameLog("levelrestart:" + level);
    		Crafty.scene("level");
    	});
        
    	//changes the channelNumber of the player so that they cannot communicate with
    	//a group playing the game that is using the channel number that the
    	//player was previously using
    	socket.on("partnerLeft", function(holdingChannel){
    	    channelNumber = holdingChannel;
    	    
    	    if(playerNumber == 1)
    	    	socket.emit("log", logText);
    	    logText = "";
    	    
    	    
    	    //add this back when not testing
    	    //alert("Your partner disconnected. Searching for a new partner.");
    	});
    
    	//drops a block at given position
    	socket.on('dropBlock', function(xpos, ypos){
    	
    	    //place the block at the received location
        	placeBlock(xpos, ypos);
            
        	//make sure there are 3 or less blocks currently placed
        	//remove the block that was placed the longest ago
        	if (blocksPlaced.length > 3){
        	    blocksPlaced[0].destroy();
        	    blocksPlaced = blocksPlaced.slice(1);
        	}
            
        	//log that a block was placed
			gameLog("newblock:" + xpos + " " + ypos);
    	});
        
    	//triggers when the ball is teleported to your side of the screen
    	socket.on("teleported", function(x, y, direction){
    	    ball = drawBall(x, y);
    	    if (direction == 180)
    	        ball.move.left = true;
        	else if(direction == 0)
        	    ball.move.right = true;
        	else if(direction == 90)
        	    ball.move.up = true;
        	else if(direction == 270)
        	    ball.move.down = true;
    	});
    
    	//triggers when a box button is pressed
		socket.on("boxButton", function(buttonNumber, activated, firstHit){
			if(playerNumber == 1){
				if(level == 1){
					if(activated == true && firstHit == true){
						buttonEffects.push(drawCCWBouncyBox(WALL_WIDTH_HEIGHT*13, WALL_WIDTH_HEIGHT*9));
					}
    				else{
    					if(buttonEffects.length > 0){
    						buttonEffects[0].destroy();
    						buttonEffects = [];
    					}
    				}
    			}
			}
    	});
    
	    //triggers when a ball button is pressed
    	socket.on("ballButton", function(buttonNumber){
    		alert("ball button pressed");
    		//add in the effect you want the button to have for that level
    	});
    
    	//triggers when a player button is pressed
    	socket.on("playerButton", function(buttonNumber){
    		alert("player button pressed");
    		//add in the effect you want the button to have for that level
    	});
    
    	socket.on("boxHitSomething", function(){
    		alert("The block you dropped hit your partner or the ball. Try not to do that.")
    	});
    
    	//print out any messages received from other player
    	socket.on('newMessage', function(message){
	    $("#data_received").append("<br/><b>" + message +"</b>");

            //log the message that was received
	    message = message.replace(/[\s\r\n]+$/, "").replace(/"/g, "\\\"");
            gameLog("mreceived:\""+message+"\"");
    	    
    	    //scroll down to the last thing in box of receieved messages
    	    var objDiv = document.getElementById("data_received");
    	    objDiv.scrollTop = objDiv.scrollHeight;
    	});
    	
    	firstPlayThrough = false;
   }
   
   //sends message in input box to server when you hit enter
    //resets the input box
    $('#msg').keyup(function(key){
       	if(key.which == 13){
           	var message = $('#msg').val();
           	socket.emit('sendMessage', message, channelNumber);
           	$('#msg').val("");
           	$("#data_received").append("<br/><i>" + message +"</i>");

	    //log the message that was sent
	    message = message.replace(/[\s\r\n]+$/, "").replace(/"/g, "\\\"");
            gameLog("msent:\""+message+"\"");
           
           	var objDiv = document.getElementById("data_received");
       		objDiv.scrollTop = objDiv.scrollHeight;
       	}
    });
   
   //load the first level
   if(playerNumber == 1)
		socket.emit('nextLevel', level, playerNumber, channelNumber);
});

Crafty.scene("level", function(){
	
	//initializes all obstacle variables to empty
	blocksPlaced = [];
	buttonEffects = [];
   	portals1 = [];
    portals2 = [];
	
	var inventory = drawLevel();
    drawLegend(inventory);
});

//the victory screen
Crafty.scene("end", function(){
	//logs that you won
    gameLog("winner");
  
    //Displays the end message to the player
    Crafty.background('#000');
    message = Crafty.e("2D, DOM, Text").attr({w: 400, h: 20, x: 10, y: 10})
                                       .text("!!!!   YOU WIN   !!!!")
                                       .css({"text-align": "center", "color":"#fff"});
});

function placeBlock(xpos, ypos){
	var box = drawBox(xpos, ypos);
	if(box.hit("Player") != false){
		socket.emit("boxHitSomething", channelNumber);
		box.destroy();
	}
	else if(box.hit("Ball") != false){
		socket.emit("boxHitSomething", channelNumber);
		box.destroy();
	}
	else
		blocksPlaced.push(box);
}

function drawBox(xpos, ypos){
    var box = Crafty.e("Box").box(xpos, ypos);
    return box;
}

function drawBall(xpos, ypos){
    var ball = Crafty.e("Ball").ball(xpos, ypos);
    return ball;
}

function drawMovingBox(xpos, ypos, direction){
    var movingBox = Crafty.e("MovingBox").movingbox(xpos, ypos, direction);
    return movingbox;
}

function drawSimpleBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("SimpleBouncyBox").simplebouncybox(xpos, ypos);
    return bouncyBox;
}

function drawCCWBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("CCWBouncyBox").ccwbouncybox(xpos, ypos);
    return bouncyBox;
}

function drawCWBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("CWBouncyBox").cwbouncybox(xpos, ypos);
    return bouncyBox;
}

function drawBallGate(xpos, ypos){
	var ballGate = Crafty.e("BallGate").ballgate(xpos, ypos);
	return ballGate;
}

function drawPlayerGate(xpos, ypos){
	var playerGate = Crafty.e("PlayerGate").playergate(xpos, ypos);
	return playerGate;
}

function drawBallButton(xpos, ypos, buttonNumber){
	var ballButton = Crafty.e("BallButton").ballbutton(xpos, ypos, buttonNumber);
	return ballButton;
}

function drawPlayerButton(xpos, ypos, buttonNumber){
	var playerButton = Crafty.e("PlayerButton").playerbutton(xpos, ypos, buttonNumber);
	return playerButton;
}

function drawBoxButton(xpos, ypos, buttonNumber){
	var boxButton = Crafty.e("BoxButton").boxbutton(xpos, ypos, buttonNumber);
	return boxButton;
}

function drawTeleporter(xpos, ypos){
    var teleporter = Crafty.e("Teleporter").teleporter(xpos, ypos);
    return teleporter;
}

function drawPortal(xpos, ypos){
	var portal = Crafty.e("Portal").portal(xpos, ypos); 
	return portal;
}

function placeGoal(xpos, ypos){
	var goal = Crafty.e("Goal").goal(xpos, ypos);
	return goal;
}

function drawLevel(){

	Crafty.background("white");
	var playerXPos = 0;
	var playerYPos = 0;
	var ballXPos = 0;
	var ballYPos = 0;
	
	var playerButtonNumber = 0;
	var boxButtonNumber = 0;
	var ballButtonNumber = 0;
	
	var map = currentMap;
    var inventory = {};
	for(var row = 0; row < ROWS; row++){
		for(var column = 0; column < COLUMNS; column++){
			switch(Math.floor(parseFloat(map[column][row]))){
				case 0:{
					break;
				}
				case 1:{
					drawBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//brown
				case 2:{
					drawBallGate(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["ball_gate"] = true;
					break;
				}
				//cyan
				case 3:{
					drawCWBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					inventory["bouncy"] = true;
				    break;
				}
				//cyan
				case 4:{
					drawCCWBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["bouncy"] = true;
					break;
				}
				//gray
				case 5:{
					drawTeleporter(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["teleporter"] = true;
					break;
				}
				//green
				case 6:{
				    if(playerNumber == 2) {
						playerXPos = row*WALL_WIDTH_HEIGHT;
						playerYPos = column*WALL_WIDTH_HEIGHT;
					inventory["player"] = "player2";
				    }
					break;
				}
				//light green
				case 7:{
					drawPlayerButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, playerButtonNumber);
					playerButtonNumber++;
				    inventory["player_button"] = true;
					break;
				}
				//light red
				case 8:{
					drawBoxButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, boxButtonNumber);
					boxButtonNumber++;
				    inventory["box_button"] = true;
					break;
				}
				//orange
				case 9:{
					placeGoal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    //inventory["goal"] = true;
					break;
				}
				//pink
				case 10:{
					drawPlayerGate(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["player_gate"] = true;
					break;
				}
				//puke
				case 11:{
					drawBallButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, ballButtonNumber);
					ballButtonNumber++;
				    inventory["ball_button"] = true;
					break;
				}
				//purple
				case 12:{
					ballXPos = row*WALL_WIDTH_HEIGHT;
					ballYPos = column*WALL_WIDTH_HEIGHT;
				    //inventory["ball"] = true;
					break;
				}
				//red
				case 13:{
				    if(playerNumber == 1) {
						playerXPos = row*WALL_WIDTH_HEIGHT;
						playerYPos = column*WALL_WIDTH_HEIGHT;
					inventory["player"] = "player1";
				    }
					break;
				}
				//yellow
				case 14:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 270);
				    inventory["moving"] = true;
					break;
				}
				//yellow
				case 15:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 90);
				    inventory["moving"] = true;
				    break;
				}
				//yellow
				case 16:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 0);
				    inventory["moving"] = true;
					break;
				}
				//yellow
				case 17:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 180);
				    inventory["moving"] = true;
					break;
				}
				//white
				case 18:{
					var index = Math.round((parseFloat(map[column][row]) - 18)*1000);
					if(portals1[index] == null)
						portals1[index] = drawPortal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					else
						portals2[index] = drawPortal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["portal"] = true;
					break;
				}
				//cyan
				case 19:{
					drawSimpleBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					inventory["bouncy"] = true;
				    break;
				}
			}
		}
	}
	
	//drawn at the end so that they will be drawn on top of any obstacles they cross over
	var player = Crafty.e("Player").player(playerNumber, playerXPos, playerYPos);
	if(ballXPos != 0){
		drawBall(ballXPos, ballYPos);
	}
	
    return inventory;
}


function drawLegend (inventory) {

    var expl_w = WIDTH - BOARD_WIDTH - 40 - WALL_WIDTH_HEIGHT;
    var y_pos = 20;
    
    // draw player avatar
    var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo[inventory["player"]][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
    expl.text(legendInfo[inventory["player"]][1]);

    y_pos += WALL_WIDTH_HEIGHT + 20;

    // draw ball
    var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo["ball"][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
    expl.text(legendInfo["ball"][1]);

    y_pos += WALL_WIDTH_HEIGHT + 20;

    // draw goal
    var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo["goal"][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
    expl.text(legendInfo["goal"][1]);

    y_pos += WALL_WIDTH_HEIGHT + 20;

    // draw rest
    for (var key in inventory) {

	if (key != "player") {
	    var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
	    pic.color(legendInfo[key][0]);

	    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
	    expl.text(legendInfo[key][1]);
	    
	    y_pos += WALL_WIDTH_HEIGHT + 20;
	}
    }
}


