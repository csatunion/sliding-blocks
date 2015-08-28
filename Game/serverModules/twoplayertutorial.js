var fs = require("fs");	
var parser = require("./Parsers/levelParser.js");

var levels = ["level_0.txt", "level_0MIRROR.txt", "level_just_one_teleporter.txt", "level_1MIRROR.txt"]; 

var Game = function(){
    
    this.advance = function(socket, levelNo, playerNumber){

	if (levelNo >= levels.length){
	    socket.broadcast.to(socket.room).emit("advance");
	    socket.emit("advance");
	    console.log("TWO-PLAYER TUTORIAL OVER");
	    return;
	}
	
	console.log("TWO-PLAYER TUTORIAL LEVEL: " + (levelNo + 1) + " (Player: " + playerNumber);
	
	var map1;
    	var map2;
	
	var bg = "images/" + "pirate-map.png";
    	var level = __dirname + "/../levels/TwoPlayerTutorial/" + levels[levelNo];
    	
    	fs.readFile(level, 'ascii', function(err, data) {
	    if (err){
		console.log(err);
	    }else{
		maps = parser.parseLevel(data);
		map1 = maps[0];
		map2 = maps[1];
		
		if (levelNo == 0) {
		    var msg = "You are now connected to your partner.<br/><br/>IMPORTANT: When you are playing with your partner, you cannot place obstacles into your own environment, but you can put obstacles into your partner's environment.";
		}
		
		else {
		    var msg = "On to Level " + (levelNo+1) + "!"
		    //var cheers = ["Great!", "Yeah!", "Good job!"];
		    //var msg = cheers[Math.floor(Math.random() * (cheers.length-1))] + " On to the next level.";
		}
		
		var room = socket.room;

		if(playerNumber == 1){
		    console.log ("Sending maps to clients");
		    socket.emit ("advance", map1, bg, msg, map2);
		    socket.broadcast.to(room).emit("advance", map2, bg, msg, map1);
		    //socket.to(room).emit("advance", map1, bg, "1"+msg, map2);
		    //socket.broadcast.to(room).emit("advance", map2, bg, "2"+msg, map1);
		} 
		else{
		    console.log ("Sending maps to clients in response to request by player 2.");
		    socket.broadcast.to(room).emit("advance", map1, bg, msg, map2);
		    socket.emit("advance", map2, bg, msg, map1);
		    //socket.to(room).emit("advance", map2, bg, msg, map1);
		}
	    }
	});
    };
    
    this.getLevels = function(){
	return levels;
    };
    
};

module.exports = new Game();
