var fs = require("fs");	
var parser = require("./Parsers/levelParser.js");

var levels = ["level_0.txt", "level_0MIRROR.txt", "level_just_one_teleporter.txt", "level_1MIRROR.txt", "level_5.txt", "level_4.txt", "level_6.txt"];

var Game = function(){
	
	this.advance = function(socket, levelNo, playerNumber){

	    if (levelNo >= levels.length){
			socket.broadcast.to(socket.room).emit("advance");
			socket.emit("advance");
	    	console.log("GAME OVER");
			return;
	    }
	    
	    console.log("GAME LEVEL: " + (levelNo + 1));
	    
	    var map1;
    	var map2;
	
		var bg = "images/" + "treasure-map-6-enlarged.png";
    	var level = __dirname + "/../levels/Game/" + levels[levelNo];
    	
    	fs.readFile(level, 'ascii', function(err, data) {
			if (err){
		   		console.log(err);
			}else{
		    	maps = parser.parseLevel(data);
		    	map1 = maps[0];
		    	map2 = maps[1];
		    
		    	if (levelNo == 0) {
					var msg = "You are now connected to your partner.<br/><br/>Type in the box below to send your partner a message.";
		    	}
		    	else {
					var cheers = ["Great!", "Yeah!", "Good job!"];
					var msg = cheers[Math.floor(Math.random() * (cheers.length-1))] + " On to the next level.";
		    	}
		    	
		    	var room = socket.room;

		    	if(playerNumber == 1){
					socket.to(room).emit("advance", bg, msg, map1, map2);
					socket.broadcast.to(room).emit("advance", bg, msg, map2, map1);
		    	} 
		    	else{
					socket.broadcast.to(room).emit("advance", bg, msg, map1, map2);
					socket.to(room).emit("advance", bg, msg, map2, map1);
		    	}
			}
	    });
	};
	
	this.getLevels = function(){
		return levels;
	};
	
};

module.exports = new Game();


