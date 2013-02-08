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
		
		this.bind("Remove", function(){
			console.log("hi");
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
				
				hints = [];

				
				hints.push(drawArrow(ball.x + ball.w/2, ball.y + ball.h + WALL_WIDTH_HEIGHT, 270));
				hints.push(drawArrow(ball.x/1.5, WALL_WIDTH_HEIGHT*2, 180));
				hints.push(drawArrow(ball.x/3, WALL_WIDTH_HEIGHT*2, 180));
				hints.push(drawArrow(WALL_WIDTH_HEIGHT*2, ball.y + ball.h*5, 90));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + WALL_WIDTH_HEIGHT, this.y - WALL_WIDTH_HEIGHT, "A path to victory has been displayed. Push the ball along it to win.", 0));
						
				this.bind("Moved", function removeHint(){
					this.unbind("Moved", removeHint);
					
					destroyHints([4]);
					
					this.bind("Ball", function removeHint2(){
						this.unbind("Ball", removeHint2);
						destroyHints([0])
						
						this.bind("Ball", function removeHint3(){
							this.unbind("Ball", removeHint3);
							destroyHints([0, 1, 2]);
						});
					});
					
				})
				
				
			}
			else if(level == 1){
				hints = [];
				hints.push(Crafty.e("2D, Canvas, Rectangle").rect(this.x, this.y - WALL_WIDTH_HEIGHT*6));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + WALL_WIDTH_HEIGHT, this.y - WALL_WIDTH_HEIGHT*6, "Place a block here with the CRTL key to create a path to the goal.", 0));
				this.bind("Block", function(){
					destroyHints([0,1]);
					hints.push(drawArrow(ball.x + ball.w/2, ball.y + ball.h + WALL_WIDTH_HEIGHT*4, 90));
					hints.push(drawArrow(goal.x + WALL_WIDTH_HEIGHT*3, goal.y + goal.h/2, 180));
					this.bind("Ball", function(){
						destroyHints([0]);
					});
				});
			}
			else if(level == 2){
				hints = [];
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(this.x + WALL_WIDTH_HEIGHT, this.y, "Every portal is connected to one other portal. Use this to find a path to the goal", 0, 150, 100));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(portals1[0].x + WALL_WIDTH_HEIGHT, portals1[0].y, "1", 0, 40, 40));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(portals2[0].x, portals2[0].y, "1", 0, 40, 40));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(portals1[1].x + WALL_WIDTH_HEIGHT, portals1[1].y, "2", 0, 40, 40));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(portals2[1].x + WALL_WIDTH_HEIGHT, portals2[1].y, "2", 0, 40, 40));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(portals1[2].x + WALL_WIDTH_HEIGHT, portals1[2].y, "3", 0, 40, 40));
				hints.push(Crafty.e("2D, Canvas, TextBubble").textbubble(portals2[2].x + WALL_WIDTH_HEIGHT, portals2[2].y + WALL_WIDTH_HEIGHT, "3", 0, 40, 40));
				
				this.bind("Moved", function(){
					if(this._firstMove){
						this._firstMove = false;
						destroyHints([0]);
					}
				});
				
			}
		}
		else{
			
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
		    if (e.key == Crafty.keys.CTRL) {
				if (tutorial){
			    	socket.emit('sendPosTutorial', this.x, this.y, channelNumber);
			    	this.trigger("Block");	
			   	}
				else
			    	socket.emit('sendPos', this.x, this.y, channelNumber);
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
