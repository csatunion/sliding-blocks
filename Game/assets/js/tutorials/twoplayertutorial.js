
Crafty.scene("twotutorial", function(){
	unbindKeyListeners();
	level = 0; 
//	playerNumber = 1;


	//displays a waiting message
	Crafty.e("2D, DOM, Text").attr({w:WIDTH-20, x: 10, y: 10})
                             .text("WAITING FOR ANOTHER PLAYER")
                             .css({"text-align": "left", "color":"#fff"});
	
	socket.emit("twotutorial");
	
	socket.once("setup", function(player_number){
		playerNumber = player_number;
	    console.log ("I am player no. " + player_number);
		
		$('#msg').bind("keyup", function(key){
			//enter key
			if(key.which == 13){
				var message = $('#msg').val().replace('\n','');
				socket.emit('message', message);
				$('#msg').val("");
				$("#data_received").append("<div class='message_spacing'></br></div><i>" + message +"</i>");

				var objDiv = document.getElementById("data_received");
				objDiv.scrollTop = objDiv.scrollHeight;
			}
		});
	$(document).bind("keyup", function(key){
		//ctrl key
		if(key.which == 17){
			socket.emit("block", player.x, player.y);
				Crafty.trigger("Block");
		}
	});
	
	if(DEBUG){
		$(document).bind("keyup", function(key){
			//page up key
			if(key.which == 33){
				socket.emit("advance", level, playerNumber);
			}
			//page down key
			else if(key.which == 34){
				level -= 2;
				level = (level < 0 ? 0 : level);
				socket.emit("advance", level, playerNumber);
			}
		});
	}
	
	
	mode.setupGame();
	
	levelHints = [level1Hints, level2Hints, level3Hints, level4Hints, level5Hints];
		
	if(playerNumber == 1)
		socket.emit("advance", level, playerNumber);
	});
});

