//level attributes
var level = 1;                                              
var currentMap;
    
Crafty.scene('loading', function(){
        
    //load wall/block image
    Crafty.sprite(WALL_WIDTH_HEIGHT, "images/crate.png", {
        wall : [0,0]
    });    
        
	//when crate is loaded do the function
	Crafty.load(["images/crate.png"], function() {
		//emit ready when socket io is running
        socket.emit("ready", "ready");
            
        //wait for setup info from server
        socket.on("setup", function(username, number, channel){
                
		    nick           = username;
            playerNumber   = number;
            channelNumber  = channel;
                
            //wait for start signal to run main game
            socket.on('start', function(){
                    
                //log that game has started
                time = new Date();
                logTime();
                log += " level " + level + " started";
                    
                Crafty.scene("main");
            });
        });
			
		//displays a waiting for other player message
        message.text("WAITING FOR ANOTHER PLAYER");
	});
        
	//displays a loading message
	Crafty.background('#000');
	message = Crafty.e("2D, DOM, Text").attr({w:400, x: 200, y: 300})
                                       .text("LOADING")
                                       .css({"text-align": "center", "color":"#fff"});
    });
    
//the main game scene
Crafty.scene("main", function() {
	if(playerNumber == 1)
		socket.emit('nextLevel', level, playerNumber, channelNumber);
	
	//triggers to notify the players to move to the next level
	//passes them the level they need to draw as data
    socket.on("advance", function(data){
    	if(data == -1){
    		Crafty.scene("end");
    	}
    	else{
    		currentMap = data;
       	    Crafty.scene("level");
        }
    });
    
    //triggers to notify the player tha their partner finished the level (they both move on to the next level)
    socket.on("alertOtherPlayer", function(){
    	level++;
    	//go to a between level screen
    });
    
    //triggers when the players need to restart the level
    socket.on("restart", function(){
    	logTime();
    	log += " level " + level + " restarted";
    	Crafty.scene("level");
    });
        
    //tells the player that the other player left the game
    socket.on("playerLeft", function(message){
        alert(message); 
    });
    
    //drops a block at given position
    socket.on('dropBlock', function(xpos, ypos){
        //place the block at the received location
        placeBlock(xpos, ypos);
            
        //make sure their are 3 or less blocks currently placed
        //remove the block that was placed the longest ago
        if (blocksPlaced.length > 3){
            blocksPlaced[0].destroy();
            blocksPlaced = blocksPlaced.slice(1);
        }
            
        //log that a block was placed
        logTime();
        log += " block placed at (" + xpos + "," + ypos + ")"
    });
        
    //triggers when the ball is teleported to your side of the screen
    socket.on("teleported", function(x, y, direction){
        box = drawBall(x, y);
        if (direction == "left")
            box.move.left = true;
        else if(direction == "right")
            box.move.right = true;
        else if(direction == "up")
            box.move.up = true;
        else if(direction == "down")
            box.move.down = true;
    });
    
    //triggers when a box button is pressed
	socket.on("boxButton", function(buttonNumber){
    	alert("box button pressed");
    	//add in the effect you want the button to have for that level
    	
    });
    
    //triggers when a ball button is pressed
    socket.on("ballButton", function(buttonNumber){
    	//add in the effect you want the button to have for that level
    	if(playerNumber == 2){
    		if(level == 1){
    			drawBox(WALL_WIDTH_HEIGHT, BOARD_HEIGHT - WALL_WIDTH_HEIGHT*7);
    			drawBox(BOARD_WIDTH - WALL_WIDTH_HEIGHT, BOARD_HEIGHT - WALL_WIDTH_HEIGHT*7);
    		}
    	}
    });
    
    //triggers when a player button is pressed
    socket.on("playerButton", function(buttonNumber){
    	alert("player button pressed");
    	//add in the effect you want the button to have for that level
    	
    });
    
    //logs the position of player 2
    socket.on("logPosition", function(x, y){
        logTime();
        log += " player2: position = (" + x + "," + y + ")";
    });
        
    //sends message in input box to server when you hit enter
    //resets the input box
    $('#msg').keyup(function(key){
        if(key.which == 13){
            var message = $('#msg').val();
            socket.emit('sendMessage', message, channelNumber);
            $('#msg').val("");
        }
    });
        
    //print out any messages received from other player
    socket.on('newMessage', function(sender, message){
		if (sender == nick)
			$("#data_received").append("<br/><i>" + message +"</i>");
	    else 
			$("#data_received").append("<br /><b>" + message +"</b>");

        //log the message that was received
        logTime();
        log += " " + message;
          
        //scroll down to the last thing in box of receieved messages
        var objDiv = document.getElementById("data_received");
        objDiv.scrollTop = objDiv.scrollHeight;
    });
});

