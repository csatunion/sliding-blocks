/* CONSTANTS */
var LOADING       = -1;
var GAME_MODE     = 0;
var TUTORIAL_MODE = 1;

var MODES = [require('./serverModules/game.js'), require('./serverModules/tutorial.js')];

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
    user : "blocksserver",
    password : "bl0ck5",
    database : "blockstest2"
});

io.sockets.on('connection', function(socket){

    socket.room = NO_PARTNER;
    socket.mode = LOADING;
    var connectionTime = new Date();

    // log id for player
    pool.getConnection(function(err, connection){	    
	if (!err) {		 
	    connection.query("insert into player set ?", {ip : socket.handshake.address.address, humantime : connectionTime, timestamp : connectionTime.getTime()}, function(err, result){
		if(err) throw err;
		socket.playerID = result.insertId;
		connection.release();
	    });
	}
    });
    
    socket.on('log', function(humantime, timestamp, playerNumber, gamemode, level, data){

	if (socket.mode != LOADING) {
	    var name = MODES[socket.mode].getLevels()[(level-1)];
	    var gameID = socket.gameID;
	} else {
	    var name = "start";
	    var gameID = -1;
	}

	pool.getConnection(function(err, connection){
	    
	    if (!err) {		    
		connection.query("insert into log set ?", {humantime : humantime, timestamp : timestamp, playerid : socket.playerID, gameid : gameID, mode : gamemode, levelno : level, levelname : name, message : data}, function(err, result){
		    //connection.query("insert into logs set ?", {gameid : socket.gameID, human_time : humantime, timestamp : timestamp, player : playerNumber, tutorial : socket.mode, mode : gamemode, levelno : level, levelname : name, message : data}, function(err, result){
		    if(err) throw err;
		    connection.release();
		});
	    }
	});
    });
    
    socket.on ('ready', function() {
	console.log ("Sending id reminder");
	socket.emit ('message', "If you haven't sent your participant id yet, please, start by typing it into the chat box below.");
    });

    socket.on ('synchronizing', function () {
	var serverTime = new Date().getTime();
	socket.emit ('synchronizing', serverTime);
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
	console.log ("I am player " + playerNumber + ". Advancing to " + levelNo)
	MODES[socket.mode].advance(socket, levelNo, playerNumber);
	//socket.emit ("synchronizing");
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
	var clientIds = io.sockets.adapter.rooms[socket.room];
	for (var oneClientId in clientIds) {
	    var client_socket = io.sockets.connected[oneClientId];
	    client_socket.leave (socket.room);
	    client_socket.room = NO_PARTNER;
	}
    });
    
    socket.on('tutorial', function(setup){
	socket.mode = TUTORIAL_MODE;
	socket.room = NO_PARTNER;
	
	pool.getConnection(function(err, connection){

	    if (err) {
		console.log ("No database connection.");
		socket.gameID = "noDB";
		setup();
	    } else {
		connection.query("insert into games set ?", {tutorial : true, player1id : socket.playerID, levels : MODES[TUTORIAL_MODE].getLevels().toString()}, function(err, result){
		    // connection.query("insert into tutorials set ?", {levels : MODES[TUTORIAL_MODE].getLevels().toString(), ip : socket.handshake.address.address}, function(err, result){
		    if(err) throw err;
		    socket.gameID = result.insertId;
		    setup();
		    connection.release();
		});
	    }
	});
    });

    socket.on('game', function(setup){
	socket.mode = GAME_MODE;
	waitingSockets.push(socket);
	pairUpSockets();
    });
    
    socket.on('disconnect', function(){
	if(socket.room != NO_PARTNER){
	    //var clients = io.sockets.clients(socket.room);
	    var clientIds = io.sockets.adapter.rooms[socket.room];
	    for (var oneClientId in clientIds) {
		var client_socket = io.sockets.connected[oneClientId];
		if (client_socket != socket) {
		    //var partnerSocket = (clients[0] == socket ? clients[1] : clients[0]);
		    client_socket.emit('partnerDisconnect');
		    client_socket.leave(socket.room);
		    client_socket.room = NO_PARTNER;
		    client_socket.mode = LOADING;
		}
	    }
	    
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

    console.log ("waiting sockets: " + waitingSockets.length)

    if(waitingSockets.length >= 2){

	var client1 = waitingSockets.shift();
	var client2 = waitingSockets.shift();
	
	var room = currentRoom.toString();
	currentRoom++;
	
	pool.getConnection(function(err, connection){

	    if (err) {
		var gameID = "noDB";
		
		client1.join(room);
		client1.room = room;
		client1.gameID = gameID;
		client1.emit("setup", 1);
		
		client2.join(room);
		client2.room = room;
		client2.gameID = gameID;
		client2.emit("setup", 2);
	    } else {
		connection.query("insert into games set ?", {tutorial : false, player1id : client1.playerID, player2id : client2.playerID, levels : MODES[GAME_MODE].getLevels().toString()}, function(err, result){
		    //connection.query("insert into games set ?", {levels : MODES[GAME_MODE].getLevels().toString(), ip1 : client1.handshake.address.address, ip2 : client2.handshake.address.address, tutorialid1 : client1.gameID, tutorialid2 : client2.gameID}, function(err, result){
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
		    
		    connection.release();
		});
	    }
	});
    }
}
