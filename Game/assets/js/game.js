var socket = io.connect(SERVER_ADDR);

//server attributes
var channelNumber;                                         
var playerNumber = 1;
var gameid;
var ball;
var player;
var goal;
var hints = [];

var firstPlayThrough = true;
var playingGame = false;
var tutorial = false;
var tutorialPlayed = false;
 
//log attributes
var logText = "";

window.onload = function(){
	 Crafty.init(WIDTH, HEIGHT);
     Crafty.scene("loading");
}

window.onbeforeunload = function(){
	if(logText != "")
    	socket.emit("log", logText);
    socket.emit("partnerDisconnected", channelNumber);
}

function gameLog(logmsg) {
    currentTime = new Date();
    logtime = currentTime.toDateString()+","+currentTime.toTimeString()+","+currentTime.getTime();
    logentry = logtime +","+ gameid + "," + playerNumber +","+ logmsg;
    logText = logText + "\n" + logentry;
}

function destroyHints(){
	for(var i = 0; i < hints.length; i++){
		hints[i].destroy();
	}
	hints = [];
}

function destroyHint(index){
	hints[index].destroy();
}

