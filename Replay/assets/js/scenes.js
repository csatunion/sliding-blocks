
Crafty.scene("level", 
	     function(levelname){

		 socket.emit ('levelmaps', {levelname: levelname});
	     });


Crafty.scene("loading", 
	     function(){

		 Crafty.sprite(CELL_SIZE, "images/box.png", {
    		     Box : [0,0],
    		     PartnerBox : [0,0]
		 });

		 Crafty.load([background, "../images/box.png"], 
			     function(){
				 Crafty.background("#000 url("+background+")");
			     });
		 
		 socket.emit ('get log', {gameid: gameid});
	     });

    
function findLevelStarts () {

    levelStarts = [];

    for (var i=0; i<gamelog.length; i++) {
	if ( gamelog[i]['message'] == "Level Started" ) {
	    var levelname = gamelog[i]['levelname'];
	    if ( levelStarts.length==0 || levelname != levelStarts[levelStarts.length-1]['levelname'] ) {
		levelStarts.push({'levelname':levelname, 'frame':i});
	    }
	}
    }
}
