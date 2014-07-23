var gameinfo;

var gameid;
var level;
var levels;
var background;
var gamelog;

var socket = io();

window.onload = function () { socket.emit ('list games'); };


socket.on ('listing games', 
	   function (data) {

	       $("#games").append (document.createElement ("ul"));
	       gameinfo = data;

	       for (key in data) {

    		   console.log (data[key]);
		   var gameid = data[key]['gameid'];

		   $("#games ul").append ("<li><a href=\"\" id=\"" + gameid + "\">" + gameid + "</a></li>");
		   $("#" + gameid).click (loadLogs);  // replayer.js
	       }

	   });


socket.on ('log',
	   function (data) {
	       //console.log (data.length);
	       //console.log (data[0]);
	       gamelog = data;
	       startReplay ();
	   });
