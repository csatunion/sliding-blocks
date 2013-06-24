
Crafty.scene("tutorial", function(){
	level = 0;
	playerNumber = 1;
	
	socket.emit("tutorial");
	
	$(document).bind("keyup", function(key){
		//ctrl key
		if(key.which == 17){
			var box = drawBox(player.x, player.y);
			box.addComponent("TutorialBox");
			blocksPlaced.push(box);
		
			if (blocksPlaced.length > 3){
				blocksPlaced[0].destroy();
				blocksPlaced = blocksPlaced.slice(1);
			}
			
			Crafty.trigger("Block");
		}
		
		if(DEBUG){
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
		}
	});
	
	levelHints = [tutLevel1Hints, tutLevel2Hints, tutLevel3Hints];
	
	socket.emit("advance", level, playerNumber);
});

function tutLevel1Hints(){
	hint = Crafty.e("Hints").hints();
	hint2= Crafty.e("Hints").hints();
	hint3= Crafty.e("Hints").hints();
	hint4= Crafty.e("Hints").hints();
				
	hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + CELL_SIZE, player.y - CELL_SIZE, "A path to victory has been displayed. Push the ball along it to win.", 0));
	hint2.addHint(drawArrow(ball.x + ball.w/2, ball.y + ball.h + CELL_SIZE, 90));
	hint3.addHint(drawArrow(ball.x/1.5, CELL_SIZE*2, 180));
	hint3.addHint(drawArrow(ball.x/3, CELL_SIZE*2, 180));
	hint4.addHint(drawArrow(CELL_SIZE*2, ball.y + ball.h*5, 270));
				
						
	Crafty.bind("PlayerMoved", function removeHint(){
		Crafty.unbind("PlayerMoved", removeHint);
		hint.destroyHints();
					
		$("#data_received").append("<br/><br/><b class=\"gameinfo\">You can restart the level at any time if you make a mistake.");
        var objDiv = document.getElementById("data_received");
       	objDiv.scrollTop = objDiv.scrollHeight;
					
		Crafty.bind("BallCollision", function removeHint2(){
			Crafty.unbind("BallCollision", removeHint2);
			hint2.destroyHints();
					
			Crafty.bind("BallCollision", function removeHint3(){
				Crafty.unbind("BallCollision", removeHint3);
				hint3.destroyHints();
							
				Crafty.bind("BallCollision", function removeHint4(){
					Crafty.unbind("BallCollision", removeHint4);
					hint4.destroyHints();
				});
			});
		});
	});
}

function tutLevel2Hints(){
	var hint = Crafty.e("Hints").hints();
	var hint2= Crafty.e("Hints").hints();
	var hint3= Crafty.e("Hints").hints();
				
	hint.addHint(Crafty.e("2D, Canvas, Rectangle").rect(player.x, player.y - CELL_SIZE*6));
	hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + CELL_SIZE, player.y - CELL_SIZE*6, "Place a block here with the CRTL key to create a path to the goal.", 0));
	Crafty.bind("Block", function removeHint1(){
		Crafty.unbind("Block", removeHint1);
		hint.destroyHints();
			
		hint3.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + CELL_SIZE, player.y, "A block has been placed under you.", 0))
					
		Crafty.bind("PlayerMoved", function removeHint2(){
			Crafty.unbind("PlayerMoved", removeHint2);
			hint3.destroyHints();
			
			hint.addHint(drawArrow(ball.x + ball.w/2, ball.y + ball.h + CELL_SIZE*4, 270));
			hint2.addHint(drawArrow(goal.x + CELL_SIZE*3, goal.y + goal.h/2, 180));
			Crafty.bind("BallCollision", function removeHint3(){
				Crafty.unbind("BallCollision", removeHint3);
				hint.destroyHints();
			});
		});
	});
}

function tutLevel3Hints(){
	var hint = Crafty.e("Hints").hints();
	var hint2= Crafty.e("Hints").hints();
				
	hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + CELL_SIZE, player.y, "Every portal is connected to one other portal. Push the ball into the portal to get to the goal.", 0, 150, 100));
	hint2.addHint(drawArrow(portals1[0].x + portals1[0].w/2, portals1[0].y - portals1[0].h/2, 270));
	hint2.addHint(drawArrow(portals2[0].x + portals2[0].w/2, portals2[0].y + 100, 270));
				
	Crafty.bind("PlayerMoved", function removeHint1(){
		Crafty.unbind("PlayerMoved", removeHint1);
		hint.destroyHints();
					
		Crafty.bind("BallPortal", function removeHint2(){
			Crafty.unbind("BallPortal", removeHint2);
					
			hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(portals1[0].x + 1.5*CELL_SIZE, portals1[0].y, "You can also move through the portals. Follow the ball to the other side.", 0, 150, 100));
						
			Crafty.bind("PlayerPortal", function removeHint3(){
				Crafty.unbind("PlayerPortal", removeHint3);
				hint2.destroyHints();
			})
		});
	});
}

