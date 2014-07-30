//var ball; 

function drawArrow(xpos, ypos, direction, xscale, yscale){
    return Crafty.e("2D, Canvas, Arrow").arrow(xpos, ypos, direction, xscale, yscale);
}

function drawRect(xpos, ypos){
    return Crafty.e("2D, Canvas, Rectangle").rect(xpos, ypos);
}

function drawTextBubble(xpos, ypos, message, angle, width, height){
    return Crafty.e("2D, Canvas, TextBubble").textbubble(xpos, ypos, message, angle, width, height);
}


function drawBox(xpos, ypos){
    return Crafty.e("StaticObstacle").staticobstacle(xpos, ypos, "Box");
}

function drawPortal(xpos, ypos){
    return Crafty.e("StaticObstacle").staticobstacle(xpos, ypos, "Portal", "black"); 
}

function drawBallGate(xpos, ypos){
    return Crafty.e("StaticObstacle").staticobstacle(xpos, ypos, "BallGate", "brown");
}

function drawPlayerGate(xpos, ypos){
    return Crafty.e("BallSpecific, StaticObstacle").staticobstacle(xpos, ypos, "PlayerGate", "pink");
}

function drawTeleporter(xpos, ypos){
    return Crafty.e("BallSpecific, StaticObstacle").staticobstacle(xpos, ypos, "Teleporter", "#555555");
}

function drawBouncyBox(xpos, ypos){
    return Crafty.e("BallSpecific, StaticObstacle").staticobstacle(xpos, ypos, "BouncyBox", "cyan");
}

function drawGoal(xpos, ypos){
    goal = Crafty.e("BallSpecific, StaticObstacle").staticobstacle(xpos, ypos, "Goal", "orange");
}

function drawBall(xpos, ypos){
    ball = Crafty.e("Ball").ball(xpos, ypos);
}



function drawMovingBox(xpos, ypos, direction){
    return Crafty.e("MovingBox").movingbox(xpos, ypos, direction);
}

function drawCCWBouncyBox(xpos, ypos){
    return Crafty.e("CCWBouncyBox").ccwbouncybox(xpos, ypos);
}

function drawCWBouncyBox(xpos, ypos){
    return Crafty.e("CWBouncyBox").cwbouncybox(xpos, ypos);
}

function drawBallButton(xpos, ypos, buttonNumber){
    return Crafty.e("BallButton").ballbutton(xpos, ypos, buttonNumber);
}

function drawPlayerButton(xpos, ypos, buttonNumber){
    return Crafty.e("PlayerButton").playerbutton(xpos, ypos, buttonNumber);
}

function drawBoxButton(xpos, ypos, buttonNumber){
    return Crafty.e("BoxButton").boxbutton(xpos, ypos, buttonNumber);
}


function drawLevel(map, playerNumber){

    console.log ("Drawing level: " + map.length);

    var inventory = {};
    
    for (var row = 0; row < ROWS; row++){
	for (var col = 0; col < COLS; col++){
	    var x = row*CELL_SIZE;
	    var y = col*CELL_SIZE;
	    
	    if (playerNumber == 2) {
		// shift to the right
		x += WIDTH;
	    }

	    //console.log (Math.floor(parseFloat(map[col][row])));
	    switch(Math.floor(parseFloat(map[col][row]))){
	    case 0:{
		break;
	    }case 1:{
		drawBox(x,y);
		break;
	    }case 2:{
		drawBallGate(x,y);
		inventory["ball_gate"] = true;
		break;
	    }case 3:{
		drawCWBouncyBox(x,y);
		inventory["bouncy"] = true;
		break;
	    }case 4:{
		drawCCWBouncyBox(x,y);
		inventory["bouncy"] = true;
		break;
	    }case 5:{
		drawTeleporter(x,y);
		inventory["teleporter"] = true;
		break;
	    }case 6:{
		if(playerNumber == 2) {
		    player2 = Crafty.e("Player").player(playerNumber, x, y);
		    inventory["player"] = "player2";
		}
		break;
	    }case 7:{
		drawPlayerButton(x, y, playerButtonNumber);
		inventory["player_button"] = true;
		break;
	    }case 8:{
		drawBoxButton(x, y, boxButtonNumber);
		inventory["box_button"] = true;
		break;
	    }case 9:{
		drawGoal(x,y);
		break;
	    }case 10:{
		drawPlayerGate(x,y);
		inventory["player_gate"] = true;
		break;
	    }case 11:{
		drawBallButton(x, y, ballButtonNumber);
		inventory["ball_button"] = true;
		break;
	    }case 12:{
		drawBall(x, y);
		ballHolder = playerNumber;
		break;
	    }case 13:{
		if(playerNumber == 1) {
		    //Crafty.e('2D, DOM, Color').attr({x: 0, y: 0, w: 100, h: 100}).color('#F00');

		    player1 = Crafty.e("Player").player(playerNumber, x, y);
		    inventory["player"] = "player1";
		}
		break;
	    }case 14:{
		drawMovingBox(x, y, 270);
		inventory["moving"] = true;
		break;
	    }case 15:{
		drawMovingBox(x, y, 90);
		inventory["moving"] = true;
		break;
	    }case 16:{
		drawMovingBox(x, y, 0);
		inventory["moving"] = true;
		break;
	    }case 17:{
		drawMovingBox(x, y, 180);
		inventory["moving"] = true;
		break;
	    }case 18:{
		var index = Math.round((parseFloat(map[col][row]) - 18)*1000);
		if(portals1[index] == null)
		    portals1[index] = drawPortal(x, y);
		else
		    portals2[index] = drawPortal(x, y);
		inventory["portal"] = true;
		break;
	    }case 19:{
		drawBouncyBox(x, y);
		inventory["bouncy"] = true;
		break;
	    }
	    }
	}
    }
    
    //drawLegend(inventory);
}
