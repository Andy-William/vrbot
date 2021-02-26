const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

module.exports = {
	name: 'pvp rank day reminder',
	schedule: '0 12 * * Sat',
	async action() {
    return;
    const weekCycle= (currentWeek.week(new Date())-2)%10;
    if( weekCycle >= 7 ) announce("<:pvpr:678097570618408961> Hari ini ada **Holy Ground War** <:pvpr:678097570618408961>")
    else if( weekCycle >= 3 ) announce("<:pvpr:678097570618408961> Hari ini ada **PvP Rank** <:pvpr:678097570618408961>")
	},
};

/*
have pvpr:
2655
2656
2657
2658

have holy war:
2659
2660
2661

have tournament:
2665
*/