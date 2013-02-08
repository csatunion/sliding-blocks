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

function destroyHints(indexList){
	hints.push(drawArrow(ball.x + ball.w/2, ball.y + ball.h + WALL_WIDTH_HEIGHT, 270));
	for(i = 0; i < indexList.length; i++){
		hints[indexList[i]].destroy();
	}
	for(i = 0; i < indexList.length; i++){
		hints.splice(indexList[i], 1);
	}
	hints.pop().destroy();
}
