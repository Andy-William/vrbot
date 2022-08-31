const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
  schedule: '14 11 11 8 *',
	async action() {
        // announce("🚧 False alarm, maintenance is at 11 PM 🚧")

    // announce("🚧 Maintenance extended jam 18:00 WIB 🚧")
	},
};
