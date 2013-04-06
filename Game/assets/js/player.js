Crafty.c("Player", {

    _LOG_INTERVAL : 200,
    _SEND_INTERVAL : 30000,
    _sendTime : new Date(),
    _logTime : new Date(),
    _firstMove : true,

	init : function() {
		this.requires("2D, DOM, Color, PlayerMovement");
	},

    player : function(playerNumber, xpos, ypos) {

		this.attr({
			x : xpos,
			y : ypos,
			w : PLAYER_WIDTH_HEIGHT,
			h : PLAYER_WIDTH_HEIGHT,
			z : 2,
			move : {
				left : false,
				right : false,
				up : false,
				down : false
			}
		});
		
		this.playermovement();

		if (playerNumber == 1)
			this.color("red");
		else
			this.color("green");

		this.bind("EnterFrame", function() {
			if(playingGame)
				this._logPosition();
				this._sendLog();	
		});
		
		return this;
	},

	
	_logPosition : function(){
		var currentTime = new Date();
		
		if(currentTime.getTime() - this._logTime.getTime() >= this._LOG_INTERVAL) {
			this._logTime = currentTime;
		    gameLog("position:" + this.x + " " + this.y);
		}
	},
	
	_sendLog : function(){
		var currentTime = new Date();
		
		if(currentTime.getTime() - this._sendTime.getTime() >= this._SEND_INTERVAL){
			this._sendTime = currentTime;
			socket.emit("log", logText);
			logText = "";
		}
	},
	
	drawHints : function(){
		if(tutorial){
			if(level == 0){
				
				hint = Crafty.e("Hints").hints();
				hint2= Crafty.e("Hints").hints();
				hint3= Crafty.e("Hints").hints();
				hint4= Crafty.e("Hints").hints();
				
				hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + WALL_WIDTH_HEIGHT, this.y - WALL_WIDTH_HEIGHT, "A path to victory has been displayed. Push the ball along it to win.", 0));
				hint2.addHint(drawArrow(ball.x + ball.w/2, ball.y + ball.h + WALL_WIDTH_HEIGHT, 270));
				hint3.addHint(drawArrow(ball.x/1.5, WALL_WIDTH_HEIGHT*2, 180));
				hint3.addHint(drawArrow(ball.x/3, WALL_WIDTH_HEIGHT*2, 180));
				hint4.addHint(drawArrow(WALL_WIDTH_HEIGHT*2, ball.y + ball.h*5, 90));
				
				
						
				this.bind("Moved", function removeHint(){
					this.unbind("Moved", removeHint);
					hint.destroyHints();
					
					$("#data_received").append("<br/><br/><b class=\"gameinfo\">You can restart the level at any time if you make a mistake.");
           			var objDiv = document.getElementById("data_received");
       				objDiv.scrollTop = objDiv.scrollHeight;
					
					this.bind("Ball", function removeHint2(){
						this.unbind("Ball", removeHint2);
						hint2.destroyHints();
						
						this.bind("Ball", function removeHint3(){
							this.unbind("Ball", removeHint3);
							hint3.destroyHints();
							
							this.bind("Ball", function removeHint4(){
								this.unbind("Ball", removeHint4);
								hint4.destroyHints();
							});
						});
					});
				});
				
			}
			else if(level == 1){
				var hint = Crafty.e("Hints").hints();
				var hint2= Crafty.e("Hints").hints();
				var hint3= Crafty.e("Hints").hints();
				
				hint.addHint(Crafty.e("2D, Canvas, Rectangle").rect(this.x, this.y - WALL_WIDTH_HEIGHT*6));
				hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + WALL_WIDTH_HEIGHT, this.y - WALL_WIDTH_HEIGHT*6, "Place a block here with the CRTL key to create a path to the goal.", 0));
				this.bind("Block", function level2_1(){
					this.unbind("Block", level2_1);
					hint.destroyHints();
					
					hint3.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + WALL_WIDTH_HEIGHT, this.y, "A block has been placed under you.", 0))
					
					this.bind("Moved", function level2_2(){
						this.unbind("Moved", level2_2);
						hint3.destroyHints();
					});
					
					
					hint.addHint(drawArrow(ball.x + ball.w/2, ball.y + ball.h + WALL_WIDTH_HEIGHT*4, 90));
					hint2.addHint(drawArrow(goal.x + WALL_WIDTH_HEIGHT*3, goal.y + goal.h/2, 180));
					this.bind("Ball", function(){
						hint.destroyHints();
					});
				});
			}
			else if(level == 2){
				var hint = Crafty.e("Hints").hints();
				var hint2= Crafty.e("Hints").hints();
				
				hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + WALL_WIDTH_HEIGHT, this.y, "Every portal is connected to one other portal. Push the ball into the portal to get to the goal.", 0, 150, 100));
				hint2.addHint(drawArrow(portals1[0].x + portals1[0].w/2, portals1[0].y - portals1[0].h/2, 90));
				hint2.addHint(drawArrow(portals2[0].x + portals2[0].w/2, portals2[0].y + 100, 90));
				
				this.bind("Moved", function removeHint(){
					this.unbind("Moved", removeHint);
					hint.destroyHints();
					
					this.bind("BallPortal", function addHint(){
						this.unbind("BallPortal", addHint);
						
						hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(portals1[0].x + 1.5*WALL_WIDTH_HEIGHT, portals1[0].y, "You can also move through the portals. Follow the ball to the other side.", 0, 150, 100));
						
						this.bind("PlayerPortal", function removeHint2(){
							this.unbind("PlayerPortal", removeHint2);
							hint2.destroyHints();
						})
					});
				});
			}
		}
		else{
			if(level == 0){
				if(playerNumber == 1){
					hint = Crafty.e("Hints").hints();
					hint.addHint(Crafty.e("2D, Canvas, Rectangle").rect(ball.x + WALL_WIDTH_HEIGHT*11, ball.y));
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(ball.x + WALL_WIDTH_HEIGHT*12, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(WALL_WIDTH_HEIGHT/2, WALL_WIDTH_HEIGHT*22, "Type your messages here.", 0, 125, 50));
				}else{
					hint = Crafty.e("Hints").hints();
					hint2 = Crafty.e("Hints").hints();
					hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(WALL_WIDTH_HEIGHT/2, WALL_WIDTH_HEIGHT*22, "Type your messages here.", 0, 125, 50));
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					});
				}
			}else if(level == 1){
				var hint = Crafty.e("Hints").hints();
				var hint2= Crafty.e("Hints").hints();
				var hint3= Crafty.e("Hints").hints();
				if(playerNumber == 1){
					hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(WALL_WIDTH_HEIGHT/2, WALL_WIDTH_HEIGHT*22, "Type your messages here.", 0, 125, 50));
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "Your partner has the ball and the goal. Listen for their instructions", 0, 150, 80));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					});
				}else{
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "Now you have the ball and the goal so you must instruct your partner.", 0, 150, 80));
					hint2.addHint(Crafty.e("2D, Canvas, Rectangle").rect(ball.x + WALL_WIDTH_HEIGHT*14, ball.y));
					hint3.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(ball.x + WALL_WIDTH_HEIGHT*15, ball.y, "Instruct your partner to put a block here.", 0, 150, 50));
					hint2.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(WALL_WIDTH_HEIGHT/2, WALL_WIDTH_HEIGHT*22, "Type your messages here.", 0, 125, 50));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					})
				}
			}else if(level == 2){
				var hint = Crafty.e("Hints").hints();
				var hint2= Crafty.e("Hints").hints();
				var hint3= Crafty.e("Hints").hints();
				if(playerNumber == 1){
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					});
				}else{
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "You have the goal and your partner has the ball.", 0, 150, 80));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					})
				}
			}else if(level == 3){
				var hint = Crafty.e("Hints").hints();
				var hint2= Crafty.e("Hints").hints();
				var hint3= Crafty.e("Hints").hints();
				if(playerNumber == 1){
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "Now the situation is reversed and you have the goal and not the ball.", 0, 150, 80));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					});
				}else{
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "This time you have the ball and your partner has the goal. Use the teleporter to give the ball to your partner.", 0, 150, 125));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					})
				}
			}else if(level == 4){
				var hint = Crafty.e("Hints").hints();
				var hint2= Crafty.e("Hints").hints();
				var hint3= Crafty.e("Hints").hints();
				if(playerNumber == 1){
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "You are on your own from here on out. Good Luck!", 0, 150, 80));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					});
				}else{
					hint.addHint(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + this.w, this.y, "You are on your own from here on out. Good Luck!", 0, 150, 80));
					this.bind("Moved", function removeHint(){
						this.unbind("Moved", removeHint);
						hint.destroyHints();
					})
				}
			}
		}		
	}
});

