Crafty.c("Player", {

    _PLAYER_WIDTH_HEIGHT : PLAYER_WIDTH_HEIGHT,

	init : function() {
		this.requires("2D, DOM, Color, CollisionDetection");
	},

    player : function(playerNumber) {
		this.attr({
			x : 0,
			y : -this._PLAYER_WIDTH_HEIGHT,
			w : this._PLAYER_WIDTH_HEIGHT,
			h : this._PLAYER_WIDTH_HEIGHT,
			move : {
				left : false,
				right : false,
				up : false,
				down : false
			}
		});

		if (playerNumber == 1)
			this.color("red");
		else
			this.color("green");

		this.addComponent("Controls");

		this.bind("EnterFrame", function() {
			currentTime = new Date();

			if (currentTime.getTime() - time.getTime() >= 200) {
				time = currentTime;
				//if (playerNumber == 1) {
					//logTime();
					//log += " player1: position = (" + this.x + "," + this.y + ")";
				    gameLog("position " + this.x + " " + this.y);
				//} else {
					//socket.emit("logPos", this.x, this.y, channelNumber);
				//}
			}
		});

		return this;
	},

	setPosition : function(xpos, ypos) {
		this.x = xpos;
		this.y = ypos;
	}
});

//defines movement for players
//players can move freely and can drop blocks on other screen with spacebar.
Crafty.c("Controls", {

	_speed : 4,

	init : function() {
		this.requires("Keyboard");

		this.bind("EnterFrame", function() {
			if (this.move.left)
				this.x -= this._speed;
			else if (this.move.right)
				this.x += this._speed;
			else if (this.move.up)
				this.y -= this._speed;
			else if (this.move.down)
				this.y += this._speed;

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
	}
});

Crafty.c("CollisionDetection", {

	init : function() {
		this.requires("Collision");
		this.onHit("Box", function() {

			this.move.left = this.move.right = this.move.up = this.move.down = false;

			for (var i = 1; i <= this._speed; i++) {
				this.x += i;
				if (this.hit("Box") != false) {
					this.x -= i;
					this.x -= i;
					if (this.hit("Box") != false) {
						this.x += i;
						this.y -= i;
						if (this.hit("Box") != false) {
							this.y += i;
							this.y += i;
							if (this.hit("Box") != false) {
								this.y -= i;
							} else {
								i = this._speed + 1;
							}
						} else {
							i = this._speed + 1;
						}
					} else {
						i = this._speed + 1;
					}
				} else {
					i = this._speed + 1;
				}
			}

		});
		
		this.onHit("CCWBouncyBox", function() {

			this.move.left = this.move.right = this.move.up = this.move.down = false;

			for (var i = 1; i <= this._speed; i++) {
				this.x += i;
				if (this.hit("CCWBouncyBox") != false) {
					this.x -= i;
					this.x -= i;
					if (this.hit("CCWBouncyBox") != false) {
						this.x += i;
						this.y -= i;
						if (this.hit("CCWBouncyBox") != false) {
							this.y += i;
							this.y += i;
							if (this.hit("CCWBouncyBox") != false) {
								this.y -= i;
							} else {
								i = this._speed + 1;
							}
						} else {
							i = this._speed + 1;
						}
					} else {
						i = this._speed + 1;
					}
				} else {
					i = this._speed + 1;
				}
			}

		});
		
		this.onHit("CWBouncyBox", function() {

			this.move.left = this.move.right = this.move.up = this.move.down = false;

			for (var i = 1; i <= this._speed; i++) {
				this.x += i;
				if (this.hit("CWBouncyBox") != false) {
					this.x -= i;
					this.x -= i;
					if (this.hit("CWBouncyBox") != false) {
						this.x += i;
						this.y -= i;
						if (this.hit("CWBouncyBox") != false) {
							this.y += i;
							this.y += i;
							if (this.hit("CWBouncyBox") != false) {
								this.y -= i;
							} else {
								i = this._speed + 1;
							}
						} else {
							i = this._speed + 1;
						}
					} else {
						i = this._speed + 1;
					}
				} else {
					i = this._speed + 1;
				}
			}

		});
		

		this.onHit("PlayerButton", function(e) {
			if (e[0].obj.firstHit) {
				socket.emit("playerButtonPressed", e[0].obj.number, channelNumber);
				e[0].obj.firstHit = false;
			}
		});

		this.onHit("PlayerGate", function() {
			this.move.left = this.move.right = this.move.up = this.move.down = false;

			for (var i = 1; i <= this._speed; i++) {
				this.x += i;
				if (this.hit("PlayerGate") != false) {
					this.x -= i;
					this.x -= i;
					if (this.hit("PlayerGate") != false) {
						this.x += i;
						this.y -= i;
						if (this.hit("PlayerGate") != false) {
							this.y += i;
							this.y += i;
							if (this.hit("PlayerGate") != false) {
								this.y -= i;
							} else {
								i = this._speed + 1;
							}
						} else {
							i = this._speed + 1;
						}
					} else {
						i = this._speed + 1;
					}
				} else {
					i = this._speed + 1;
				}
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
		
		this.onHit("Ball", function(e) {
			if (this.move.left) {
				this.x = e[0].obj.x + e[0].obj.w;
				this.move.left = false;
				e[0].obj.move.left = true;
			} else if (this.move.right) {
				this.x = e[0].obj.x - this.w;
				this.move.right = false;
				e[0].obj.move.right = true;
			} else if (this.move.up) {
				this.y = e[0].obj.y + e[0].obj.h;
				this.move.up = false;
				e[0].obj.move.up = true;
			} else if (this.move.down) {
				this.y = e[0].obj.y - this.h;
				this.move.down = false;
				e[0].obj.move.down = true;
			}
			e[0].obj.startedMoving = true;
		});
		
		this.onHit("MovingBox", function(){
			socket.emit("restartLevel", channelNumber);
		});
	}
});
