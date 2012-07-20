// normal box that all objects can't pass through
// USES: the walls and blocks players place
Crafty.c("Box", {

	init : function() {
		this.requires("2D, DOM, Collision, wall");
	},

	box : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT
		});

		this.onHit("BoxButton", function(e) {
			if (e[0].obj.firstHit) {
				alert("hit");
				socket.emit("boxButtonPressed", e[0].obj.number, channelNumber);
				e[0].obj.firstHit = false;
			}
		});

		return this;
	}
});

Crafty.c("MovingBox", {

	_speed : 4,

	init : function() {
		this.requires("2D, DOM, Color, Collision");
	},

	movingbox : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT,
			move : {
				left : true,
				right : false,
				up : false,
				down : false
			}
		});

		this.color("yellow");

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

		this.onHit("Box", function(e) {
			if (this.move.left) {
				this.x = e[0].obj.x + e[0].obj.w;
				this.move.left = false;
				this.move.right = true;
			} else if (this.move.right) {
				this.x = e[0].obj.x - this.w;
				this.move.right = false;
				this.move.left = true;
			} else if (this.move.up) {
				this.y = e[0].obj.y + e[0].obj.h;
				this.move.up = false;
				this.move.down = true;
			} else if (this.move.down) {
				this.y = e[0].obj.y - this.h;
				this.move.down = false;
				this.move.up = true;
			}
		});

		this.onHit("BouncyBox", function() {
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

		return this;
	},

	_setStartDirection : function(startDirection) {
		if (startDirection == "left")
			this.move.left = true;
		else if (startDirection == "right")
			this.move.right = true;
		else if (startDirection == "up")
			this.move.up = true;
		else if (startDirection == "down")
			this.move.down = true;
	}
});

Crafty.c("BouncyBox", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	bouncybox : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT
		});

		this.color("cyan");

		return this;
	}
});

// gate that only prevents a ball from moving through
// USES: impede the progress of a ball but not the player
Crafty.c("BallGate", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	ballgate : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT
		});

		this.color("brown");

		return this;
	}
});

Crafty.c("PlayerGate", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	playergate : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT
		});

		this.color("pink");

		return this;
	}
});

Crafty.c("BallButton", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	ballbutton : function(xpos, ypos, buttonNumber) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT,
			activated : false,
			firstHit : true,
			number : buttonNumber
		});

		this.color("#666600");

		return this;
	}
});

Crafty.c("PlayerButton", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	playerbutton : function(xpos, ypos, buttonNumber) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT,
			firstHit : true,
			number : buttonNumber
		});

		this.color("#99FF66");

		return this;
	}
});

Crafty.c("BoxButton", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	boxbutton : function(xpos, ypos, buttonNumber) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT,
			activated : false,
			firstHit : true,
			number : buttonNumber
		});

		this.color("#cc6666");

		return this;
	}
});

Crafty.c("Teleporter", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	teleporter : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT
		});

		this.color("gray");

		return this;
	}
});

Crafty.c("Portal", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	portal : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT
		});

		this.color("white");

		return this;
	}
});

Crafty.c("Goal", {
	init : function() {
		this.requires("2D, DOM, Color");
	},

	goal : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : WALL_WIDTH_HEIGHT,
			h : WALL_WIDTH_HEIGHT
		});

		this.color("orange");

		return this;
	}
});
