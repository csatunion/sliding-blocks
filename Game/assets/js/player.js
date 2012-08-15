Crafty.c("Player", {

    _LOG_INTERVAL : 200,
    _PLAYER_WIDTH_HEIGHT : PLAYER_WIDTH_HEIGHT,

	init : function() {
		this.requires("2D, DOM, Color, PlayerMovement");
	},

    player : function(playerNumber, xpos, ypos) {

		this.attr({
			x : xpos,
			y : ypos,
			w : this._PLAYER_WIDTH_HEIGHT,
			h : this._PLAYER_WIDTH_HEIGHT,
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
		});

		return this;
	},

	
	_logPosition : function(){
		currentTime = new Date();
		
		if(currentTime.getTime() - time.getTime() >= this._LOG_INTERVAL) {
			time = currentTime;
		    gameLog("position:" + this.x + " " + this.y);
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
			if (e.key == Crafty.keys.CTRL)
				socket.emit('sendPos', this.x, this.y, channelNumber);
		});
		
		this.bind("Moved", function(direction){
			var collisions;
			if(this.hit("Box") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("Box");
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if(this.hit("SimpleBouncyBox") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("SimpleBouncyBox");
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if(this.hit("CCWBouncyBox") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("CCWBouncyBox");
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if(this.hit("CWBouncyBox") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("CWBouncyBox");
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if(this.hit("PlayerGate") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("PlayerGate");
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if(this.hit("Teleporter") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("Teleporter");
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if(this.hit("PlayerButton") != false){
				
				collisions = this.hit("PlayerButton");
				
				if(collisions[0].obj.firstHit){
					socket.emit("playerButtonPressed", collisions[0].obj.number, channelNumber);
					collisions[0].obj.firstHit = false;
				}
			}
			else if(this.hit("Portal") != false){
				
				collisions = this.hit("Portal");
				
				connectingPortal = portals1.indexOf(collisions[0].obj);

				if (connectingPortal == -1) {
					connectingPortal = portals2.indexOf(collisions[0].obj);
					connectingPortal = portals1[connectingPortal];
				} else {
					connectingPortal = portals2[connectingPortal];
				}

				if (direction == 180) {
					this.x = connectingPortal.x - connectingPortal.w;
					this.y = connectingPortal.y;
				} else if (direction == 0) {
					this.x = connectingPortal.x + connectingPortal.w;
					this.y = connectingPortal.y;
				} else if (direction == 270) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y + connectingPortal.h;
				} else if (direction == 90) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y - connectingPortal.h;
				}
			}
			else if(this.hit("MovingBox") != false){
				socket.emit("restartLevel", channelNumber);
			}
			else if(this.hit("Ball") != false){
				collisions = this.hit("Ball");
				
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
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
			else if(this.hit("Goal") != false){
				collisions = this.hit("Goal");
				
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
