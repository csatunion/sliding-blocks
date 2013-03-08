console.log("Server running Node JS Version: " + process.version);

var fs = require('fs');
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io  = require("socket.io").listen(server);
io.set('log level', 1);

server.listen(4000);

//when client connects send all game files to them
app.use(express.static(__dirname + "/assets"));

var tut_levels = ["tutorial-move-push-ball.txt", "tutorial-place-obstacles.txt", "tutorial-portals.txt"];
var tut_instructions = ["Use the arrow keys to move.<br/><br/>Push the ball into the goal.",
		        "Use CTRL to place obstacles that stop the ball.<br/><br/>(IMPORTANT: When you are playing with a partner, you cannot place obstacles into your own environment, but you can drop obstacles into your partner's environment.)",
		        "Along the way you will encounter all kinds of blocks with special behaviors. For example, portals."];
var levels = ["level_0.txt", "level_0MIRROR.txt", "level_just_one_teleporter.txt", "level_1MIRROR.txt", "level_4.txt", "level_6.txt"];

var stream = fs.createWriteStream(__dirname + '/assets/log.txt', {'flags':'a'});
var clientSockets = {};
var clientIds = [];
var channelsToReuse = [];
var currentChannel = 0;
var gameid = 0;

var logText = "";

//run this when a client connects to server
io.sockets.on('connection', function(socket){
    
    socket.once("tutorial",function(){
	
		socket.on("advance", function(levelNo){
    		var map;
	    	var bg = "images/" + "treasure-map-6-scaled.png";
	    
	    	var level = __dirname + "/soloLevels/" + tut_levels[levelNo];
    		fs.readFile(level, 'ascii', function(err, data) {
    			//if all levels complete
				if (err) {
		    		console.log("Tutorial Complete");
		    		socket.emit("goToNextLevel", -1);
				}
				//if all levels not complete
				else{
		    		map = parseMap(data);
		    		socket.emit("goToNextLevel", map, bg, tut_instructions[levelNo]);
				}
	    	});
		});

		socket.on('sendPosTutorial', function(x, y, channel){
    		socket.emit('dropBlock', x, y); 
   		});
	
    });
    
    socket.on("game", function(){
    	
		clientSockets[socket.id] = socket;
		clientIds.push(socket.id);
		pairUpSockets();
	
		socket.on("boxButtonPressed", function(number, activated, firstHit, channel){
            io.sockets.to(channel).emit("boxButton", number, activated, firstHit);    
    	});
	
    	socket.on("ballButtonPressed", function(number, activated, channel){
            io.sockets.to(channel).emit("ballButton", number, activated);    
    	});
	
    	socket.on("playerButtonPressed", function(number, activated, channel){
            io.sockets.to(channel).emit("playerButton", number, activated);    
    	});
	
    	socket.on("boxHitSomething", function(channel){
    	    socket.broadcast.to(channel).emit("boxHitSomething");
    	});
    	
    	socket.on("alertOtherPlayer", function(channel){
    	    socket.broadcast.to(channel).emit("alertOtherPlayer");
    	});
	
    	socket.on("restartLevel", function(channel){
    	    io.sockets.to(channel).emit("restart");
    	});
	
    	socket.on("teleport", function(x, y, direction, channel){
            socket.broadcast.to(channel).emit("teleported", x, y, direction); 
    	});

    	socket.on('sendPos', function(x, y, channel){
            socket.broadcast.to(channel).emit('dropBlock', x, y); 
    	});

     	socket.on('sendMessage', function(incomingMessage, channel){
            socket.broadcast.to(channel).emit('newMessage', incomingMessage);
    	});
	
    	socket.on("log", function(log){
    	    
	    	var writeSuccess;
	    
	    	if (logText != "") {
	    		writeSuccess = stream.write(logText);
	    		if(!writeSuccess){
	    	    	stream.once("drain", function(){
	    				logText = "";
	    				console.log("server log recorded");
	    				writeSuccess = stream.write(log);
	    				if(!writeSuccess){
	    		    		stream.once("drain", function(){
	    						console.log("client log recorded");
	    		    		});
	    				}
	    				else
	    		    		console.log("client log recorded");
	    	    	});	
	    		}
	    		else{
	    	    	logText = "";
	    	    	console.log("server log recorded");
	    	    	writeSuccess = stream.write(log);
	    	    	if(!writeSuccess){
	    				stream.once("drain", function(){
	    		    		console.log("client log recorded");
	    				});
	    	    	}
	    	    	else
	    				console.log("client log recorded");
	    		}
	    	}
	    	else{
				writeSuccess = stream.write(log);
				if(!writeSuccess){
	    			stream.once("drain", function(){
	    				console.log("client log recorded");
	    			});
	    		}
	    		else
	    	    	console.log("client log recorded");
	    	}	
    	});
	
    	socket.on("nextLevel", function(levelNo, gameid, playerNumber, channel){
    	    var map1;
    	    var map2;
	    	console.log("LEVEL " + levelNo);

	    	if (levelNo >= levels.length)
	    		var level = "-1";
	    	else {
    			var level = __dirname + "/levels/" + levels[levelNo];
	    		serverLog("id:" + gameid + ",level:" + levelNo + " " + levels[levelNo]);
	    	}

    	    var bg_imgs = ["union.png","treasure-map-1-scaled.png","treasure-map-3-scaled.png","treasure-map-5-scaled.png","treasure-map-6-scaled.png","treasure-map-7-scaled.png"];
	    	var bg = "images/" + "treasure-map-6-scaled.png"; //bg_imgs[Math.floor(Math.random() * bg_imgs.length)];

    	    fs.readFile(level, 'ascii', function(err, data) {
    			//if all levels complete
				if (err) {
		    		console.log(err);
		    		io.sockets.to(channel).emit("advance", -1);
				}
				//if all levels not complete
				else{
		    		maps = parseLevel(data);
		    		map1 = maps[0];
		    		map2 = maps[1];
		    
		    		if (levelNo==0) {
						var msg = "You are now connected to your partner.<br/><br/>Type in the box below to send your partner a message.";
		    		}
		    		else {
						var cheers = ["Great!", "Yeah!", "Good job!"];
						var msg = cheers[Math.floor(Math.random() * (cheers.length-1))] + " On to the next level.";
		    		}

		    		if(playerNumber == 1){
						socket.to(channel).emit("advance", map1, bg, msg);
						socket.broadcast.to(channel).emit("advance", map2, bg, msg);
		    		} 
		    		else{
						socket.broadcast.to(channel).emit("advance", map1, bg, msg);
						socket.to(channel).emit("advance", map2, bg, msg);
		    		}
				}
	    	});
		});
	
		socket.on("partnerDisconnected", function(channel){
		
	    	var index = clientIds.indexOf(socket.id);
	    	if(index != -1)
				clientIds.splice(index,1);
	    
	    	var clientsInChannel = io.sockets.clients(channel);
	    	if(clientsInChannel.length == 2){
		
				var partnerSocket;
		
				if(clientsInChannel[0].id == socket.id)
		    		partnerSocket = clientSockets[clientsInChannel[1].id];
				else
		    		partnerSocket = clientSockets[clientsInChannel[0].id];
		
				socket.leave(channel);
		
				partnerSocket.emit("partnerLeft", -1);
				partnerSocket.leave(channel);
		
				clientIds.push(partnerSocket.id);
				channelsToReuse.push(channel);
				pairUpSockets();
	    	}
    	});
    });
});

