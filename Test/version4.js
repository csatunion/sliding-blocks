var fs = require('fs');
var express = require("express");
var app = express.createServer();
var io  = require("socket.io").listen(app);

app.listen(4000);


//when client connects send all game files to them
app.configure(function(){
    app.use(express.static(__dirname + "/version4"));
});


var players = 0;                //number of players connected to the server 
var player1Color = 'red';       //player1
var player2Color = 'green';     //player2
var currentChannel = 1;         //current channel


//run this when a client connects to server
io.sockets.on('connection', function(socket){

    //wait for client to signal they are ready for setup info
    socket.on("ready", function(){
        console.log("ready notification received");        
        players = players + 1;                                                     //increase the number of players connected by 1
    
        if (players % 2 == 1){
            
            socket.username = "player1";
            socket.join(currentChannel);                                           //join this socket to the current channel
            socket.emit('setup', "player1", player1Color, 1, currentChannel);      //get player1 attributes for the player they control
        }
        else if(players % 2 == 0){
            socket.username = "player2";
            socket.join(currentChannel);                                           //join this socket to the current channel
            socket.emit('setup', "player2", player2Color, 2, currentChannel);      //get player2 attributes for the player they control
            
            while(io.sockets.clients(currentChannel).length < 2){}                 //make sure two players are in the channel
                        
            io.sockets.to(currentChannel).emit('start', 'start');                  //send ready signal to both users
            currentChannel = currentChannel + 1;                                   //create a new channel when two player playing together
        }
    });
    
    socket.on("pressed", function(number, channel){
        socket.broadcast.to(channel).emit("buttonPressed", number);    
    });
    
    socket.on("nextLevel", function(channel){
        socket.broadcast.to(channel).emit("advance");
    });
    
    //send position to the other player to tell them where the block teleported to
    socket.on("teleport", function(x, y, direction, channel){
       socket.broadcast.to(channel).emit("teleported", x, y, direction); 
    });

    //send position to partner to tell them where to place a block
    socket.on('sendPos', function(x, y, channel){
        socket.broadcast.to(channel).emit('dropBlock', x, y);   //transmit new position to partner
    });

    //sends message transmitted from one client to other client in the same channel
    socket.on('sendMessage', function(incomingMessage, channel){
        //var outgoingMessage = socket.username + incomingMessage;
        io.sockets.to(channel).emit('newMessage', socket.username, incomingMessage); //send to partner in the same channel
    });
    
    //sends the position of player two to player one to write into the log
    socket.on("logPos", function(x, y, channel){
        socket.broadcast.to(channel).emit('logPosition', x, y);
    });
    
    //receive the game log from player 1 and writes it to the log file
    socket.on("log", function(log){
        var stream = fs.createWriteStream('version4/log.txt', {'flags':'a'});
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