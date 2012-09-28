console.log("Server running Node JS Version: " + process.version);

var fs = require('fs');
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io  = require("socket.io").listen(server);

server.listen(4000);

//when client connects send all game files to them
app.use(express.static(__dirname + "/assets"));

var stream = fs.createWriteStream(__dirname + '/assets/log.txt', {'flags':'a'});
var clientSockets = {};
var clientIds = [];
var channelsToReuse = [];
var currentChannel = 0;
var gameid = 0;

var logText = "";

//run this when a client connects to server
io.sockets.on('connection', function(socket){
    
    socket.on("tutorial",function(){
	
	socket.on("advance", function(levelNo){
    	    var map;
	    var bg = "images/" + "treasure-map-6-scaled.png";
	    var level = __dirname + "/soloLevels/level_" + levelNo + ".txt";
    	    
	    fs.readFile(level, 'ascii', function(err, data) {
    		//if all levels complete
		if (err) {
		    console.log("File Not Found");
		    socket.emit("goToNextLevel", -1);
		}
		//if all levels not complete
		else{
		    
		    data = data.split(":");
		    for(var i = 0; i < data.length; i++){
			data[i] = data[i].split(",");
		    }
		    
		    map = data;
		    
		    socket.emit("goToNextLevel", map, bg);
		}
	    });
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
	    console.log("LEVEL " + (levelNo - 1));
	    var levels = ["level_4.txt", "level_5.txt", "level_3.txt"];

	    if ((levelNo - 1)>= levels.length)
	    	var level = "-1";
	    else {
    		var level = __dirname + "/levels/" + levels[(levelNo - 1)];
	    	serverLog("id:" + gameid + ",level:" + (levelNo - 1) + " " + levels[(levelNo - 1)]);
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
		    data = data.split('&');
		    
		    data[0] = data[0].split(":");
		    for(var i = 0; i < data[0].length; i++){
			data[0][i] = data[0][i].split(",");
		    }
		    
		    map1 = data[0];
		    
		    
		    data[1] = data[1].split(":");
		    for(var i = 0; i < data[1].length; i++){
			data[1][i] = data[1][i].split(",");
		    }
		    
		    map2 = data[1];
		    
		    if(playerNumber == 1){
			socket.to(channel).emit("advance", map1, bg);
			socket.broadcast.to(channel).emit("advance", map2, bg);
		    } 
		    else{
			socket.broadcast.to(channel).emit("advance", map1, bg);
			socket.to(channel).emit("advance", map2, bg);
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
	
	var client1, client2;
	var channel;
	
	if(channelsToReuse.length != 0)
	    channel = channelsToReuse.splice(0,1);
	else{
	    channel = currentChannel.toString();
	    currentChannel++;
	}	
	client1 = clientSockets[clientIds.splice(0,1)];
	client1.join(channel);
	client1.emit("setup", gameid, 1, channel);
	
	client2 = clientSockets[clientIds.splice(0,1)];
	client2.join(channel);
	client2.emit("setup", gameid, 2, channel);
	
	gameid++;
    }
}

function serverLog(logmsg) {
    currentTime = new Date();
    logtime = currentTime.toDateString()+","+currentTime.toTimeString()+","+currentTime.getTime();
    logentry = logtime +",server,"+ logmsg;
    logText = logText + "\n" + logentry;
}


