Crafty.c("Ball", {

	init : function() {
		//this.requires("2D, DOM, Color, BallMovement");
            this.requires("2D, DOM, BallMovement, BallSprite");
	},

	ball : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 1,
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
		//this.color("purple");
		
		return this;
	}
});

Crafty.c("BallMovement", {
	
	_SPEED : 3,
	
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
			
			if((collisions = this.hit("Player")) != false){
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
			else if((collisions = this.hit("Box")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(this.startedMoving){
					if(direction == 0){
						this.x = collisions[0].obj.x - this.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.down = true;
							else
								this.move.up = true;
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.up = true;
							else
								this.move.down = true;
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 90){
						this.y = collisions[0].obj.y + collisions[0].obj.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.right = true;
							else
								this.move.left = true;
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.left = true;
							else
								this.move.right = true;
							this.x = this.x + this._SPEED;
						}
					}
					else if(direction == 180){
						this.x = collisions[0].obj.x + collisions[0].obj.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.down = true;
							else
								this.move.up = true;
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.up = true;
							else
								this.move.down = true;
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 270){
						this.y = collisions[0].obj.y - this.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.right = true;
							else
								this.move.left = true;
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.left = true;
							else
								this.move.right = true;
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
			else if((collisions = this.hit("BallGate")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(this.startedMoving){
					if(direction == 0){
						this.x = collisions[0].obj.x - this.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.down = true;
							else
								this.move.up = true;
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.up = true;
							else
								this.move.down = true;
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 90){
						this.y = collisions[0].obj.y + collisions[0].obj.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.right = true;
							else
								this.move.left = true;
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.left = true;
							else
								this.move.right = true;
							this.x = this.x + this._SPEED;
						}
					}
					else if(direction == 180){
						this.x = collisions[0].obj.x + collisions[0].obj.w;
						if(Crafty.math.randomInt(0,1)){
							this.y = this.y + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.down = true;
							else
								this.move.up = true;
							this.y = this.y - this._SPEED;
						}
						else{
							this.y = this.y - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.up = true;
							else
								this.move.down = true;
							this.y = this.y + this._SPEED;
						}
					}
					else if(direction == 270){
						this.y = collisions[0].obj.y - this.h;
						if(Crafty.math.randomInt(0,1)){
							this.x = this.x + this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.right = true;
							else
								this.move.left = true;
							this.x = this.x - this._SPEED;
						}
						else{
							this.x = this.x - this._SPEED;
							if(this.hit("Box") == false && this.hit("BallGate") == false)
								this.move.left = true;
							else
								this.move.right = true;
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
		    else if((collisions = this.hit("BouncyBox")) != false){
				this.move.left = this.move.right = this.move.up = this.move.down = false;
				
				if(direction == 0){
					this.x = collisions[0].obj.x - this.w;
					this.move.right = false;
					this.move.left = true;
				}
				else if(direction == 90){
					this.y = collisions[0].obj.y + collisions[0].obj.h;
					this.move.up = false;
					this.move.down = true;
				}
				else if(direction == 180){
					this.x = collisions[0].obj.x + collisions[0].obj.w;
					this.move.left = false;
					this.move.right  = true;
				}
				else if(direction == 270){
					this.y = collisions[0].obj.y - this.h;
					this.move.down = false;
					this.move.up = true;
				}
			}else if((collisions = this.hit("Portal")) != false){
				
				connectingPortal = portals1.indexOf(collisions[0].obj);

				if (connectingPortal == -1) {
					connectingPortal = portals2.indexOf(collisions[0].obj);
					connectingPortal = portals1[connectingPortal];
				} 
				else 
					connectingPortal = portals2[connectingPortal];

				if (this.move.left) {
					this.x = connectingPortal.x - connectingPortal.w;
					this.y = connectingPortal.y;
				} 
				else if (this.move.right) {
					this.x = connectingPortal.x + connectingPortal.w;
					this.y = connectingPortal.y;
				} 
				else if (this.move.down) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y + connectingPortal.h;
				} 
				else if (this.move.up) {
					this.x = connectingPortal.x;
					this.y = connectingPortal.y - connectingPortal.h;
				}
				Crafty.trigger("BallPortal");
			}
			else if((collisions = this.hit("Teleporter")) != false){
				socket.emit("teleport", collisions[0].obj.x, collisions[0].obj.y, direction);
				this.destroy();
			}
			else if((collisions = this.hit("Goal")) != false && this.hitGoal == false){
				this.hitGoal = true;
				socket.emit("advance", level, playerNumber);
				/*trigger a message with the level name here*/
			}
			
			Crafty.trigger("BallMoved");
		});
	}
});
