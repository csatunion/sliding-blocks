Crafty.c("TextBubble", {
	
	init:function(){
		this.requires("2D, Canvas");
	},
	
    textbubble: function(xpos, ypos, message) {
    	this.attr({
    		w:150, 
    		h:75, 
    		r:20,
    		z:1,
    		x:xpos,
    		y:ypos,
    		t:message
    	});
    	
        return this;
    },
    
    _addText: function(){
    	Crafty.e("2D, DOM, Text")
    		.attr({
    			x:this.x+10,
    			y:this.y-this.h+10,
    			w:this.w-20,
    			h:this.h-20
    		})
    		.text(this.t)
            .css({"text-align": "left", "color":"#fff"});
    },
    
    draw: function() {
		var r = this.x + this.w;
		var t = this.y - this.h;
		var x = this.x - this.r/2;
		var y = this.y - 10;
		var w = this.w;
		var h = this.h;
		var radius = this.r;
		
		var ctx = Crafty.canvas.context;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle="red";
		ctx.lineWidth = "3"
		ctx.moveTo(x+radius, y);
  		ctx.lineTo(x+radius/2, y+10);
  		ctx.lineTo(x+radius * 2, y);
  		ctx.lineTo(r-radius, y);
  		ctx.quadraticCurveTo(r, y, r, y-radius);
  		ctx.lineTo(r, t+radius);
  		ctx.quadraticCurveTo(r, t, r-radius, t);
  		ctx.lineTo(x+radius, t);
  		ctx.quadraticCurveTo(x, t, x, t+radius);
  		ctx.lineTo(x, y-radius);
 		ctx.quadraticCurveTo(x, y, x+radius, y);
		ctx.stroke();
		this._addText();
		
    }
});

Crafty.c("Arrow", {
	
	_CHANGETIME : 1000,
	_STARTTIME : new Date(),
	
	arrow:function(xpos, ypos, angle, xscale, yscale){
		this.attr({
			x:xpos,
			y:ypos,
			w:10,
			h:10,
			a:angle,
			sx:xscale || 1.75,
			sy:yscale || 1.75,
			color:"red"
		});
		
		this.bind("EnterFrame", function(){
			var currentTime = new Date();
		
			if(currentTime.getTime() - this._STARTTIME.getTime() >= this._CHANGETIME) {
				this._STARTTIME = currentTime;
				if(this.color == "cyan"){
					this.color = "red";
				}
				else{
					this.color = "cyan";
				}
				this.draw();
			}
			
		});
		
		return this;
	},
	
	draw:function(){
		var context = Crafty.canvas.context;
		context.save();
		context.translate(this.x, this.y);
		context.scale(this.sx, this.sy);
		context.rotate(this.a*Math.PI/180);
 		context.beginPath();
 	 	context.lineWidth = 3;
  		context.strokeStyle = this.color;
  		context.moveTo(0,0);
  		context.lineTo(-10,-5);
  		context.lineTo(0,0);
  		context.lineTo(-10,5);
  		context.lineTo(0,0);
  		context.lineTo(-30,0);  
  		context.stroke();
  		context.restore();
  		context.closePath();
	}
	
});

/*
 * xscale and yscale are optional arguments
 * direction: 0 = right, 90 = down, 180 = left, 270 = up
 */
function drawArrow(xpos, ypos, direction, xscale, yscale){
	return Crafty.e("2D, Canvas, Arrow").arrow(xpos, ypos, direction, xscale, yscale);
}

function placeBlock(xpos, ypos){

    if (!tutorial) {
		var box = drawBox(xpos, ypos);
		if(box.hit("Player") != false){
			socket.emit("boxHitSomething", channelNumber);
			box.destroy();
		}
		else if(box.hit("Ball") != false){
			socket.emit("boxHitSomething", channelNumber);
			box.destroy();
		}
		else
	    	blocksPlaced.push(box);
    }
    else {
		var box = drawTutorialBox(xpos, ypos);
		blocksPlaced.push(box);
    }    
}

function drawBox(xpos, ypos){
    var box = Crafty.e("Box").box(xpos, ypos);
    return box;
}

function drawTutorialBox(xpos, ypos){
    var box = Crafty.e("Box, TutorialBox").box(xpos, ypos);
    return box;
}

function drawBall(xpos, ypos){
    ball = Crafty.e("Ball").ball(xpos, ypos);
}

function drawMovingBox(xpos, ypos, direction){
    var movingBox = Crafty.e("MovingBox").movingbox(xpos, ypos, direction);
    return movingBox;
}

function drawSimpleBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("SimpleBouncyBox").simplebouncybox(xpos, ypos);
    return bouncyBox;
}

function drawCCWBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("CCWBouncyBox").ccwbouncybox(xpos, ypos);
    return bouncyBox;
}

function drawCWBouncyBox(xpos, ypos){
    var bouncyBox = Crafty.e("CWBouncyBox").cwbouncybox(xpos, ypos);
    return bouncyBox;
}

function drawBallGate(xpos, ypos){
	var ballGate = Crafty.e("BallGate").ballgate(xpos, ypos);
	return ballGate;
}

function drawPlayerGate(xpos, ypos){
	var playerGate = Crafty.e("PlayerGate").playergate(xpos, ypos);
	return playerGate;
}