function pairUpSockets(){
    
    if(clientIds.length >= 2){
	
		var client;
		var channel;
	
		if(channelsToReuse.length != 0)
	    	channel = channelsToReuse.splice(0,1);
		else{
	    	channel = currentChannel.toString();
	    	currentChannel++;
		}	
		client = clientSockets[clientIds.splice(0,1)];
		client.join(channel);
		client.emit("setup", gameid, 1, channel);
	
		client = clientSockets[clientIds.splice(0,1)];
		client.join(channel);
		client.emit("setup", gameid, 2, channel);
	
		gameid++;
    }
}

function serverLog(logmsg) {
    currentTime = new Date();
    logtime = currentTime.toDateString()+","+currentTime.toTimeString()+","+currentTime.getTime();
    logentry = logtime +",server,"+ logmsg;
    logText = logText + "\n" + logentry;
}

/*
 * parses a single map
 */
function parseMap(map){
	map = map.split(":");
	for(var i = 0; i < map.length; i++)
		map[i] = map[i].split(",");
	
	return map
}

/**
 * parses two player maps 
 */
function parseLevel(data){
	maps = data.split("&");
	maps[0] = parseMap(maps[0]);
	maps[1] = parseMap(maps[1]);
	
	return maps;
}


/*
 * gets the channel that the socket is in
 */
function getChannel(socket){
	var joinedChannels = io.sockets.manager.roomClients[socket.id];
	var channel = '';
	
	for(key in joinedChannels){
		if(key != '')
			channel = key.substring(1);
	}
	
	if(channel == '')
		return -1;
	else
		return channel;
}


