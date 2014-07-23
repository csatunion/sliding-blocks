
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

    var deltaT = 0;
    var deltaLog = 0;
    var startTime = new Date().getTime();
    var startLog  = gamelog[0]['timestamp'];
    var logcounter = 0;

    var timer = setInterval (function () {
	deltaLog = gamelog[logcounter]['timestamp'] - startLog;
	deltaT = new Date().getTime() - startTime;
	if (deltaT >= deltaLog) {
	    console.log (gamelog[logcounter]);
	    logcounter++;
	}

	if (logcounter >= gamelog.length) {
	    clearInterval(timer);
	}

    }, 20); 
}
