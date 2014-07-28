		  
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

