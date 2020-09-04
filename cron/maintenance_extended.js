const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
  schedule: '1 18 29 6 *',
	async action() {
    announce("🚧 Maintenance diundur sampai jam 21:00 WIB 🚧")
	},
};

