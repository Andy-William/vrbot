const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
  schedule: '34 15 5 3 *',
	async action() {
    announce("🚧 Maintenance diundur sampai jam 18:00 WIB 🚧")
	},
};

