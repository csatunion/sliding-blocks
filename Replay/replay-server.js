
/* SERVER SETUP */
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
//var fs      = require('fs');
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
	database : "blocks"     //"blockstest"
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

			  var queryp1 = 'select * from logs where player = 1 and gameid = '+data['gameid']+' and tutorial = 0 order by timestamp;';
			  var queryp2 = 'select * from logs where player = 2 and gameid = '+data['gameid']+' and tutorial = 0 order by timestamp;';

			  pool.getConnection(

			      function (err, connection) {

				  if ( err ) throw err;

				  console.log ("connected to mysql");
				  
				  connection.query (queryp1, 
						    function (err, rowsp1) {
							connection.query (queryp2,
									  function (err, rowsp2) {
									      connection.release();
									      rows = syncPlayers (rowsp1, rowsp2);
									      sendResultsToClient (err, rows, socket, 'log');
									  });
						    });
			      });

		      });
       });


function sendResultsToClient (err, rows, socket, topic) {
    if ( err ) throw err;
    //console.log (rows);
    socket.emit (topic, rows);
}

function syncPlayers (rowsp1, rowsp2) {
    
    var diff = rowsp1[rowsp1.length-1]['timestamp'] - rowsp2[rowsp2.length-1]['timestamp'];

    console.log ("Now syncing players:" + rowsp1.length + " " + rowsp2.length + " (" + diff + ")");

    for (i in rowsp2) {
	rowsp2[i]['timestamp'] = rowsp2[i]['timestamp'] + diff;
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
