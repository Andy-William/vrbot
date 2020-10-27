const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 18 28 10 *',
	async action() {
    announce("🚧 Menurut jadwal, maintenance sudah selesai! 🚧")
	},
};
