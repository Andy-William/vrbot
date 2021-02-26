const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 13 26 2 *',
	async action() {
    announce("🚧 Menurut jadwal, maintenance sudah selesai! 🚧")
	},
};
3