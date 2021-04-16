const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 22 27 3 *',
	async action() {
    announce("🚧 Saatnya maintenance! Menurut jadwal akan selesai pukul 00:00 WIB! 🚧")
	},
};

