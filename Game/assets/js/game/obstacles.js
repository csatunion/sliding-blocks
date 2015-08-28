var legendInfo = {"goal":["../images/goal.png","goal (your partner may have it)"], /*orange*/
		  "bouncy":["../images/bouncy-box.png","bouncy box"], /*cyan*/
		  "teleporter":["../images/teleporter.png","teleporter"], /*#555555*/
		  "portal":["../images/portal.png","portal"], /*#000000*/
		  "player1":["../images/Player1orange.png","you"],
		  "player2":["../images/Player2green.png","you"],
		  "ball":["../images/ball.png","ball (your partner may have it)"], /*purple*/
		  //"moving":["yellow", "moving block"],
		  "player_gate":["../images/player-gate.png","passage for the ball"], /*pink*/
		  "ball_gate":["../images/ball-gate.png","passage for the player"], /*brown*/
		  "ball_button":["../images/ball-button.png","button (activated by ball)"], /*#666600*/
		  "player_button":["../images/player-button.png", "button (activated by player)"], /*#99FF66*/
		  "box_button":["../images/box-button.png", "button (activated by obstacle)"] /*#cc6666*/ };
		  
		  
		  
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

