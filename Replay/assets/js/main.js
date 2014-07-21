var socket = io();

window.onload = function () { socket.emit ('list games'); };


socket.on ('listing games', 
	   function (data) {
	       console.log (data);
	   });

// get game ids from server
// and display
