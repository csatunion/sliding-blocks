//allows you to skip levels with shift key when true
var debug = true;

//level attributes
var level = 1;
var currentMap;
var background;

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
	    
	    if(!tutorial){
	    	tutorial = confirm("Do you want to play the tutorial?");
	    
	    	if(tutorial){
	    		socket.emit("tutorial");
	    		Crafty.scene("tutorial");
	    	}
	    	else{
	    		socket.emit("game");
	    		socket.on("setup", function(id, number, channel){
					playingGame = true;
					gameid = id;
	    			playerNumber = number;
    				channelNumber = channel;
					gameLog("startgame");

    				Crafty.scene("main");
	    		});
	    	}
	    }
	    else{
	    	socket.emit("game");
	    	socket.on("setup", function(id, number, channel){
				playingGame = true;
				gameid = id;
	    		playerNumber = number;
    			channelNumber = channel;
				gameLog("startgame");

    			Crafty.scene("main");
	    	});
	    }
	    
	});
});

Crafty.scene("tutorial", function(){
	
	
	socket.emit("advance", level);
	
	socket.on("goToNextLevel", function(data, bg){
		if(data == -1){
			level = 1;
			Crafty.scene("loading");
		}
		else{
			currentMap = data;
			background = bg;
			Crafty.scene("level");
		}
	});
	
});


    
//the main game scene
//is called once after the setup to create all the client event listeners
Crafty.scene("main", function() {
	
	//don't want to create duplicate event listeners if they replay
	//so it only makes the event listeners on the first playthrough
	if(firstPlayThrough){
		
		//allows you to skip levels with shift key when true
		if(debug){
			$(document).keyup(function(key){
				if(key.which == 16){
					socket.emit("alertOtherPlayer", channelNumber);
					level++;
					socket.emit("nextLevel", level, gameid, playerNumber, channelNumber);
				}
			});
		}
		
		
		
		//triggers to notify the players to move to the next level
		//passes them the level they need to draw as data
    	socket.on("advance", function(map, bg_name){
    	
    	    if(map == -1) {
		    	gameLog("gameend");
    		    Crafty.scene("end");
	    	}
    		else{
    		    currentMap = map;
    		    background = bg_name;
    		    gameLog("levelstart:" + level);
       	    	Crafty.scene("level");
        	}
    	});   

    	//triggers to notify the player that their partner finished the level (they both move on to the next level)
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
    	    level = 1;
   	    	socket.emit("log", logText);
    	    logText = "";
    	    
    	    playingGame = false;
    	    
    	    
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
   
   //load the first level
   if(playerNumber == 1)
		socket.emit('nextLevel', level, gameid, playerNumber, channelNumber);
});

Crafty.scene("level", function(){
	
	if(!tutorial){
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
	
	//initializes all obstacle variables to empty
	blocksPlaced = [];
	buttonEffects = [];
	}
	Crafty.e("2D, DOM, Image")
		.attr({x: 0, y: 0, z: -1})
		.image(background);
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