//defines movement for players
//players can move freely and can drop blocks on other screen with spacebar.
//also checks for collisions with other entities after moving
Crafty.c("PlayerMovement", {

	_SPEED : 4,

	init : function() {
		this.requires("Keyboard");
		this.requires("Collision");
	},
	
	playermovement : function(){
		this.bind("EnterFrame", function() {
			
			if(this.hit("MovingBox") != false)
				socket.emit("restartLevel", channelNumber);
			
			if (this.move.left){
				this.x -= this._SPEED;
				this.trigger("Moved", 180);
			}
			else if (this.move.right){
				this.x += this._SPEED;
				this.trigger("Moved", 0);
			}
			else if (this.move.up){
				this.y -= this._SPEED;
				this.trigger("Moved", 90);
			}
			else if (this.move.down){
				this.y += this._SPEED;
				this.trigger("Moved", 270);
			}	
		});
		
		this.bind("KeyDown", function(e) {
			this.move.left = this.move.right = this.move.up = this.move.down = false;

			if (e.key == Crafty.keys.LEFT_ARROW)
				this.move.left = true;
			else if (e.key == Crafty.keys.RIGHT_ARROW)
				this.move.right = true;
			else if (e.key == Crafty.keys.UP_ARROW)
				this.move.up = true;
			else if (e.key == Crafty.keys.DOWN_ARROW)
				this.move.down = true;
		});

		this.bind("KeyUp", function(e) {
			if (e.key == Crafty.keys.LEFT_ARROW)
				this.move.left = false;
			if (e.key == Crafty.keys.RIGHT_ARROW)
				this.move.right = false;
			if (e.key == Crafty.keys.UP_ARROW)
				this.move.up = false;
			if (e.key == Crafty.keys.DOWN_ARROW)
				this.move.down = false;
			if(tutorial){
				if(e.key == Crafty.keys.CTRL){
					socket.emit('sendPosTutorial', this.x, this.y, channelNumber);
			    	this.trigger("Block");	
				}
				if(e.key == Crafty.keys.SPACE){
					socket.emit("advance", level);
				}
			}else{
				if(e.key == Crafty.keys.CTRL){
					socket.emit('sendPos', this.x, this.y, channelNumber);
				}
			}
		});
		
		this.bind("Moved", function(direction){
			var collisions;
			
			if((collisions = this.hit("Box")) != false && !this.hit("TutorialBox")){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if((collisions = this.hit("SimpleBouncyBox")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if((collisions = this.hit("CCWBouncyBox")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if((collisions = this.hit("CWBouncyBox")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if((collisions = this.hit("PlayerGate")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if((collisions = this.hit("Teleporter")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if((collisions = this.hit("PlayerButton")) != false){
				
				if(collisions[0].obj.firstHit){
					socket.emit("playerButtonPressed", collisions[0].obj.number, channelNumber);
					collisions[0].obj.firstHit = false;
				}
			}
			else if((collisions = this.hit("Portal")) != false){
				
				connectingPortal = portals1.indexOf(collisions[0].obj);

				if (connectingPortal == -1) {
					connectingPortal = portals2.indexOf(collisions[0].obj);
					connectingPortal = portals1[connectingPortal];
				} 
				else
					connectingPortal = portals2[connectingPortal];

				if (direction == 180) {
					this.x = connectingPortal.x - connectingPortal.w;
					this.y = connectingPortal.y;
				} 
				else if (direction == 0) {
					this.x = connectingPortal.x + connectingPortal.w;
					this.y = connectingPortal.y;
				} 
				else if (direction == 270) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y + connectingPortal.h;
				} 
				else if (direction == 90) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y - connectingPortal.h;
				}
				
				this.trigger("PlayerPortal");
			}
			else if(this.hit("MovingBox") != false){
				socket.emit("restartLevel", channelNumber);
			}
			else if((collisions = this.hit("Ball")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				this.trigger("Ball");
				
				if(direction == 0){
					this.x = collisions[0].obj.x - this.w;
					collisions[0].obj.move.right = true;
				}
				else if(direction == 90){
					this.y = collisions[0].obj.y + collisions[0].obj.h;
					collisions[0].obj.move.up = true;	
				}
				else if(direction == 180){
					this.x = collisions[0].obj.x + collisions[0].obj.w;
					collisions[0].obj.move.left = true;	
				}
				else if(direction == 270){
					this.y = collisions[0].obj.y - this.h;
					collisions[0].obj.move.down = true;
				}
				
				collisions[0].obj.startedMoving = true;
			}
			else if((collisions = this.hit("Goal")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
		});
	}
});
