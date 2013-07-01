Crafty.c("MODE0", {
		
	setupGame : function(){},
	setupLevel : function(){}
});

Crafty.c("MODE1", {
	
	init : function(){
		socket.on("updatePartner", function(xpos, ypos){
			partner.x = xpos;
			partner.y = ypos;
		});
	},
	
	setupGame : function(){
		this.bind("PlayerMoved", function(){
			socket.emit("updatePartner", player.x, player.y);
		});
	},
	
	setupLevel : function(){
		partner = Crafty.e("2D, DOM, Color").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1});
		if(playerNumber == 1)
			partner.color("green");
		else
			partner.color("red");
			
		socket.emit("updatePartner", player.x, player.y);
	}
});

Crafty.c("MODE2", {
	
	init : function(){
		socket.on("updatePartner", function(xpos, ypos){
			partner.x = xpos;
			partner.y = ypos;
		});
		
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
	},
	
	setupGame : function(){
		socket.on("togglePartnerView", function(request){
				
			if(request){
				this.bind("Block", sendBlocks);
				this.bind("PlayerMoved", sendPlayer);
				if(ball){
					this.bind("BallMoved", sendBall);
					sendBall();
				}

				sendPlayer();
				sendBlocks();
			}else{
				this.unbind("Block", sendBlocks);
				this.unbind("PlayerMoved", sendPlayer);
				if(ball)
					this.unbind("BallMoved", sendBall);
			}
		});
			
		$(document).bind("keyup", function(key){
			//alt key
			if(key.which == 18){
				partnerView = !partnerView;
				socket.emit("togglePartnerView", partnerView);
				if(partnerView){
					var entities = Crafty("Obstacle, Player, Ball, Rectangle, TextBubble, Arrow");
					for(var i = 0; i < entities.length; i++){
						Crafty(entities[i]).visible = false;
					}
					
					drawStaticView();
						
					partner.visible = true;
					partnerBall.visible = true;
					partnerBlocksPlaced[0].visible = true;
					partnerBlocksPlaced[1].visible = true;
					partnerBlocksPlaced[2].visible = true;
					gameLog("Alternate View");
				}else{
						
					var entities = Crafty("Obstacle, Player, Ball, Rectangle, TextBubble, Arrow");
					for(var i = 0; i < entities.length; i++){
						Crafty(entities[i]).visible = true;
					}
						
					for(var i = 0; i < partnerObstacles.length; i++){
						partnerObstacles[i].destroy();
					}
						
					partner.visible = false;
					partnerBall.visible = false;
					partnerBlocksPlaced[0].visible = false;
					partnerBlocksPlaced[1].visible = false;
					partnerBlocksPlaced[2].visible = false;
					gameLog("Normal View");
				}
			}
		});
	},
	
	setupLevel : function(){
		partnerBlocksPlaced = [];
		partnerObstacles = [];
		partnerView = 0;
			
		partner = Crafty.e("2D, DOM, Color").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1});
		if(playerNumber == 1)
			partner.color("green");
		else
			partner.color("red");
			
		partnerBall = Crafty.e("2D, DOM, Color").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}).color("purple");
		partnerBlocksPlaced.push(Crafty.e("2D, DOM, PartnerBox").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}));
		partnerBlocksPlaced.push(Crafty.e("2D, DOM, PartnerBox").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}));
		partnerBlocksPlaced.push(Crafty.e("2D, DOM, PartnerBox").attr({x:-CELL_SIZE, y:-CELL_SIZE, w:CELL_SIZE, h:CELL_SIZE, z:1}));
	}
});

function setupMode(){
	switch(MODE){
		case 0:
			mode = Crafty.e("MODE0");
			break;
		case 1:
			mode = Crafty.e("MODE1");
			break;
		case 2:
			mode = Crafty.e("MODE2");
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