function level1Hints(){
	hintsManager = Crafty.e("Hints").hints(2);
	
	if(playerNumber == 1){
		hintsManager.addHint(0, drawRect(ball.x + CELL_SIZE*11, ball.y));
//		hintsManager.addHint(0, drawTextBubble(ball.x + CELL_SIZE*12, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
//		hintsManager.addHint(0, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
		
		var bubble1 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-medium.png", "no-repeat")
			.attr({x: 355, y: 230, z: 0});

		var hint1 = Crafty.e("2D, DOM, Text")
			.attr({w : 170, h : 200, x : 380, y : 250})
			.text("Instruct your partner to put a block here.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');

		var bubble2 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-small.png", "no-repeat")
			.attr({x: 0, y: 385, z: 0});

		var hint2 = Crafty.e("2D, DOM, Text")
			.attr({w : 130, h : 200, x : 10, y : 395})
			.text("Type your messages here.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');

	}else{
//		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
//		hintsManager.addHint(1, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
//		hintsManager.bind("PlayerMoved", function removeHint(){
//			hintsManager.unbind("PlayerMoved", removeHint);
//			hintsManager.destroyHints(0);
//		});

		var bubble3 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-big-long.png", "no-repeat")
			.attr({x: 235, y: 125, z: 0});

		var hint3 = Crafty.e("2D, DOM, Text")
			.attr({w : 200, h : 200, x : 252, y : 140})
			.text("Your partner has the ball and the goal. Listen for their instructions ...")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');

		var bubble4 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-small.png", "no-repeat")
			.attr({x: 0, y: 385, z: 0});

		var hint4 = Crafty.e("2D, DOM, Text")
			.attr({w : 130, h : 200, x : 10, y : 395})
			.text("Type your messages here.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	}
}

function level2Hints(){
	hintsManager = Crafty.e("Hints").hints(2);
	
	if(playerNumber == 1){
//		hintsManager.addHint(0, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
//		hintsManager.addHint(1, drawTextBubble(player.x + player.w, player.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
//		hintsManager.bind("PlayerMoved", function removeHint(){
//			hintsManager.unbind("PlayerMoved", removeHint);
//			hintsManager.destroyHints(1);
//		});
		var bubble5 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-big-long.png", "no-repeat")
			.attr({x: 240, y: 140, z: 0});

		var hint5 = Crafty.e("2D, DOM, Text")
			.attr({w : 200, h : 200, x : 255, y : 155})
			.text("Your partner has the ball and the goal. Listen for their instructions ...")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');

		var bubble6 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-small.png", "no-repeat")
			.attr({x: 0, y: 385, z: 0});

		var hint6 = Crafty.e("2D, DOM, Text")
			.attr({w : 130, h : 200, x : 10, y : 395})
			.text("Type your messages here.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	}else{
//		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "Now you have the ball and the goal so you must instruct your partner.", 0, 150, 80));
		hintsManager.addHint(1, drawRect(ball.x + CELL_SIZE*14, ball.y));
//		hintsManager.addHint(1, drawTextBubble(ball.x + CELL_SIZE*15, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
//		hintsManager.addHint(1, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
//		hintsManager.bind("PlayerMoved", function removeHint(){
//			hintsManager.unbind("PlayerMoved", removeHint);
//			hintsManager.destroyHints(0);
//		});
		var bubble7 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-medium.png", "no-repeat")
			.attr({x: 370, y: 90, z: 0});

		var hint7 = Crafty.e("2D, DOM, Text")
			.attr({w : 170, h : 200, x: 395, y: 110})
			.text("Instruct your partner to put a block here.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');

		var bubble8 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-big-long.png", "no-repeat")
			.attr({x: 260, y: 280, z: 0});

		var hint8 = Crafty.e("2D, DOM, Text")
			.attr({w : 190, h : 200, x : 275, y : 290})
			.text("Now you have the ball and the goal so you must instruct your partner.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');

		var bubble9 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-small.png", "no-repeat")
			.attr({x: 0, y: 385, z: 0});

		var hint9 = Crafty.e("2D, DOM, Text")
			.attr({w : 130, h : 200, x : 10, y : 395})
			.text("Type your messages here.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	
	}
}

function level3Hints(){
	hintsManager = Crafty.e("Hints").hints(1);
	
	if(playerNumber == 1){
//		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
//		hintsManager.bind("PlayerMoved", function removeHint(){
//			hintsManager.unbind("PlayerMoved", removeHint);
//			hintsManager.destroyHints(0);
//		});
		
		var bubble10 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-big-long-flip.png", "no-repeat")
			.attr({x: 140, y: 80, z: 0});

		var hint10 = Crafty.e("2D, DOM, Text")
			.attr({w : 180, h : 200, x : 155, y : 90})
			.text("You have the ball and your partner has the goal. Use the teleporter to send the ball to your partner.")
			.textFont({size : '12px', weight: 'bold'})
			.textColor('yellow');
	}else{
//		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "You have the goal and your partner has the ball.", 0, 150, 80));
//		hintsManager.bind("PlayerMoved", function removeHint(){
//			hintsManager.unbind("PlayerMoved", removeHint);
//			hintsManager.destroyHints(0);
//		});
		var bubble11 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-medium.png", "no-repeat")
			.attr({x: 130, y: 250, z: 0});

		var hint11 = Crafty.e("2D, DOM, Text")
			.attr({w : 170, h : 200, x: 150, y: 260})
			.text("You have the goal and your partner has the ball.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	}
}

function level4Hints(){
	hintsManager = Crafty.e("Hints").hints(2);
	
	if(playerNumber == 1){
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "Now the situation is reversed and you have the goal and not the ball.", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});

		var bubble12 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-big-long.png", "no-repeat")
			.attr({x: 240, y: 140, z: 0});

		var hint12 = Crafty.e("2D, DOM, Text")
			.attr({w : 200, h : 200, x : 255, y : 155})
			.text("Now the situation is reversed and you have the goal and not the ball.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	}else{
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});

		var bubble13 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-medium.png", "no-repeat")
			.attr({x: 370, y: 90, z: 0});

		var hint13 = Crafty.e("2D, DOM, Text")
			.attr({w : 170, h : 200, x: 395, y: 110})
			.text("This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	}
}

function level5Hints(){
	hintsManager = Crafty.e("Hints").hints(2);
	
	if(playerNumber == 1){
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "The Tutorial is over. Good Luck!", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});

		var bubble14 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-small.png", "no-repeat")
			.attr({x: 240, y: 140, z: 0});

		var hint14 = Crafty.e("2D, DOM, Text")
			.attr({w : 160, h : 200, x : 255, y : 155})
			.text("The Tutorial is over. Good Luck!")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	}else{
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "The Tutorial is over. Good Luck!", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
		var bubble15 = Crafty.e("2D, DOM, Image")
			.image("images/bubble-small.png", "no-repeat")
			.attr({x: 370, y: 90, z: 0});

		var hint15 = Crafty.e("2D, DOM, Text")
			.attr({w : 160, h : 200, x: 395, y: 110})
			.text("he Tutorial is over. Good Luck!")
			.textFont({size : '13px', weight: 'bold'})
			.textColor('yellow');
	}
}
