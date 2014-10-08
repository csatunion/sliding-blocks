var deltaT;
var deltaLog;
var startTime;
var startLog;
var logcounter;

var paused;
var pauseRequested;

var ball;
var ballHolder;
var player1;
var player2;
var blocksPlaced = {1:[], 2:[]};


function loadLogs () {
    
    gameid = $(this).attr("id");
    //level = 0;
    background = "../images/pirate-map.png";

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
    pauseRequested = false;
    paused = false;

    replaytimer = setTimeout (replayLoop, 10); 
}


function replayLoop () { //  HIER HIER HIER deal with pausing
    deltaLog = gamelog[logcounter]['timestamp'] - startLog;
    deltaT = new Date().getTime() - startTime;
    if (deltaT >= deltaLog) {
	//console.log (gamelog[logcounter]['gameid']);
	processLogEntry (gamelog[logcounter]);
	logcounter++;
    }

    if (logcounter < gamelog.length && ! pauseRequested) {
	replaytimer = setTimeout (replayLoop, 10);
    }
    else if ( pauseRequested ) {
	paused = true;
    }
}


function toggleReplay () {
    
    pauseRequested = ! pauseRequested;
    console.log ("Toggleing replay. Pause requested: " + pauseRequested);

    if ( ! pauseRequested && paused ) {
	startLog = gamelog[logcounter]['timestamp'];
	startTime = new Date().getTime();
	paused = false;
	replaytimer = setTimeout (replayLoop, 10);
    }
}


function skipLevel (skipSize) {
    
    var current;  
    var next = 0;

    for (var i=0; i<levelStarts.length; i++) {
	if ( levelStarts[i]['levelname'] == level ) {
	    current = i;
	    break;
	}
    }

    next = current + skipSize;
    if ( next < 0 ) {
	next = 0;
    } else if ( next >= levelStarts.length ) {
	next = levelStarts.length - 1;
    }

    console.log ("Jumping levels: " + skipSize);
    postMessage ("Skipping to level " + levelStarts[next]['levelname']);
    if (replaytimer) clearTimeout (replaytimer);
    logcounter = levelStarts[next]['frame'];
    startLog = gamelog[logcounter]['timestamp'];
    startTime = new Date().getTime();
    replaytimer = setTimeout (replayLoop, 10);
}


function processLogEntry (logEntry) {

    var msg = logEntry['message'];
    var playerNumber = logEntry["player"];

    if (msg == "Level Started") {
	var levelname = logEntry['levelname'];
	if (!level || levelname != level) {
	    startLevel (levelname);
	}
    } else if (msg.search("block")==0) {
	// place a block in the other player's map
	var msgsplit = msg.split (" ");
	var block_x = parseInt(msgsplit[1]);
	var block_y = parseInt(msgsplit[2]);
	if ( playerNumber == 2 ) {
	    block_x += WIDTH;
	}

	var box = drawBox (block_x, block_y);

	blocksPlaced[playerNumber].push (box);
	if (blocksPlaced[playerNumber].length > 3){
	    blocksPlaced[playerNumber][0].destroy();
	    blocksPlaced[playerNumber] = blocksPlaced[playerNumber].slice(1);
	}


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
    
    } else if (msg.search("message")==0) {
	var chatmsg = msg.slice("message: ".length);
	var cssclass = "received-by-player" + playerNumber;
	postMessage (chatmsg, cssclass);
    }
    else {
	console.log ("Other msg: "+msg);
    }
}


function startLevel (levelname) {
    level = levelname;
    blocksPlaced = {1:[], 2:[]};
    console.log ("Load level: " + level);
    Crafty.scene("level", levelname);
}


function postMessage (msg, cssclass) {
    if (cssclass) {
	var html = "<p class=\""+cssclass+"\">" + msg + "</p>";
    } else {
	var html = "<p>" + msg + "</p>";
    }
    $("#chat").append (html);
    //console.log ($("#chat").scrollTop() + "   " + $("#chat")[0].scrollHeight);
    $("#chat").scrollTop ( $("#chat")[0].scrollHeight );
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
