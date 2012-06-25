var express = require("express");
var app = express.createServer();
var io  = require("socket.io").listen(app);

app.listen(80);

app.configure(function(){
    app.use(express.static(__dirname + "/version4"));
});


var players = 0;                //number of players connected to the server 
var player1Color = 'red';       //player1
var player2Color = 'green';     //player2
var currentChannel = 1;         //current channel


io.sockets.on('connection', function(socket){
    players = players + 1;                          //increase the number of players connected by 1

    if (players % 2 == 1){
        socket.username = "player1: ";
        socket.join(currentChannel);                                              //join this socket to the current channel
        socket.emit('setup', player1Color, 1, currentChannel);                    //get player1 attributes for the player they control
    }
    else if(players % 2 == 0){
        socket.username = "player2: ";
        socket.join(currentChannel);                                              //join this socket to the current channel
        socket.emit('setup', player2Color, 2, currentChannel);                    //get player2 attributes for the player they control
        io.sockets.to(currentChannel).emit('ready', 'ready');                     //send ready signal to both users
        currentChannel = currentChannel + 1;                                      //create a new channel when two player playing together
    }   
    
    socket.on("teleport", function(pos){
       var channel = pos[3];
       var position = pos.slice(0,3);       
       socket.broadcast.to(channel).emit("teleported", position); 
    });

    
    socket.on('sendPos', function(X, Y, channelNumber){
        var xpos    = X;
        var ypos    = Y;
        var channel = channelNumber;
        socket.broadcast.to(channel).emit('dropBlock', xpos, ypos);   //transmit new position to partner
    });

    socket.on('sendMessage', function(incomingMessage){
        var outgoingMessage = socket.username + incomingMessage[0];
        var channel = incomingMessage[1];
        io.sockets.to(channel).emit('newMessage', outgoingMessage); //send to partner in the same channel
    });
    
    socket.on("logPos", function(pos){
        var channel = pos[2];
        var position = pos.slice(0,2);
        socket.broadcast.to(channel).emit('logPosition', position);
    });
    
    socket.on("log", function(log){
        var fs = require('fs');
        var stream = fs.createWriteStream('version4/log.txt', {'flags':'a'});
        stream.write(log);
    });
});