const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 11 13 5 *',
	async action() {
    announce("🚧 Saatnya maintenance! Menurut jadwal akan selesai pukul 15:00 WIB! 🚧")
	},
};

