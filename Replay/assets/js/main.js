var gameinfo;

var gameid;
var level;
//var levelNo;
//var levels;
var background;
var gamelog;
var levelStarts;
var replaytimer;

var socket = io();

function decorate_buttons () {

    $("#pause")[0].onclick = function () { toggleReplay (); };   // replayer.js

    //$("#rw10")[0].onclick = function () { skipFrames (-10); };   // replayer.js
    //$("#rw100")[0].onclick = function () { skipFrames (-100); };   // replayer.js
    //$("#ff10")[0].onclick = function () { skipFrames (10); };   // replayer.js
    //$("#ff100")[0].onclick = function () { skipFrames (100); };   // replayer.js
    $("#prev")[0].onclick = function () { skipLevel (-1); };   // replayer.js
    $("#next")[0].onclick = function () { skipLevel (1); };   // replayer.js
}


window.onload = function () { 
    
    decorate_buttons ();

    socket.emit ('list games'); 
};





