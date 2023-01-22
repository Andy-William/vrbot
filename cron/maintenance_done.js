const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '30 11 10 1 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
