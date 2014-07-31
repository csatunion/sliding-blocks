		  
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

Crafty.c("Player", {

    // _logTime : new Date(),

    init : function() {
    	this.requires("2D, DOM, Color");   //, PlayerMovement");
    },

    player : function(playerNumber, xpos, ypos) {
	
	//console.log ("Drawing player " + playerNumber);

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
	
	//	this.playermovement();

	if (playerNumber == 1)
	    this.color("red");
	else
	    this.color("green");
	
	// this.bind("EnterFrame", function() {
	//     this._logPosition();
	// });
	
	return this;
    },

    
    // _logPosition : function(){
    // 	var currentTime = new Date();
	
    // 	if(currentTime.getTime() - this._logTime.getTime() >= LOG_INTERVAL) {
    // 	    this._logTime = currentTime;
    // 	    gameLog("position:" + this.x + " " + this.y + (ball ? " ball:" + ball.x + " " + ball.y : ""));
    // 	}
    // }
});


Crafty.c("Ball", {

    init : function() {
	this.requires("2D, DOM, Color, BallMovement");
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

	//this.teleporting();
	this.color("purple");
	
	return this;
    }
});

Crafty.c("BallMovement", {

    teleporting: false,

    init: function(){
	this.requires("Collision");

	this.onHit ("Teleporter", 
		    function () {
			if ( ! this.teleporting ) {
			    ballHolder = (ballHolder % 2) + 1;
			    console.log ("Ball teleported. Ball holder: " + ballHolder);
			    this.teleporting = true;
			}
		    },
		    function () {
			this.teleporting = false;
		    }
		   )
    }
});

