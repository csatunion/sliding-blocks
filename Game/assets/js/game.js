
Crafty.scene("game", function(){
	level = 0;
	
	//displays a waiting message
	Crafty.e("2D, DOM, Text").attr({w:WIDTH-20, x: 10, y: 10})
                             .text("WAITING FOR ANOTHER PLAYER")
                             .css({"text-align": "left", "color":"#fff"});
	
	socket.emit("game");
	
	socket.once("setup", function(playerNum){
		playerNumber = playerNum;
		
		$('#msg').bind("keyup", function(key){
			//enter key
			if(key.which == 13){
				var message = $('#msg').val();
				socket.emit('message', message);
				$('#msg').val("");
				$("#data_received").append("<br/><i>" + message +"</i>");

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
			
			if(DEBUG){
				//page up key
				if(key.which == 33){
					socket.emit("advance", level, playerNumber);
				}
				/*
				//page down key
				else if(key.which == 34){
					level -= 2;
					level = (level < 0 ? 0 : level);
					socket.emit("advance", level, playerNumber);
				}
				*/
			}
		});
		
		levelHints = [level1Hints, level2Hints, level3Hints, level4Hints, level5Hints];
		
		if(playerNumber == 1)
			socket.emit("advance", level, playerNumber);
	});
});

function level1Hints(){
	var hint = Crafty.e("Hints").hints();
	var hint2= Crafty.e("Hints").hints();
	
	if(playerNumber == 1){
		hint.addHint(Crafty.e("2D, Canvas, Rectangle").rect(ball.x + CELL_SIZE*11, ball.y));
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(ball.x + CELL_SIZE*12, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
	}else{
		hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}
}

function level2Hints(){
	var hint = Crafty.e("Hints").hints();
	var hint2= Crafty.e("Hints").hints();
	var hint3= Crafty.e("Hints").hints();
	
	if(playerNumber == 1){
		hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}else{
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "Now you have the ball and the goal so you must instruct your partner.", 0, 150, 80));
		hint2.addHint(Crafty.e("2D, Canvas, Rectangle").rect(ball.x + CELL_SIZE*14, ball.y));
		hint3.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(ball.x + CELL_SIZE*15, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
		hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(CELL_SIZE/2, CELL_SIZE*22, "Type your messages here.", 0, 125, 50));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}
}

function level3Hints(){
	var hint = Crafty.e("Hints").hints();
	
	if(playerNumber == 1){
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}else{
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "You have the goal and your partner has the ball.", 0, 150, 80));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}
}

function level4Hints(){
	var hint = Crafty.e("Hints").hints();
	
	if(playerNumber == 1){
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "Now the situation is reversed and you have the goal and not the ball.", 0, 150, 80));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}else{
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}
}

function level5Hints(){
	var hint = Crafty.e("Hints").hints();
	
	if(playerNumber == 1){
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "The Tutorial is over. Good Luck!", 0, 150, 80));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}else{
		hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + player.w, player.y, "The Tutorial is over. Good Luck!", 0, 150, 80));
		Crafty.bind("PlayerMoved", function removeHint(){
			Crafty.unbind("PlayerMoved", removeHint);
			hint.destroyHints();
		});
	}
}
