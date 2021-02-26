const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '1 0 26 2 *',
	async action() {
    announce("🚧 Saatnya maintenance! Menurut jadwal akan selesai pukul 13:00 WIB! 🚧")
	},
};

