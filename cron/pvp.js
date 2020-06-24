const announce = require('./../lib/announce.js');

module.exports = {
	name: 'pvp rank reminder',
	schedule: '0 20 * * Sat',
	async action() {
    //announce("<:pvpr:678097570618408961> **PvP Rank** dimulai! Klik tombol PvP untuk ikut. <:pvpr:678097570618408961>")
	},
};