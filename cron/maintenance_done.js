const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 14 12 7 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
