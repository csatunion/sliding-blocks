var deltaT;
var deltaLog;
var startTime;
var startLog;
var logcounter;


function loadLogs () {
    
    gameid = $(this).attr("id");
    level = 0;
    background = "../images/treasure-map-6-scaled.png";

    console.log ("loading game " + gameid);
    //$("#chat").empty().append ("<p>Loading game " + gameid + "</p>");
    $("#chat").empty();
    postMessage ("Loading game "+gameid, false);

    socket.emit ('get log', {gameid: gameid});

    Crafty.init(2 * WIDTH, HEIGHT);
    Crafty.load([background], 
		function(){
		    Crafty.background("#000 url("+background+")");
		});
    
    //Crafty.scene("game");

    return false;
}


function startReplay () {

    console.log ("replaying game " + gameid);
    //$("#chat").append ("<p>Playing game " + gameid + "</p>");
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
    var player = logEntry["player"];

    if (msg == "Level Started") {
	var levelname = logEntry['levelname'];
	if (!level || levelname != level) {
	    level = levelname;
	    console.log ("Load level: " + level);
	    socket.emit ('levelmaps', {levelname: levelname});
	}
	// OK ask server for level maps
	// server opens file, parses maps and sends them back
	// when they come back, draw level maps
    } else if (msg.search("position")==0) {
	var msgsplit = msg.split (" ");
	var player_x = msgsplit[0].split(":")[1];
	var player_y = msgsplit[1]
	var ball_x = msgsplit[2].split(":")[1];
	var ball_y = msgsplit[3]
	// TODO TODO
	// console.log ("player pos: "+player_x+","+player_y+" ball pos:"+ball_x+","+ball_y);
    }
    else if (msg.search("message")==0) {
	var chatmsg = msg.slice("message: ".length);
	//console.log ("Player "+player+" says: "+chatmsg);
	var cssclass = "player" + player;
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
