const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 0 28 3 *',
	async action() {
    announce("🚧 Menurut jadwal, maintenance sudah selesai! 🚧")
	},
};
