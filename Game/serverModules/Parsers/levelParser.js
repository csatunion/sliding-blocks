var mapParser = require("./mapParser.js");

/**
 * parses two player maps 
 */
exports.parseLevel = function (data){
	maps = data.split("&");
	maps[0] = mapParser.parseMap(maps[0]);
	maps[1] = mapParser.parseMap(maps[1]);
	
	return maps;
}
