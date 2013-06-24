
/*
 * xscale and yscale are optional arguments
 * direction: 0 = right, 90 = up, 180 = left, 270 = down
 */
function drawArrow(xpos, ypos, direction, xscale, yscale){
	return Crafty.e("2D, Canvas, Arrow").arrow(xpos, ypos, direction, xscale, yscale);
}

function drawBox(xpos, ypos){
    return Crafty.e("Box").box(xpos, ypos);
}

function drawBall(xpos, ypos){
    ball = Crafty.e("Ball").ball(xpos, ypos);
}

function drawGoal(xpos, ypos){
	goal = Crafty.e("Goal").goal(xpos, ypos);
}

function drawMovingBox(xpos, ypos, direction){
    return Crafty.e("MovingBox").movingbox(xpos, ypos, direction);
}

function drawBouncyBox(xpos, ypos){
    return Crafty.e("BouncyBox").bouncybox(xpos, ypos);
}

function drawCCWBouncyBox(xpos, ypos){
    return Crafty.e("CCWBouncyBox").ccwbouncybox(xpos, ypos);
}

function drawCWBouncyBox(xpos, ypos){
    return Crafty.e("CWBouncyBox").cwbouncybox(xpos, ypos);
}

function drawBallGate(xpos, ypos){
	return Crafty.e("BallGate").ballgate(xpos, ypos);
}

function drawPlayerGate(xpos, ypos){
	return Crafty.e("PlayerGate").playergate(xpos, ypos);
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

function drawTeleporter(xpos, ypos){
    return Crafty.e("Teleporter").teleporter(xpos, ypos);
}

function drawPortal(xpos, ypos){
	return Crafty.e("Portal").portal(xpos, ypos); 
}

function drawLevel(){
	Crafty.background("#FFF");
	
	var inventory = {};
	
	for(var row = 0; row < ROWS; row++){
		for(var col = 0; col < COLS; col++){
			var x = row*CELL_SIZE;
			var y = col*CELL_SIZE;
			
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
						player = Crafty.e("Player").player(playerNumber, x, y);
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
					break;
				}case 13:{
				    if(playerNumber == 1) {
						player = Crafty.e("Player").player(playerNumber, x, y);
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
	
	drawLegend(inventory);
}


function drawLegend (inventory) {

    var expl_w = WIDTH - BOARD_WIDTH - 40 - CELL_SIZE;
    var y_pos = 20;
    
    // draw player avatar
    var pic = Crafty.e("2D, DOM, Color").attr({ w: CELL_SIZE, h: CELL_SIZE, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo[inventory["player"]][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: CELL_SIZE, x:BOARD_WIDTH + 20 + CELL_SIZE + 20, y: y_pos });
    expl.text(legendInfo[inventory["player"]][1]);

    y_pos += CELL_SIZE + 20;

    // draw ball
    var pic = Crafty.e("2D, DOM, Color").attr({ w: CELL_SIZE, h: CELL_SIZE, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo["ball"][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: CELL_SIZE, x:BOARD_WIDTH + 20 + CELL_SIZE + 20, y: y_pos });
    expl.text(legendInfo["ball"][1]);

    y_pos += CELL_SIZE + 20;

    // draw goal
    var pic = Crafty.e("2D, DOM, Color").attr({ w: CELL_SIZE, h: CELL_SIZE, x:BOARD_WIDTH + 20, y: y_pos });
    pic.color(legendInfo["goal"][0]);
    
    var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: CELL_SIZE, x:BOARD_WIDTH + 20 + CELL_SIZE + 20, y: y_pos });
    expl.text(legendInfo["goal"][1]);

    y_pos += CELL_SIZE + 20;

    // draw rest
    for (var key in inventory) {

		if (key != "player") {
	    	var pic = Crafty.e("2D, DOM, Color").attr({ w: CELL_SIZE, h: CELL_SIZE, x:BOARD_WIDTH + 20, y: y_pos });
	    	pic.color(legendInfo[key][0]);

	    	var expl = Crafty.e("2D, DOM, Text").attr({ w: expl_w, h: CELL_SIZE, x:BOARD_WIDTH + 20 + CELL_SIZE + 20, y: y_pos });
	    	expl.text(legendInfo[key][1]);
	    
	    	y_pos += CELL_SIZE + 20;
		}
    }
}

function drawHints(){
	levelHints[(level-1)]();
}
