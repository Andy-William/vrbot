const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 16 22 3 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
