
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
				//page down key
				else if(key.which == 34){
				level -= 2;
				level = (level < 0 ? 0 : level);
				socket.emit("advance", level, playerNumber);
				}
			});
		}
		
		mode.setupGame();

		levelHints = [];
    		hintsManager = Crafty.e("Hints").hints(0);
		
		if(playerNumber == 1)
			socket.emit("advance", level, playerNumber);
	});
});

