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
    $("#chat").empty().append ("<p>Loading game " + gameid + "</p>");

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
    $("#chat").append ("<p>Playing game " + gameid + "</p>");

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
	//console.log ("current: " + new Date().getTime());
	//console.log (gamelog[logcounter]['timestamp']);
	//console.log (gamelog[logcounter]['gameid']+": "+logcounter+" of "+gamelog.length);
	console.log (gamelog[logcounter]['gameid']);
	logcounter++;
    }

    // if (logcounter >= gamelog.length) {
    // 	console.log ("HIER HIER HIER");
    // 	clearTimeout(replaytimer);
    // }
    if (logcounter < gamelog.length) {
	replaytimer = setTimeout (replayLoop, 10); 
    }
}
