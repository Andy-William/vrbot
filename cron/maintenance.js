const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 10 29 6 *',
	async action() {
    announce("🚧 Saatnya maintenance! Menurut jadwal akan selesai pukul 17:00 WIB! 🚧")
	},
};

