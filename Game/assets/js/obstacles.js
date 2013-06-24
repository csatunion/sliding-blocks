var legendInfo = {"goal":["orange","goal (your partner may have it)"],
		  "bouncy":["cyan","bouncy box"], 
		  "moving":["yellow", "moving block"],
		  "player_gate":["pink","passage for the ball"],
		  "ball_gate":["brown","passage for the player"], 
		  "ball_button":["#666600","button (activated by ball)"],
		  "player_button":["#99FF66", "button (activated by player)"],
		  "box_button":["#cc6666", "button (activated by obstacle)"],
		  "teleporter":["#555555","teleporter"],
		  "portal":["#000000","portal"],
		  "player1":["red","you"],
		  "player2":["green","you"],
		  "ball":["purple","ball (your partner may have it)"]};

Crafty.c("Box", {

	init : function() {
		this.requires("2D, DOM, Collision, box");
	},

	box : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
		});
		
		return this;
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
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
		});

		this.color("cyan");

		return this;
	}
});

Crafty.c("BallGate", {

	init : function() {
		this.requires("2D, DOM, Color");
	},

	ballgate : function(xpos, ypos) {
		this.attr({
			x : xpos,
			y : ypos,
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
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
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
		});

		this.color("pink");

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
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
		});

		this.color("#555555");

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
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
		});

		this.color("#000000");

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
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
		});

		this.color("orange");

		return this;
	}
});

