function setupMode(){
	switch(MODE){
		case 0:
			break;
		case 2:
			socket.on("updateBall", function(xpos, ypos){
				partnerBall.x = xpos;
				partnerBall.y = ypos;
			});
			
			socket.on("updateBlocks", function(blocks){
				for(var i = 0; i < blocks.length; i++){
					var block = blocks[i];
					if(block){
						partnerBlocksPlaced[i].x = block[0];
						partnerBlocksPlaced[i].y = block[1];
					}
				}
			});
		case 1:
			socket.on("updatePartner", function(xpos, ypos){
				partner.x = xpos;
				partner.y = ypos;
			});
			break;
	}
}

function sendBlocks(){
	data = [];
	
	for(var i = 0; i < blocksPlaced.length; i++){
		data.push([blocksPlaced[i].x, blocksPlaced[i].y]);
	}
	
	socket.emit("updateBlocks", data);
}

function sendPlayer(){
	socket.emit("updatePartner", player.x, player.y);
}

function sendBall(){
	socket.emit("updateBall", ball.x, ball.y);
}

/* draws all the entities that do not move from partner's map*/
function drawStaticView(){
	for(var row = 0; row < ROWS; row++){
		for(var col = 0; col < COLS; col++){
			var x = row*CELL_SIZE;
			var y = col*CELL_SIZE;
			
			switch(Math.floor(parseFloat(map2[col][row]))){
				case 1:{
					partnerObstacles.push(Crafty.e("2D, DOM, PartnerBox").attr({x:x, y:y, w:CELL_SIZE, h:CELL_SIZE}));
					break;
				}case 2:{
					partnerObstacles.push(Crafty.e("2D, DOM, Color").attr({x:x, y:y, w:CELL_SIZE, h:CELL_SIZE}).color("brown"));
					break;
				}case 5:{
					partnerObstacles.push(Crafty.e("2D, DOM, Color").attr({x:x, y:y, w:CELL_SIZE, h:CELL_SIZE}).color("#555555"));
					break;
				}case 9:{
					partnerObstacles.push(Crafty.e("2D, DOM, Color").attr({x:x, y:y, w:CELL_SIZE, h:CELL_SIZE}).color("orange"));
					break;
				}case 10:{
					partnerObstacles.push(Crafty.e("2D, DOM, Color").attr({x:x, y:y, w:CELL_SIZE, h:CELL_SIZE}).color("pink"));
					break;
				}case 19:{
					partnerObstacles.push(Crafty.e("2D, DOM, Color").attr({x:x, y:y, w:CELL_SIZE, h:CELL_SIZE}).color("cyan"));
				    break;
				}default:{
					break;
				}
			}
		}
	}
}
