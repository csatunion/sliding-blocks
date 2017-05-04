
Crafty.scene("tutorial", function(){
	level = 0; 
	playerNumber = 1;
	
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
			
			gameLog("block: " + box.x + " " + box.y);
			
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
	
	levelHints = [tutLevel1Hints, tutLevel2Hints, tutLevel3Hints];
	
	socket.emit("tutorial", function(){
		socket.emit("advance", level, playerNumber);
	});
});


function tutLevel1Hints(){
	hintsManager = Crafty.e("Hints").hints(4);
				
//	hintsManager.addHint(0, drawTextBubble(player.x + CELL_SIZE, player.y - 0.5*CELL_SIZE, "A path to victory has been displayed. Push the ball along it to win.", 0));
//	hintsManager.addHint(1, drawArrow(ball.x + ball.w/2, ball.y + ball.h + CELL_SIZE, 90));
//	hintsManager.addHint(2, drawArrow(ball.x/1.5, CELL_SIZE*2, 180));
//	hintsManager.addHint(2, drawArrow(ball.x/3, CELL_SIZE*2, 180));
//	hintsManager.addHint(3, drawArrow(CELL_SIZE*2, ball.y + ball.h*5, 270));
//						
//	hintsManager.bind("PlayerMoved", function removeHint(){
//		hintsManager.unbind("PlayerMoved", removeHint);
//		hintsManager.destroyHints(0);
//					
//		hintsManager.bind("BallCollision", function removeHint2(){
//			hintsManager.unbind("BallCollision", removeHint2);
//			hintsManager.destroyHints(1);
//					
//			hintsManager.bind("BallCollision", function removeHint3(){
//				hintsManager.unbind("BallCollision", removeHint3);
//				hintsManager.destroyHints(2);
//							
//				hintsManager.bind("BallCollision", function removeHint4(){
//					hintsManager.unbind("BallCollision", removeHint4);
//					hintsManager.destroyHints(3);
//				});
//			});
//		});
//	});

	var bubble1 = Crafty.e("2D, DOM, Image")
		.image("images/bubble-medium.png", "no-repeat")
		.attr({x: 400, y: 250, z: 0});

	var hint1 = Crafty.e("2D, DOM, Text")
		.attr({w : 170, h : 200, x : 415, y : 260})
		.text("A path to victory has been displayed. Push the ball along it to win!")
		.textFont({size : '13px', weight: 'bold'})
		.textColor('yellow');
}

function tutLevel2Hints(){
	hintsManager = Crafty.e("Hints").hints(2);
//				
//	hintsManager.addHint(0, Crafty.e("2D, Canvas, Rectangle").rect(player.x, player.y - CELL_SIZE*6));
//	hintsManager.addHint(0, Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + CELL_SIZE, player.y - CELL_SIZE*6, "Place a block here with the CRTL key to create a path to the goal.", 0));
//	
//	hintsManager.bind("Block", function removeHint1(){
//		hintsManager.unbind("Block", removeHint1);
//		hintsManager.destroyHints(0);
//			
//		hintsManager.addHint(0, Crafty.e("2D, Canvas, TextBubble").textbubble(player.x + CELL_SIZE, player.y, "A block has been placed under you.", 0))
//					
//		hintsManager.bind("PlayerMoved", function removeHint2(){
//			hintsManager.unbind("PlayerMoved", removeHint2);
//			hintsManager.destroyHints(0);
//			
//			hintsManager.addHint(0, drawArrow(ball.x + ball.w/2, ball.y + ball.h + CELL_SIZE*4, 270));
//			hintsManager.addHint(1, drawArrow(goal.x + CELL_SIZE*3, goal.y + goal.h/2, 180));
//			hintsManager.bind("BallCollision", function removeHint3(){
//				hintsManager.unbind("BallCollision", removeHint3);
//				hintsManager.destroyHints(0);
//				
//				hintsManager.bind("BallCollision", function removeHint4(){
//					hintsManager.unbind("BallCollision", removeHint4);
//					hintsManager.destroyHints(1);
//				});
//			});
//		});
//	});

	var bubble2 = Crafty.e("2D, DOM, Image")
		.image("images/bubble-medium.png", "no-repeat")
		.attr({x: 320, y: 265, z: 0});

	var hint2 = Crafty.e("2D, DOM, Text")
		.attr({w : 170, h : 200, x : 335, y : 275})
		.text("Place a block here with the CRTL key to create a path to the goal.")
		.textFont({size : '13px', weight: 'bold'})
		.textColor('yellow');

	bubble2.bind("Block", function ()
	{
		this.image("images/bubble-small.png", "no-repeat");
		this.attr({x: 320, y: 290, z: 0});
	});

	hint2.bind("Block", function ()
	{
		this.attr({w : 170, h : 200, x : 330, y : 300});
		this.text("A block has been placed under you.");
		this.textFont({size : '13px', weight: 'bold'});
	});

}

function tutLevel3Hints(){
	hintsManager = Crafty.e("Hints").hints(2);
//				
//	hintsManager.addHint(0, drawTextBubble(player.x + CELL_SIZE, player.y, "Every portal is connected to one other portal. Push the ball into the portal to get to the goal.", 0, 150, 100));
//	hintsManager.addHint(1, drawArrow(portals1[0].x + portals1[0].w/2, portals1[0].y - portals1[0].h/2, 270));
//	hintsManager.addHint(1, drawArrow(portals2[0].x + portals2[0].w/2, portals2[0].y + 100, 270));
//				
//	hintsManager.bind("PlayerMoved", function removeHint1(){
//		hintsManager.unbind("PlayerMoved", removeHint1);
//		hintsManager.destroyHints(0);
//					
//		hintsManager.bind("BallPortal", function removeHint2(){
//			hintsManager.unbind("BallPortal", removeHint2);
//					
//			hintsManager.addHint(1, Crafty.e("2D, Canvas, TextBubble").textbubble(portals1[0].x + 1.5*CELL_SIZE, portals1[0].y, "You can also move through the portals. Follow the ball to the other side.", 0, 150, 100));
//						
//			hintsManager.bind("PlayerPortal", function removeHint3(){
//				hintsManager.unbind("PlayerPortal", removeHint3);
//				hintsManager.destroyHints(1);
//			})
//		});
//	});

	var bubble2 = Crafty.e("2D, DOM, Image")
		.image("images/bubble-medium.png", "no-repeat")
		.attr({x: 80, y: 290, z: 0});

	var hint2 = Crafty.e("2D, DOM, Text")
		.attr({w : 170, h : 200, x : 97, y : 300})
		.text("You can move through the portals. Follow the ball to the other side.")
		.textFont({size : '13px', weight: 'bold'})
		.textColor('yellow');

}
