const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
  schedule: '0 11 28 10 *',
	async action() {
    // announce("🚧 Maintenance extended jam 18:00 WIB 🚧")
	},
};
