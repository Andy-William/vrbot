const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 17 29 6 *',
	async action() {
    announce("🚧 Menurut jadwal, maintenance sudah selesai! 🚧")
	},
};
