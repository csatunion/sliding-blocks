
Crafty.scene("game", function(){
    unbindKeyListeners();

	level = 0;
	
	//displays a waiting message
	Crafty.e("2D, DOM, Text").attr({w:WIDTH-20, x: 10, y: 10})
                             .text("WAITING FOR ANOTHER PLAYER")
                             .css({"text-align": "left", "color":"#fff"});
	
	socket.emit("game");
	
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
		hintsManager.addHint(0, drawTextBubble(ball.x + CELL_SIZE*12, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
		hintsManager.addHint(0, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
	}else{
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
		hintsManager.addHint(1, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}
}

function level2Hints(){
	hintsManager = Crafty.e("Hints").hints(2);
	
	if(playerNumber == 1){
		hintsManager.addHint(0, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
		hintsManager.addHint(1, drawTextBubble(player.x + player.w, player.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(1);
		});
	}else{
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "Now you have the ball and the goal so you must instruct your partner.", 0, 150, 80));
		hintsManager.addHint(1, drawRect(ball.x + CELL_SIZE*14, ball.y));
		hintsManager.addHint(1, drawTextBubble(ball.x + CELL_SIZE*15, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
		hintsManager.addHint(1, drawTextBubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}
}

function level3Hints(){
	hintsManager = Crafty.e("Hints").hints(1);
	
	if(playerNumber == 1){
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}else{
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "You have the goal and your partner has the ball.", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}
}

function level4Hints(){
	hintsManager = Crafty.e("Hints").hints(1);
	
	if(playerNumber == 1){
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "Now the situation is reversed and you have the goal and not the ball.", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}else{
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}
}

function level5Hints(){
	hintsManager = Crafty.e("Hints").hints(1);
	
	if(playerNumber == 1){
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "The Tutorial is over. Good Luck!", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}else{
		hintsManager.addHint(0, drawTextBubble(player.x + player.w, player.y, "The Tutorial is over. Good Luck!", 0, 150, 80));
		hintsManager.bind("PlayerMoved", function removeHint(){
			hintsManager.unbind("PlayerMoved", removeHint);
			hintsManager.destroyHints(0);
		});
	}
}
