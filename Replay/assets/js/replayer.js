var deltaT;
var deltaLog;
var startTime;
var startLog;
var logcounter;

var ball;
var ballHolder;
var player1;
var player2;
//var player;

function loadLogs () {
    
    gameid = $(this).attr("id");
    level = 0;
    background = "../images/treasure-map-6-scaled.png";

    console.log ("loading game " + gameid);
    $("#chat").empty();
    postMessage ("Loading game "+gameid, false);

    Crafty.init(2 * WIDTH, HEIGHT);
    
    Crafty.scene("loading");

    return false;
}


function startReplay () {

    console.log ("replaying game " + gameid);
    postMessage ("Playing game "+gameid, false);

    deltaT = 0;
    deltaLog = 0;
    startTime = new Date().getTime();
    startLog  = gamelog[0]['timestamp'];
    logcounter = 0;

    replaytimer = setTimeout (replayLoop, 10); 
}


function replayLoop () {
    deltaLog = gamelog[logcounter]['timestamp'] - startLog;
    deltaT = new Date().getTime() - startTime;
    if (deltaT >= deltaLog) {
	//console.log (gamelog[logcounter]['gameid']);
	processLogEntry (gamelog[logcounter]);
	logcounter++;
    }

    if (logcounter < gamelog.length) {
	replaytimer = setTimeout (replayLoop, 10); 
    }
}


function processLogEntry (logEntry) {

    var msg = logEntry['message'];
    var playerNumber = logEntry["player"];

    if (msg == "Level Started") {
	var levelname = logEntry['levelname'];
	if (!level || levelname != level) {
	    level = levelname;
	    console.log ("Load level: " + level);
	    Crafty.scene("level", levelname);
	}
    } else if (msg.search("block")==0) {
	// place a block in the other player's map
    } else if (msg.search("position")==0) {
	var msgsplit = msg.split (" ");
	var player_x = parseInt(msgsplit[0].split(":")[1]);
	var player_y = parseInt(msgsplit[1]);
	var ball_x = parseInt(msgsplit[2].split(":")[1]);
	var ball_y = parseInt(msgsplit[3]);
	if ( playerNumber == 2 ) {
	    player_x += WIDTH;
	    ball_x += WIDTH;
	}

	updateBallPosition (ball_x, ball_y, playerNumber);
	updatePlayerPosition (player_x, player_y, playerNumber);
    }
    else if (msg.search("message")==0) {
	var chatmsg = msg.slice("message: ".length);
	var cssclass = "received-by-player" + playerNumber;
	postMessage (chatmsg, cssclass);
    }
    else {
	console.log ("Other msg: "+msg);
    }
}


function postMessage (msg, cssclass) {
    if (cssclass) {
	var html = "<p class=\""+cssclass+"\">" + msg + "</p>";
    } else {
	var html = "<p>" + msg + "</p>";
    }
    $("#chat").append (html);
}


function updateBallPosition (ball_x, ball_y, playerNumber) {

    //console.log (ball_x+" "+ball_y+" "+playerNumber);
    if ( ballHolder == playerNumber ) {
	ball.x = ball_x;
	ball.y = ball_y;
    }
}


function updatePlayerPosition (player_x, player_y, playerNumber) {

    if ( playerNumber == 1 ) {
	player1.x = player_x;
	player1.y = player_y;
    }
    else {
	player2.x = player_x;
	player2.y = player_y;
    }
}
