const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 12 21 11 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
