var gameinfo;

var gameid;
var level;
var levels;
var background;
var gamelog;
var replaytimer;

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
	       console.log (data.length);
	       console.log (data[0]);
	       console.log (data[1]);
	       console.log (data[2]);
	       console.log (data[3]);
	       console.log (data[4]);
	       console.log (data[5]);
	       console.log (data[data.length-2]);
	       console.log (data[data.length-1]);
	       gamelog = data;
	       if (replaytimer) clearTimeout (replaytimer);
	       startReplay ();
	   });