//generic level scene, main scene is only called once then afterwards only level is called
//this means you don't create duplicate socket listeners
Crafty.scene("level", function(){
	
	//initializes all obstacle variables to empty
	blocksPlaced = [];
   	portals1 = [];
    portals2 = [];
    
	drawLevel();
	
	//sends message in input box to server when you hit enter
    //resets the input box
	$('#msg').keyup(function(key){
        if(key.which == 13){
	        var message = $('#msg').val();
            socket.emit('sendMessage', message, channelNumber);
            $('#msg').val("blah");
        }
    });
});

//the victory screen
Crafty.scene("end", function(){
	//logs that you won
    logTime();
    log += " Winner";
        
    //Displays the end message to the player
    Crafty.background('#000');
    message = Crafty.e("2D, DOM, Text").attr({w: 400, h: 20, x: 200, y: 390})
                                       .text("!!!!   YOU WIN   !!!!")
                                       .css({"text-align": "center", "color":"#fff"});
});

function placeBlock(xpos, ypos){
	var box = drawBox(xpos, ypos);
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
}

function drawCCWBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("CCWBouncyBox").ccwbouncybox(xpos, ypos);
}

function drawCWBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("CWBouncyBox").cwbouncybox(xpos, ypos);
}

function drawBallGate(xpos, ypos){
	var ballGate = Crafty.e("BallGate").ballgate(xpos, ypos);
}

function drawPlayerGate(xpos, ypos){
	var playerGate = Crafty.e("PlayerGate").playergate(xpos, ypos);
}

function drawBallButton(xpos, ypos, buttonNumber){
	var ballButton = Crafty.e("BallButton").ballbutton(xpos, ypos, buttonNumber);
}

function drawPlayerButton(xpos, ypos, buttonNumber){
	var playerButton = Crafty.e("PlayerButton").playerbutton(xpos, ypos, buttonNumber);
}

function drawBoxButton(xpos, ypos, buttonNumber){
	var boxButton = Crafty.e("BoxButton").boxbutton(xpos, ypos, buttonNumber);
}

function drawTeleporter(xpos, ypos){
    var teleporter = Crafty.e("Teleporter").teleporter(xpos, ypos);
}

function drawPortal(xpos, ypos){
	var portal = Crafty.e("Portal").portal(xpos, ypos); 
	return portal;
}

function placeGoal(xpos, ypos){
	var goal = Crafty.e("Goal").goal(xpos, ypos);
}

function drawLevel(){
	Crafty.background("blue");
	var player = Crafty.e("Player").player(playerNumber);
			   
	var playerButtonNumber = 0;
	var boxButtonNumber = 0;
	var ballButtonNumber = 0;
	var map = currentMap;
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
					break;
				}
				//cyan
				case 3:{
					drawCCWBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//cyan
				case 4:{
					drawCWBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//gray
				case 5:{
					drawTeleporter(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//green
				case 6:{
					if(playerNumber == 2)
						player.setPosition(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//light green
				case 7:{
					drawPlayerButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, playerButtonNumber);
					playerButtonNumber++;
					break;
				}
				//light red
				case 8:{
					drawBoxButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, boxButtonNumber);
					boxButtonNumber++;
					break;
				}
				//orange
				case 9:{
					placeGoal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//pink
				case 10:{
					drawPlayerGate(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//puke
				case 11:{
					drawBallButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, ballButtonNumber);
					ballButtonNumber++;
					break;
				}
				//purple
				case 12:{
					drawBall(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//red
				case 13:{
					if(playerNumber == 1)
						player.setPosition(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//yellow
				case 14:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 270);
					break;
				}
				//yellow
				case 15:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 90);
					break;
				}
				//yellow
				case 16:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 0);
					break;
				}
				//yellow
				case 17:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 180);
					break;
				}
				//white
				case 18:{
					var index = Math.round((parseFloat(map[column][row]) - 18)*1000)/1000;
					if(portals1[index] == null)
						portals1[index] = drawPortal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					else
						portals2[index] = drawPortal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
			}
		}
	}
}


