const announce = require('./../lib/announce.js');

module.exports = {
	name: 'pvp rank day reminder',
	schedule: '0 12 * * Sat',
	async action() {
    announce("<:pvpr:678097570618408961> Hari ini ada **PvP Rank** <:pvpr:678097570618408961>")
	},
};

