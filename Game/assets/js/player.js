Crafty.c("Player", {

    _logTime : new Date(),

	init : function() {
		this.requires("2D, DOM, Color, PlayerMovement");
	},

    player : function(playerNumber, xpos, ypos) {

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
			}
		});
		
		this.playermovement();

		if (playerNumber == 1)
			this.color("red");
		else
			this.color("green");
		
		this.bind("EnterFrame", function() {
			this._logPosition();
		});
		
		return this;
	},

	
	_logPosition : function(){
		var currentTime = new Date();
		
		if(currentTime.getTime() - this._logTime.getTime() >= LOG_INTERVAL) {
			this._logTime = currentTime;
			gameLog("position:" + this.x + " " + this.y + (ball ? " ball:" + ball.x + " " + ball.y : ""));
		}
	}
});

//defines movement for players
//players can move freely on the screen
//also checks for collisions with other entities after moving
Crafty.c("PlayerMovement", {

	_SPEED : 3,

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
				
				Crafty.trigger("PlayerPortal");
			}
			else if((collisions = this.hit("Ball")) != false){
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
				
				Crafty.trigger("BallCollision");
			}
			else if((collisions = this.hit("BallSpecific")) != false){
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
			
			Crafty.trigger("PlayerMoved");
		});
	}
});
