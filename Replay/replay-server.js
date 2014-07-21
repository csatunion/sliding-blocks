
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
	user : "blocksserver",
	password : "bl0ck5",
	database : "blockstest"
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
			  var response = queryMysqlPool ( 'select * from tutorials;' );
			  socket.emit ('listing games', "hello");
		      });
       });



function queryMysqlPool (query) {

    var response;

    pool.getConnection(
	function(err, connection) {

	    if ( err ) throw err;

	    console.log ("connected to mysql");
	    connection.query( query, 
			      function(err, rows) {
				  if ( err ) throw err;
				  //console.log (rows);
				  connection.release();
				  response = rows;
			      });
	});

    return response;
}