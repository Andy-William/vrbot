const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 15 13 5 *',
	async action() {
    announce("🚧 Menurut jadwal, maintenance sudah selesai! 🚧")
	},
};

