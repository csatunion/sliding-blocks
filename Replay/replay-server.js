
/* SERVER SETUP */
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var fs      = require('fs');
var parser = require("../Game/serverModules/Parsers/levelParser.js");
var mysql   = require('mysql');

/*io.set('log level', 1);*/

server.listen(3000, function(){
    console.log('server listening on port 3000');
});

app.use(express.static(__dirname + '/assets'));

var pool = mysql.createPool({
    host : "localhost",
    user : "replayserver",   //"blocksserver",
    password : "bl0ck5",
    database : "blockstest2"     //"blockstest"
});


io.on ('connection', 
       function (socket) {
	   console.log ('User connected');

	   socket.on ('disconnect',
		      function () {
			  console.log ('User disconnected');
		      });

	   
	   socket.on ('list games',
		      function () {
			  console.log ('Client is requesting game ids');
			  
			  pool.getConnection(

			      function (err, connection) {

				  if ( err ) throw err;

				  console.log ("connected to mysql");
				  connection.query( 'select * from games;', 
						    function (err, rows) {
							connection.release();
							sendResultsToClient (err, rows, socket, 'listing games');
						    });
			      });
		      });


	   socket.on ('get log',
		      function (data) {
			  console.log ("Client is requesting game log for game " + data['gameid']);

			  //var queryp1 = 'select * from logs where player = 1 and gameid = '+data['gameid']+' and tutorial = 0 order by timestamp;';
			  var queryp1 = 'select l.* from log as l, games as g where l.gameid = '+data['gameid']+' and g.id = '+data['gameid']+' and l.playerid = g.player1id order by timestamp;';
			  //var queryp2 = 'select * from logs where player = 2 and gameid = '+data['gameid']+' and tutorial = 0 order by timestamp;';
			  var queryp2 = 'select l.* from log as l, games as g where l.gameid = '+data['gameid']+' and g.id = '+data['gameid']+' and l.playerid = g.player2id order by timestamp;';

			  var querytiming1 = 'select l.message from log as l, games as g where g.id = '+data['gameid']+' and l.playerid = g.player1id and message like \'clientTime1%\';';
			  var querytiming2 = 'select l.message from log as l, games as g where g.id = '+data['gameid']+' and l.playerid = g.player2id and message like \'clientTime1%\';';

			  pool.getConnection(

			      function (err, conn) {

				  if ( err ) throw err;

				  console.log ("connected to mysql");
				  
				  conn.query (queryp1, 
					      function (err, rowsp1) {
						  conn.query (queryp2,
							      function (err, rowsp2) {
								  conn.query (querytiming1,
									      function (err, timesp1) {
										  conn.query (querytiming2,
											      function (err, timesp2) {
												  conn.release();
												  rows = syncPlayers (rowsp1, rowsp2, timesp1, timesp2);
												  sendResultsToClient (err, rows, socket, 'log');
											      });
									      });
							      });
					      });
			      });
		      });
	   

	   socket.on ('levelmaps',
		      function (data) {
			  var levelname = data['levelname'];
			  console.log ("Client is requesting maps for level " + levelname);
			  
			  var map1;
    			  var map2;
			  var level = __dirname + "/../Game/levels/Game/" + levelname;

    			  fs.readFile(level, 'ascii', 
				      function(err, readdata) {
					  if (err){
		   			      console.log(err);
					  }else{
		    			      maps = parser.parseLevel(readdata);
		    			      map1 = maps[0];
		    			      map2 = maps[1];
					      sendResultsToClient (err, {1:map1, 2:map2}, socket, 'levelmaps'); // '+levelname);
					  }
				      });

		      });
       });


function sendResultsToClient (err, rows, socket, topic) {
    if ( err ) throw err;
    //console.log (rows);
    socket.emit (topic, rows);
}


function parseTimes (timesstring) {

    var times = timesstring.split(";");
    var client1 = parseInt(times[0].split(":")[1]);
    var server = parseInt(times[1].split(":")[1]);
    var client2 = parseInt(times[2].split(":")[1]);

    var delay = (client2 - client1) / 2;
    var offset = server - client1 - delay;
    return offset;
}


function syncPlayers (rowsp1, rowsp2, timesp1, timesp2) {

    var offset1 = parseTimes (timesp1[0]['message']);
    var offset2 = parseTimes (timesp2[0]['message']);
    
    console.log ("Now syncing player1:" + rowsp1.length + " " + offset1);
    for (i in rowsp1) {
	rowsp1[i]['timestamp'] = rowsp1[i]['timestamp'] + offset1;
    }

    console.log ("Now syncing player2:" + rowsp2.length + " " + offset2);
    for (i in rowsp2) {
	rowsp2[i]['timestamp'] = rowsp2[i]['timestamp'] + offset2;
    }

    var merged = [];
    var p1i = 0;
    var p2i = 0;

    while (p1i < rowsp1.length && p2i < rowsp2.length) {
	if (rowsp1[p1i]['timestamp'] <= rowsp2[p2i]['timestamp']) {
	    merged.push(rowsp1[p1i]);
	    p1i++;
	} else {
	    merged.push(rowsp2[p2i]);
	    p2i++;
	}
    }
    if (p1i < rowsp1.length) {
	merged = merged.concat (rowsp1.slice (p1i, rowsp1.length));
    }
    else {
	merged = merged.concat (rowsp2.slice (p2i, rowsp2.length));
    }
    
    return merged;
}

// function syncPlayers (rowsp1, rowsp2) {
    
//     var diff = rowsp1[rowsp1.length-1]['timestamp'] - rowsp2[rowsp2.length-1]['timestamp'];

//     console.log ("Now syncing players:" + rowsp1.length + " " + rowsp2.length + " (" + diff + ")");

//     for (i in rowsp2) {
// 	rowsp2[i]['timestamp'] = rowsp2[i]['timestamp'] + diff;
//     }

//     var merged = [];
//     var p1i = 0;
//     var p2i = 0;

//     while (p1i < rowsp1.length && p2i < rowsp2.length) {
// 	if (rowsp1[p1i]['timestamp'] <= rowsp2[p2i]['timestamp']) {
// 	    merged.push(rowsp1[p1i]);
// 	    p1i++;
// 	} else {
// 	    merged.push(rowsp2[p2i]);
// 	    p2i++;
// 	}
//     }
//     if (p1i < rowsp1.length) {
// 	merged = merged.concat (rowsp1.slice (p1i, rowsp1.length));
//     }
//     else {
// 	merged = merged.concat (rowsp2.slice (p2i, rowsp2.length));
//     }
    
//     return merged;
// }
