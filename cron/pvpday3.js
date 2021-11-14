const announce = require('./../lib/announce.js');
// const currentWeek = require("./../lib/time.js");

module.exports = {
	name: '12v12 rank day reminder',
	schedule: '0 12 4-11 12 Sat',
	async action() {
    announce("<:pvpr:678097570618408961> Today's event is **Holy Ground War** <:pvpr:678097570618408961>")
	},
};
