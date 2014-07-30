
Crafty.scene("level", 
	     function(levelname){

		 socket.emit ('levelmaps', {levelname: levelname});
		 socket.on ('levelmaps '+levelname,
			    function (data) {
				console.log ("Receiving map data from server for level "+levelname);
				var map1 = data[1];
				var map2 = data[2];
				
				drawLevel(map1, 1);
				drawLevel(map2, 2);
			    });
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
		 socket.on ('log',
			    function (data) {
				// console.log (data.length);
				// console.log (data[0]);
				// console.log (data[1]);
				// console.log (data[2]);
				// console.log (data[3]);
				// console.log (data[4]);
				// console.log (data[5]);
				// console.log (data[data.length-2]);
				// console.log (data[data.length-1]);
				gamelog = data;
				if (replaytimer) clearTimeout (replaytimer);
				startReplay ();
			    });
	     });

    
