var fs = require('fs');
var express = require("express");
var app = express.createServer();
var io  = require("socket.io").listen(app);

app.listen(4000);

//when client connects send all game files to them
app.configure(function(){
    app.use(express.static(__dirname + "/assets"));
});

var clientSockets = {};
var clientIds = [];
var channelsToReuse = [];
var currentChannel = 0;       

//run this when a client connects to server
io.sockets.on('connection', function(socket){
	
	socket.on("ready", function(){
		clientSockets[socket.id] = socket;
		clientIds.push(socket.id);
		pairUpSockets();
	});

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
    
    //send position to the other player to tell them where the block teleported to
    socket.on("teleport", function(x, y, direction, channel){
       socket.broadcast.to(channel).emit("teleported", x, y, direction); 
    });

    //send position to partner to tell them where to place a block
    socket.on('sendPos', function(x, y, channel){
         socket.broadcast.to(channel).emit('dropBlock', x, y); 
    });

    // //sends message transmitted from one client to other client in the same channel
    // socket.on('sendMessage', function(incomingMessage, channel){
    //     socket.broadcast.to(channel).emit('newMessage', incomingMessage);
    // });

    //sends message transmitted from one client to other client in the same channel
    socket.on('sendMessage', function(incomingMessage, channel){
        io.sockets.to(channel).emit('newMessage', socket.username, incomingMessage);
    });
    
    // //sends the position of player two to player one to write into the log
    // socket.on("logPos", function(x, y, channel){
    //     socket.broadcast.to(channel).emit('logPosition', x, y);
    // });
    
    //receive the game log from the players and writes it to the log file
    socket.on("log", function(log){
        var stream = fs.createWriteStream('assets/log.txt', {'flags':'a'});
        stream.write(log);
        console.log("log recorded");
    });
    
//     //alert player that their partner has left the game
//     socket.on("partnerDisconnected", function(channel){
//        players = players - 1;
//        message = socket.username + " left the game."
//        socket.broadcast.to(channel).emit("playerLeft", message);
//     });
// });
   

    // //sends the position of player two to player one to write into the log
    // socket.on("logPos", function(x, y, channel){
    //     socket.broadcast.to(channel).emit('logPosition', x, y);
    // });
    
    
    socket.on("nextLevel", function(level, playerNumber, channel){
    	var map1;
    	var map2;
    	var level = __dirname + "/levels/level_" + level + ".txt";

	// I think we should go for the union map and black and white images (easiest to produce, least obstrusive)
    	var bg_imgs = ["union.png","treasure-map-1-scaled.png","treasure-map-3-scaled.png","treasure-map-5-scaled.png","treasure-map-6-scaled.png","treasure-map-7-scaled.png"];
	var bg = "images/" + bg_imgs[Math.floor(Math.random() * bg_imgs.length)];

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
					socket.to(channel).emit("advance", map1);
					socket.broadcast.to(channel).emit("advance", map2);
				} 
				else{
					socket.broadcast.to(channel).emit("advance", map1);
					socket.to(channel).emit("advance", map2);
				}
			    socket.to(channel).emit("background", bg);
			    socket.broadcast.to(channel).emit("background", bg);
			}
		});
	});
	
	socket.on("partnerDisconnected", function(channel){
		
		var index = clientIds.indexOf(socket.id);
		if(index != -1){
			clientIds.splice(index,1);
		}
		
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


function pairUpSockets(){
	var client;
	if(clientIds.length >= 2){
		if(channelsToReuse.length != 0){
			client = clientSockets[clientIds.splice(0,1)];
			client.join(channelsToReuse[0]);
			client.emit("setup", 1, channelsToReuse[0]);
			
			client = clientSockets[clientIds.splice(0,1)];
			client.join(channelsToReuse[0]);
			client.emit("setup", 2, channelsToReuse[0]);
			
			channelsToReuse.splice(0,1);
		}
		else{
			client = clientSockets[clientIds.splice(0,1)];
			client.join(currentChannel);
			client.emit("setup", 1, currentChannel);
			
			client = clientSockets[clientIds.splice(0,1)];
			client.join(currentChannel);
			client.emit("setup", 2, currentChannel);
		
			currentChannel++;
		}
	}
}

