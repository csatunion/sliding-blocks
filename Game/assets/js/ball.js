Crafty.c("Ball", {

	_speed : 4,

	init : function() {
		this.requires("2D, DOM, Color, BallCollision");
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
			framesSinceFirstMove : 0
		});

		this.color("purple");

		this.bind("EnterFrame", function() {
			if (this.move.left)
				this.x -= this._speed;
			else if (this.move.right)
				this.x += this._speed;
			else if (this.move.up)
				this.y -= this._speed;
			else if (this.move.down)
				this.y += this._speed;

			if (this.startedMoving) {
				this.framesSinceFirstMove++;

				if (this.framesSinceFirstMove >= 2) {
					this.framesSinceFirstMove = 0;
					this.startedMoving = false;
				}
			}
		});
		
		return this;
	}
});

Crafty.c("BallCollision", {
	
	init: function(){
		this.requires("Collision");
		this.onHit("Player", function(e) {
			if (this.move.left) {
				this.x = e[0].obj.x + e[0].obj.w;
				this.move.left = false;
			} else if (this.move.right) {
				this.x = e[0].obj.x - this.w;
				this.move.right = false;
			} else if (this.move.up) {
				this.y = e[0].obj.y + e[0].obj.h;
				this.move.up = false;
			} else if (this.move.down) {
				this.y = e[0].obj.y - this.h;
				this.move.down = false;
			}
		});

		this.onHit("Box", function(e) {
			if (this.startedMoving) {
				if (this.move.left) {
					this.x = e[0].obj.x + e[0].obj.w;
					this.move.left = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.up = true;
					else
						this.move.down = true;
				} else if (this.move.right) {
					this.x = e[0].obj.x - this.w;
					this.move.right = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.up = true;
					else
						this.move.down = true;
				} else if (this.move.up) {
					this.y = e[0].obj.y + e[0].obj.h;
					this.move.up = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.right = true;
					else
						this.move.left = true;
				} else if (this.move.down) {
					this.y = e[0].obj.y - this.h;
					this.move.down = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.right = true;
					else
						this.move.left = true;
				}
			} else {
				if (this.move.left) {
					this.x = e[0].obj.x + e[0].obj.w;
					this.move.left = false;
				} else if (this.move.right) {
					this.x = e[0].obj.x - this.w;
					this.move.right = false;
				} else if (this.move.up) {
					this.y = e[0].obj.y + e[0].obj.h;
					this.move.up = false;
				} else if (this.move.down) {
					this.y = e[0].obj.y - this.h;
					this.move.down = false;
				}
			}
		});

		this.onHit("BouncyBox", function(e) {
			if (this.move.left) {
				this.x = e[0].obj.x + e[0].obj.w;
				this.move.left = false;
				this.move.up = true;
			} else if (this.move.right) {
				this.x = e[0].obj.x - this.w;
				this.move.right = false;
				this.move.down = true;
			} else if (this.move.up) {
				this.y = e[0].obj.y + e[0].obj.h;
				this.move.up = false;
				this.move.right = true;
			} else if (this.move.down) {
				this.y = e[0].obj.y - this.h;
				this.move.down = false;
				this.move.left = true;
			}
		});

		this.onHit("Portal", function(e) {
			connectingPortal = portals1.indexOf(e[0].obj);

			if (connectingPortal == -1) {
				connectingPortal = portals2.indexOf(e[0].obj);
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
		});

		this.onHit("BallButton", function(e) {
			if (e[0].obj.firstHit) {
				socket.emit("ballButtonPressed", e[0].obj.number, channelNumber);
				e[0].obj.firstHit = false;
			}
		});
		
		this.onHit("BallGate", function(e){
			if (this.startedMoving) {
				if (this.move.left) {
					this.x = e[0].obj.x + e[0].obj.w;
					this.move.left = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.up = true;
					else
						this.move.down = true;
				} else if (this.move.right) {
					this.x = e[0].obj.x - this.w;
					this.move.right = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.up = true;
					else
						this.move.down = true;
				} else if (this.move.up) {
					this.y = e[0].obj.y + e[0].obj.h;
					this.move.up = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.right = true;
					else
						this.move.left = true;
				} else if (this.move.down) {
					this.y = e[0].obj.y - this.h;
					this.move.down = false;
					if (Crafty.math.randomInt(0, 1))
						this.move.right = true;
					else
						this.move.left = true;
				}
			} else {
				if (this.move.left) {
					this.x = e[0].obj.x + e[0].obj.w;
					this.move.left = false;
				} else if (this.move.right) {
					this.x = e[0].obj.x - this.w;
					this.move.right = false;
				} else if (this.move.up) {
					this.y = e[0].obj.y + e[0].obj.h;
					this.move.up = false;
				} else if (this.move.down) {
					this.y = e[0].obj.y - this.h;
					this.move.down = false;
				}
			}
		});

		this.onHit("Teleporter", function(e) {
			if (this.move.left)
				direction = "left";
			else if (this.move.right)
				direction = "right";
			else if (this.move.up)
				direction = "up";
			else if (this.move.down)
				direction = "down";

			socket.emit("teleport", e[0].obj.x, e[0].obj.y, direction, channelNumber);
			this.destroy();
		})

		this.onHit('Goal', function() {
			level++;
			socket.emit("nextLevel", channelNumber);
			if (level == MAXLEVEL) {
				Crafty.scene("end");
			} else {
				Crafty.scene("level");
			}
		})
	}
});
