const announce = require('./../lib/announce.js');
// const currentWeek = require("./../lib/time.js");

module.exports = {
	name: 'pvp rank day reminder',
	schedule: '0 12 1-5 9 Sat',
	async action() {
    // const weekNum = currentWeek.week(new Date());
    // if( weekNum >= 2674 && weekNum <=2675 ) announce("<:pvpr:678097570618408961> Hari ini ada **PvP Rank** <:pvpr:678097570618408961>")
    // const weekCycle= (currentWeek.week(new Date())-2)%10;
    announce("<:pvpr:678097570618408961> Today's event is **Holy Ground War** at 20:00 server time <:pvpr:678097570618408961>")
    // announce("<:pvpr:678097570618408961> Today's event is **PvP Rank** at 18:00 server time <:pvpr:678097570618408961>")
	},
};