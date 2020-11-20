const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

module.exports = {
	name: 'pvp rank day reminder',
	schedule: '0 12 * * Sat',
	async action() {
    const weekNum = currentWeek.week(new Date());
    if( (weekNum-1)%10 >= 4 ) announce("<:pvpr:678097570618408961> Hari ini ada **PvP Rank** <:pvpr:678097570618408961>")
	},
};

/*
have pvp:
2645
2646
2647
2648
2649
2650

2655
*/