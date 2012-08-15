Crafty.c("Ball", {

	_SPEED : 4,

	init : function() {
		this.requires("2D, DOM, Color, BallMovement");
	},

	ball : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT,
			move : {
				left : false,
				right : false,
				up : false,
				down : false
			},
			startedMoving : false,
			framesSinceFirstMove : 0,
			hitGoal : false
		});
		
		this.ballmovement();
		this.color("purple");
		
		return this;
	}
});

Crafty.c("BallMovement", {
	
	init: function(){
		this.requires("Collision");
	},
	
	ballmovement : function(){
		this.bind("EnterFrame", function(){
			
			if (this.startedMoving) {
				this.framesSinceFirstMove++;

				if (this.framesSinceFirstMove >= 2) {
					this.framesSinceFirstMove = 0;
					this.startedMoving = false;
				}
			}
			
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
		
		this.bind("Moved", function(direction){
			var collisions;
			
			if(this.hit("Player") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("Player");
				
				if(direction == 0)
					this.x = collisions[0].obj.x - this.w;
				else if(direction == 90)
					this.y = collisions[0].obj.y + collisions[0].obj.h;
				else if(direction == 180)
					this.x = collisions[0].obj.x + collisions[0].obj.w;
				else if(direction == 270)
					this.y = collisions[0].obj.y - this.h;
			}
			else if(this.hit("Box") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("Box");
				
				if(this.startedMoving){
					if(direction == 0){
						this.x = collisions[0].obj.x - this.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.down = true;
							}
							else{
								this.move.up = true;
							}
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.up = true;
							}
							else{
								this.move.down = true;
							}
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 90){
						this.y = collisions[0].obj.y + collisions[0].obj.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.right = true;
							}
							else{
								this.move.left = true;
							}
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.left = true;
							}
							else{
								this.move.right = true;
							}
							this.x = this.x + this._SPEED;
						}
					}
					else if(direction == 180){
						this.x = collisions[0].obj.x + collisions[0].obj.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.down = true;
							}
							else{
								this.move.up = true;
							}
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.up = true;
							}
							else{
								this.move.down = true;
							}
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 270){
						this.y = collisions[0].obj.y - this.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.right = true;
							}
							else{
								this.move.left = true;
							}
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.left = true;
							}
							else{
								this.move.right = true;
							}
							this.x = this.x + this._SPEED;
						}
					}
				}
				else{
					if(direction == 0)
						this.x = collisions[0].obj.x - this.w;
					else if(direction == 90)
						this.y = collisions[0].obj.y + collisions[0].obj.h;
					else if(direction == 180)
						this.x = collisions[0].obj.x + collisions[0].obj.w;
					else if(direction == 270)
						this.y = collisions[0].obj.y - this.h;
				}
			}
			else if(this.hit("BallGate") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("BallGate");
				
				if(this.startedMoving){
					if(direction == 0){
						this.x = collisions[0].obj.x - this.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.down = true;
							}
							else{
								this.move.up = true;
							}
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.up = true;
							}
							else{
								this.move.down = true;
							}
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 90){
						this.y = collisions[0].obj.y + collisions[0].obj.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.right = true;
							}
							else{
								this.move.left = true;
							}
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.left = true;
							}
							else{
								this.move.right = true;
							}
							this.x = this.x + this._SPEED;
						}
					}
					else if(direction == 180){
						this.x = collisions[0].obj.x + collisions[0].obj.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.down = true;
							}
							else{
								this.move.up = true;
							}
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.up = true;
							}
							else{
								this.move.down = true;
							}
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 270){
						this.y = collisions[0].obj.y - this.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.right = true;
							}
							else{
								this.move.left = true;
							}
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false){
								this.move.left = true;
							}
							else{
								this.move.right = true;
							}
							this.x = this.x + this._SPEED;
						}
					}
				}
				else{
					if(direction == 0)
						this.x = collisions[0].obj.x - this.w;
					else if(direction == 90)
						this.y = collisions[0].obj.y + collisions[0].obj.h;
					else if(direction == 180)
						this.x = collisions[0].obj.x + collisions[0].obj.w;
					else if(direction == 270)
						this.y = collisions[0].obj.y - this.h;
				}
			}
			else if(this.hit("CCWBouncyBox") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("CCWBouncyBox");
				
				if(direction == 0){
					this.x = collisions[0].obj.x - this.w;
					this.move.right = false;
					this.move.up = true;
				}
				else if(direction == 90){
					this.y = collisions[0].obj.y + collisions[0].obj.h;
					this.move.up = false;
					this.move.left = true;
				}
				else if(direction == 180){
					this.x = collisions[0].obj.x + collisions[0].obj.w;
					this.move.left = false;
					this.move.down  = true;
				}
				else if(direction == 270){
					this.y = collisions[0].obj.y - this.h;
					this.move.down = false;
					this.move.right = true;
				}
			}
			else if(this.hit("CWBouncyBox") != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				collisions = this.hit("CWBouncyBox");
				
				if(direction == 0){
					this.x = collisions[0].obj.x - this.w;
					this.move.right = false;
					this.move.down = true;
				}
				else if(direction == 90){
					this.y = collisions[0].obj.y + collisions[0].obj.h;
					this.move.up = false;
					this.move.right = true;
				}
				else if(direction == 180){
					this.x = collisions[0].obj.x + collisions[0].obj.w;
					this.move.left = false;
					this.move.up  = true;
				}
				else if(direction == 270){
					this.y = collisions[0].obj.y - this.h;
					this.move.down = false;
					this.move.left = true;
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
				if (this.move.left) {
					this.x = connectingPortal.x - connectingPortal.w;
					this.y = connectingPortal.y;
				} else if (this.move.right) {
					this.x = connectingPortal.x + connectingPortal.w;
					this.y = connectingPortal.y;
				} else if (this.move.down) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y + connectingPortal.h;
				} else if (this.move.up) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y - connectingPortal.h;
				}
			}
			else if(this.hit("BallButton") != false){
				collisions = this.hit("BallButton");
				
				if (collisions[0].obj.firstHit) {
					socket.emit("ballButtonPressed", collisions[0].obj.number, channelNumber);
					collisions[0].obj.firstHit = false;
				}
			}
			else if(this.hit("Teleporter") != false){
				collisions = this.hit("Teleporter");
				
				socket.emit("teleport", collisions[0].obj.x, collisions[0].obj.y, direction, channelNumber);
				this.destroy();
			}
			else if(this.hit("Goal") != false && this.hitGoal == false){
				this.hitGoal = true;
				socket.emit("alertOtherPlayer", channelNumber);
				level++;
				socket.emit("nextLevel", level, playerNumber, channelNumber);
			}
		});
	}
});