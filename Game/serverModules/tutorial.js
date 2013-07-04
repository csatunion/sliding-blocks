var fs = require("fs");
var parser = require("./Parsers/mapParser.js");

var levels = ["tutorial-move-push-ball.txt", "tutorial-place-obstacles.txt", "tutorial-portals.txt"];	

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
		   		socket.emit("advance", parser.parseMap(data), bg);
			
	    });
	};
	
	this.getLevels = function(){
		return levels;
	};
	
};

module.exports = new Tutorial();