function drawBallButton(xpos, ypos, buttonNumber){
	var ballButton = Crafty.e("BallButton").ballbutton(xpos, ypos, buttonNumber);
	return ballButton;
}

function drawPlayerButton(xpos, ypos, buttonNumber){
	var playerButton = Crafty.e("PlayerButton").playerbutton(xpos, ypos, buttonNumber);
	return playerButton;
}

function drawBoxButton(xpos, ypos, buttonNumber){
	var boxButton = Crafty.e("BoxButton").boxbutton(xpos, ypos, buttonNumber);
	return boxButton;
}

function drawTeleporter(xpos, ypos){
    var teleporter = Crafty.e("Teleporter").teleporter(xpos, ypos);
    return teleporter;
}

function drawPortal(xpos, ypos){
	var portal = Crafty.e("Portal").portal(xpos, ypos); 
	return portal;
}

function placeGoal(xpos, ypos){
	var goal = Crafty.e("Goal").goal(xpos, ypos);
	return goal;
}

function drawLevel(){

	Crafty.background("white");
	
	var playerButtonNumber = 0;
	var boxButtonNumber = 0;
	var ballButtonNumber = 0;
	
	var map = currentMap;
    var inventory = {};
	for(var row = 0; row < ROWS; row++){
		for(var column = 0; column < COLUMNS; column++){
			switch(Math.floor(parseFloat(map[column][row]))){
				case 0:{
					break;
				}
				case 1:{
					drawBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					break;
				}
				//brown
				case 2:{
					drawBallGate(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["ball_gate"] = true;
					break;
				}
				//cyan
				case 3:{
					drawCWBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					inventory["bouncy"] = true;
				    break;
				}
				//cyan
				case 4:{
					drawCCWBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["bouncy"] = true;
					break;
				}
				//gray
				case 5:{
					drawTeleporter(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["teleporter"] = true;
					break;
				}
				//green
				case 6:{
				    if(playerNumber == 2) {
						player = Crafty.e("Player").player(playerNumber, row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
						inventory["player"] = "player2";
				    }
					break;
				}
				//light green
				case 7:{
					drawPlayerButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, playerButtonNumber);
					playerButtonNumber++;
				    inventory["player_button"] = true;
					break;
				}
				//light red
				case 8:{
					drawBoxButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, boxButtonNumber);
					boxButtonNumber++;
				    inventory["box_button"] = true;
					break;
				}
				//orange
				case 9:{
					placeGoal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    //inventory["goal"] = true;
					break;
				}
				//pink
				case 10:{
					drawPlayerGate(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["player_gate"] = true;
					break;
				}
				//puke
				case 11:{
					drawBallButton(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, ballButtonNumber);
					ballButtonNumber++;
				    inventory["ball_button"] = true;
					break;
				}
				//purple
				case 12:{
					drawBall(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    //inventory["ball"] = true;
					break;
				}
				//red
				case 13:{
				    if(playerNumber == 1) {
						player = Crafty.e("Player").player(playerNumber, row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
						inventory["player"] = "player1";
				    }
					break;
				}
				//yellow
				case 14:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 270);
				    inventory["moving"] = true;
					break;
				}
				//yellow
				case 15:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 90);
				    inventory["moving"] = true;
				    break;
				}
				//yellow
				case 16:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 0);
				    inventory["moving"] = true;
					break;
				}
				//yellow
				case 17:{
					drawMovingBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT, 180);
				    inventory["moving"] = true;
					break;
				}
				//white
				case 18:{
					var index = Math.round((parseFloat(map[column][row]) - 18)*1000);
					if(portals1[index] == null)
						portals1[index] = drawPortal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					else
						portals2[index] = drawPortal(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
				    inventory["portal"] = true;
					break;
				}
				//cyan
				case 19:{
					drawSimpleBouncyBox(row*WALL_WIDTH_HEIGHT, column*WALL_WIDTH_HEIGHT);
					inventory["bouncy"] = true;
				    break;
				}
			}
		}
	}
    return inventory;
}


function drawLegend (inventory) {

    var expl_w = WIDTH - BOARD_WIDTH - 40 - WALL_WIDTH_HEIGHT;
    var y_pos = 20;
    
    // draw player avatar
    var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo[inventory["player"]][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
    expl.text(legendInfo[inventory["player"]][1]);

    y_pos += WALL_WIDTH_HEIGHT + 20;

    // draw ball
    var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo["ball"][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
    expl.text(legendInfo["ball"][1]);

    y_pos += WALL_WIDTH_HEIGHT + 20;

    // draw goal
    var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo["goal"][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
    expl.text(legendInfo["goal"][1]);

    y_pos += WALL_WIDTH_HEIGHT + 20;

    // draw rest
    for (var key in inventory) {

		if (key != "player") {
	    	var pic = Crafty.e("2D, DOM, Color").attr({ w: WALL_WIDTH_HEIGHT, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20, y: y_pos });
	    	pic.color(legendInfo[key][0]);

	    	var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: WALL_WIDTH_HEIGHT, x:BOARD_WIDTH + 20 + WALL_WIDTH_HEIGHT + 20, y: y_pos });
	    	expl.text(legendInfo[key][1]);
	    
	    	y_pos += WALL_WIDTH_HEIGHT + 20;
		}
    }
}
