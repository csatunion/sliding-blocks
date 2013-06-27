/* CONSTANTS */
var TUTORIAL_MODE = 0;
var GAME_MODE     = 1;

var MODES = [require('./serverModules/tutorial.js'), require('./serverModules/game.js')];

var NO_PARTNER = -1;

/* SERVER SETUP */
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var fs      = require('fs');
var mysql   = require('mysql');

io.set('log level', 1);

server.listen(4000);

app.use(express.static(__dirname + '/assets'));

/* SERVER VARIABLES */
var waitingSockets = [];
var currentRoom = 0;

var pool = mysql.createPool({
	host : "localhost",
	user : "danisea",
	password : "bl0ck5"
	database : "blocks"
});

io.sockets.on('connection', function(socket){

	socket.room = NO_PARTNER;
	
	socket.on('log', function(humantime, timestamp, playerNumber, level, data){
		var name = MODES[socket.mode].getLevels()[(level-1)];
		
		pool.getConnection(function(err, connection){
			connection.query("insert into logs set ?", {gameid : socket.gameID, human_time : humantime, timestamp : timestamp, player : playerNumber, mode : !socket.mode, levelno : level, levelname : name, message : data}, function(err, result){
				if(err) throw err;
				connection.end();
			});
		});
	});
	
	socket.on('updatePartner', function(x,y){
		socket.broadcast.to(socket.room).emit('updatePartner',x,y);
	});
	
	socket.on('updateBall', function(x,y){
		socket.broadcast.to(socket.room).emit('updateBall',x,y);
	});
	
	socket.on('updateBlocks', function(blocks){
		socket.broadcast.to(socket.room).emit('updateBlocks', blocks);
	});
	
	socket.on('message', function(message){
		socket.broadcast.to(socket.room).emit('message', message);
	});
	
	socket.on('block', function(x, y){
		socket.broadcast.to(socket.room).emit('block', x, y);
	});
	
	socket.on('teleport', function(x, y, direction){
		socket.broadcast.to(socket.room).emit('teleport', x, y, direction);
	});
	
	socket.on('advance', function(levelNo, playerNumber){
		MODES[socket.mode].advance(socket, levelNo, playerNumber);
	});
	
	socket.on('togglePartnerView', function(request){
		socket.broadcast.to(socket.room).emit('togglePartnerView', request);
	});

	socket.on('alert', function(message){
		socket.broadcast.to(socket.room).emit('alert', message);
	});
	
	socket.on("restart", function(){
		socket.emit("restart");
		socket.broadcast.to(socket.room).emit("restart");
	});
		
	socket.on("gameOver", function(){
		var clients = io.sockets.clients(socket.room);
		for(var i = 0; i < clients.length; i++){
			clients[i].leave(socket.room);
			clients[i].room = NO_PARTNER;
		}
	});
	
	socket.on('tutorial', function(setup){
		socket.mode = TUTORIAL_MODE;
		socket.room = NO_PARTNER;
		
		pool.getConnection(function(err, connection){
			connection.query("insert into tutorials set ?", {levels : MODES[TUTORIAL_MODE].getLevels().toString()}, function(err, result){
				if(err) throw err;
				socket.gameID = result.insertId;
				setup();
				connection.end();
			});
		});
	});

	socket.on('game', function(setup){
		socket.mode = GAME_MODE;
		waitingSockets.push(socket);
		pairUpSockets();
	});
	
	socket.on('disconnect', function(){
		if(socket.room != NO_PARTNER){
			var clients = io.sockets.clients(socket.room);
		
			var partnerSocket = (clients[0] == socket ? clients[1] : clients[0]);
			
			partnerSocket.emit('partnerDisconnect');
			partnerSocket.leave(socket.room);
			partnerSocket.room = NO_PARTNER;
			
		}else if(socket.mode == GAME_MODE){
			var index = waitingSockets.indexOf(socket);
			waitingSockets.splice(index,1);
		}
	});
});

/**
 * pairs up two sockets if possible
 */
function pairUpSockets(address){

    if(waitingSockets.length >= 2){
		var client1 = waitingSockets.shift();
		var client2 = waitingSockets.shift();
		
		var room = currentRoom.toString();
		currentRoom++;
		
		pool.getConnection(function(err, connection){
			connection.query("insert into games set ?", {levels : MODES[GAME_MODE].getLevels().toString(), ip1 : client1.handshake.address.address, ip2 : client2.handshake.address.address, tutorialid1 : client1.gameID, tutorialid2 : client2.gameID}, function(err, result){
				if(err) throw err;
			
				var gameID = result.insertId;
			
				client1.join(room);
				client1.room = room;
				client1.gameID = gameID;
				client1.emit("setup", 1);
	
				client2.join(room);
				client2.room = room;
				client2.gameID = gameID;
				client2.emit("setup", 2);
				
				connection.end();
			});
		});
    }
}
