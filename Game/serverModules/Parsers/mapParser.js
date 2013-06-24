/**
 * parses a single map
 */
exports.parseMap = function (map){
	map = map.split(":");
	for(var i = 0; i < map.length; i++)
		map[i] = map[i].split(",");
	
	return map;
}
