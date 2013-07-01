var fs = require("fs");
var parser = require("./Parsers/mapParser.js");

var levels = ["tutorial-move-push-ball.txt", "tutorial-place-obstacles.txt", "tutorial-portals.txt"];	

var instructions = 
["Use the arrow keys to move.<br/><br/>Push the ball into the goal.",
 "Use CTRL to place obstacles that stop the ball.<br/><br/>(IMPORTANT: When you are playing with a partner, you cannot place obstacles into your own environment, but you can drop obstacles into your partner's environment.)",
 "Along the way you will encounter all kinds of blocks with special behaviors. For example, portals."];
 
var Tutorial = function(){
	
	this.advance = function(socket, levelNo){
		if(levelNo >= levels.length){
			socket.emit("advance");
			console.log("TUTORIAL OVER");
	    	return;
		}
	
		console.log("TUTORIAL LEVEL: " + (levelNo + 1));
	
	    var bg = "images/treasure-map-6-enlarged.png";
	    
	    var level = __dirname + "/../levels/Tutorial/" + levels[levelNo];
	    
    	fs.readFile(level, 'ascii', function(err, data) {
			if (err)
				console.log(err);
			else
		   		socket.emit("advance", bg, instructions[levelNo], parser.parseMap(data));
			
	    });
	};
	
	this.getLevels = function(){
		return levels;
	};
	
};

module.exports = new Tutorial();


