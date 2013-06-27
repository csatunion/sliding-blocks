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
		  
		  
Crafty.c("Obstacle", {
	init : function(){
		this.requires("2D, DOM");
	},
	
	obstacle : function(xpos, ypos, color){
		this.attr({
			x : xpos,
			y : ypos,
			w : CELL_SIZE,
			h : CELL_SIZE,
			z : 0
		});
		
		if(color){
			this.requires("Color");
			this.color(color);
		}
	}
});

Crafty.c("StaticObstacle", {
	init : function(){
		this.requires("Obstacle");
	},
	
	staticobstacle : function(xpos, ypos, type, color){
		this.obstacle(xpos, ypos, color);
		this.addComponent(type);

		return this;
	}
});

Crafty.c("DynamicObstacle", {
	init : function(){
		this.requires("Obstacle, Collision");
	},
	
	dynamicobstacle : function(xpos, ypos, type, color){
		this.obstacle(xpos, ypos, color);
		this.addComponent(type);
		
		return this;
	}
});

