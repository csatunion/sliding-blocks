var socket = io.connect(SERVER_ADDR);

//server attributes
var channelNumber;                                         
var playerNumber;
var firstPlayThrough = true;
var playingGame = false;                                        

//log attributes
var logText = "";
var time;

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
    logentry = logtime +","+ playerNumber +","+ logmsg;
    logText = logText + "\n" + logentry;
}
