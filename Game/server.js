var fs = require('fs');
var express = require("express");
var app = express.createServer();
var io  = require("socket.io").listen(app);

app.listen(4000);

//when client connects send all game files to them
app.configure(function(){
    app.use(express.static(__dirname + "/assets"));
});

var players = 0;               
var currentChannel = 1;         

//run this when a client connects to server
io.sockets.on('connection', function(socket){

    //wait for client to signal they are ready for setup info
    socket.on("ready", function(){
        console.log("ready notification received");        
        players = players + 1;                                                     		 //increase the number of players connected by 1
    
        if (players % 2 == 1){
            socket.username = "player1";
            socket.join(currentChannel);                                           		 //join this socket to the current channel
            socket.emit('setup', socket.username, 1, currentChannel);      				 //get player1 attributes for the player they control
        }
        else if(players % 2 == 0){
            socket.username = "player2";
            socket.join(currentChannel);                                           		 //join this socket to the current channel
            socket.emit('setup', socket.username, 2, currentChannel);      				 //get player2 attributes for the player they control
            
            while(io.sockets.clients(currentChannel).length < 2){}                 		 //make sure two players are in the channel
                        
            io.sockets.to(currentChannel).emit('start', 'start');                  		 //send ready signal to both users
            currentChannel = currentChannel + 1;                                   		 //create a new channel when two player playing together
        }
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
    
    socket.on("nextLevel", function(level, playerNumber, channel){
    	var map1;
    	var map2;
    	var level = __dirname + "/levels/level_" + level + ".txt";
    	
    	fs.readFile(level, 'ascii', function(err, data) {
    		//if all levels complete
			if (err) {
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
			}
		});
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

    //sends message transmitted from one client to other client in the same channel
    socket.on('sendMessage', function(incomingMessage, channel){
        io.sockets.to(channel).emit('newMessage', socket.username, incomingMessage);
    });
    
    //sends the position of player two to player one to write into the log
    socket.on("logPos", function(x, y, channel){
        socket.broadcast.to(channel).emit('logPosition', x, y);
    });
    
    //receive the game log from player 1 and writes it to the log file
    socket.on("log", function(log){
        var stream = fs.createWriteStream('assets/log.txt', {'flags':'a'});
        stream.write(log);
        console.log("log recorded");
    });
    
    //alert player that their partner has left the game
    socket.on("partnerDisconnected", function(channel){
       players = players - 1;
       message = socket.username + " left the game."
       socket.broadcast.to(channel).emit("playerLeft", message);
    });
});