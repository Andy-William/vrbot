const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 4 30 9 *',
	async action() {
    announce("🚧 Saatnya maintenance! Menurut jadwal akan selesai pukul 07:00 WIB! 🚧")
	},
};

