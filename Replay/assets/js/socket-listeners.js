
socket.on ('listing games', 
	   function (data) {

	       $("#games").append (document.createElement ("ul"));
	       //ggameinfo = data;

	       for (key in data) {

    		   console.log (data[key]);
		   var gameid = data[key]['id'];

		   gameinfo[gameid] = data[key];

		   $("#games ul").append ("<li><a href=\"\" id=\"" + gameid + "\">" + gameid + "</a></li>");
		   $("#" + gameid).click (loadLogs);  // replayer.js
	       }

	   });


socket.on ('levelmaps',
	   function (data) {
	       console.log ("Receiving map data from server"); // for level " +levelname);
	       var map1 = data[1];
	       var map2 = data[2];
	       
	       drawLevel(map1, 1);
	       drawLevel(map2, 2);
	   });


socket.on ('log',
	   function (data) {
	       // console.log (data.length);
	       gamelog = data;
	       findLevelStarts ();
	       console.log ("New levels starting at: ");
	       console.log (levelStarts);
	       if (replaytimer) clearTimeout (replaytimer);
	       startReplay ();
	   });
